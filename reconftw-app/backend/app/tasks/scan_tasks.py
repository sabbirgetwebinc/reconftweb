"""
Celery tasks for scan execution
"""
import logging
from datetime import datetime
from typing import Dict, Any

from app.tasks.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.scan import Scan, ScanStatus
from app.models.target import Target
from app.models.vulnerability import Vulnerability, VulnerabilitySeverity, VulnerabilityType
from app.models.scan_result import ScanResult, ResultType
from app.services.reconftw_wrapper import ReconFTWWrapper

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="app.tasks.scan_tasks.execute_scan")
def execute_scan(self, scan_id: int):
    """
    Execute a reconFTW scan
    
    Args:
        scan_id: Database scan ID
    """
    db = SessionLocal()
    
    try:
        # Get scan from database
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan:
            logger.error(f"Scan {scan_id} not found")
            return {"success": False, "error": "Scan not found"}
        
        # Get target
        target = db.query(Target).filter(Target.id == scan.target_id).first()
        if not target:
            logger.error(f"Target {scan.target_id} not found")
            scan.status = ScanStatus.FAILED
            scan.error_message = "Target not found"
            db.commit()
            return {"success": False, "error": "Target not found"}
        
        # Update scan status
        scan.status = ScanStatus.RUNNING
        scan.started_at = datetime.utcnow()
        scan.progress = 0.0
        scan.current_step = "Initializing scan"
        db.commit()
        
        # Execute reconFTW scan
        wrapper = ReconFTWWrapper()
        
        # Update progress
        self.update_state(state='PROGRESS', meta={'progress': 10, 'step': 'Starting reconFTW'})
        scan.progress = 10.0
        scan.current_step = "Starting reconFTW"
        db.commit()
        
        result = wrapper.execute_scan(
            domain=target.domain,
            scan_id=scan_id,
            mode=scan.mode,
            config=scan.config
        )
        
        if not result["success"]:
            scan.status = ScanStatus.FAILED
            scan.error_message = result.get("error", "Unknown error")
            scan.completed_at = datetime.utcnow()
            db.commit()
            return result
        
        # Update progress
        self.update_state(state='PROGRESS', meta={'progress': 50, 'step': 'Parsing results'})
        scan.progress = 50.0
        scan.current_step = "Parsing results"
        scan.output_path = result.get("output_dir")
        db.commit()
        
        # Parse and store results
        scan_results = result.get("results", {})
        
        # Store subdomains
        for subdomain in scan_results.get("subdomains", []):
            scan_result = ScanResult(
                scan_id=scan_id,
                result_type=ResultType.SUBDOMAIN,
                value=subdomain,
                subdomain=subdomain
            )
            db.add(scan_result)
        
        # Store endpoints
        for endpoint in scan_results.get("endpoints", []):
            scan_result = ScanResult(
                scan_id=scan_id,
                result_type=ResultType.ENDPOINT,
                value=endpoint,
                endpoint=endpoint
            )
            db.add(scan_result)
        
        # Store IPs
        for ip in scan_results.get("ips", []):
            scan_result = ScanResult(
                scan_id=scan_id,
                result_type=ResultType.IP_ADDRESS,
                value=ip,
                ip_address=ip
            )
            db.add(scan_result)
        
        # Store vulnerabilities
        for vuln_data in scan_results.get("vulnerabilities", []):
            vulnerability = _parse_vulnerability(vuln_data, scan_id)
            if vulnerability:
                db.add(vulnerability)
        
        # Update scan counts
        scan.subdomains_count = len(scan_results.get("subdomains", []))
        scan.endpoints_count = len(scan_results.get("endpoints", []))
        scan.vulnerabilities_count = len(scan_results.get("vulnerabilities", []))
        
        # Update progress
        self.update_state(state='PROGRESS', meta={'progress': 90, 'step': 'Finalizing'})
        scan.progress = 90.0
        scan.current_step = "Finalizing"
        db.commit()
        
        # Mark scan as completed
        scan.status = ScanStatus.COMPLETED
        scan.completed_at = datetime.utcnow()
        scan.progress = 100.0
        scan.current_step = "Completed"
        db.commit()
        
        logger.info(f"Scan {scan_id} completed successfully")
        
        return {
            "success": True,
            "scan_id": scan_id,
            "subdomains": scan.subdomains_count,
            "endpoints": scan.endpoints_count,
            "vulnerabilities": scan.vulnerabilities_count
        }
        
    except Exception as e:
        logger.error(f"Error executing scan {scan_id}: {str(e)}")
        
        # Update scan status
        if scan:
            scan.status = ScanStatus.FAILED
            scan.error_message = str(e)
            scan.completed_at = datetime.utcnow()
            db.commit()
        
        return {"success": False, "error": str(e)}
    
    finally:
        db.close()


def _parse_vulnerability(vuln_data: Dict[str, Any], scan_id: int) -> Vulnerability:
    """
    Parse vulnerability data from nuclei output
    
    Args:
        vuln_data: Vulnerability data from nuclei
        scan_id: Scan ID
    
    Returns:
        Vulnerability model instance
    """
    try:
        # Map nuclei severity to our severity enum
        severity_map = {
            "critical": VulnerabilitySeverity.CRITICAL,
            "high": VulnerabilitySeverity.HIGH,
            "medium": VulnerabilitySeverity.MEDIUM,
            "low": VulnerabilitySeverity.LOW,
            "info": VulnerabilitySeverity.INFO
        }
        
        severity = severity_map.get(
            vuln_data.get("info", {}).get("severity", "info").lower(),
            VulnerabilitySeverity.INFO
        )
        
        # Determine vulnerability type
        vuln_type = VulnerabilityType.OTHER
        tags = vuln_data.get("info", {}).get("tags", [])
        if isinstance(tags, str):
            tags = [tags]
        
        for tag in tags:
            tag_lower = tag.lower()
            if "xss" in tag_lower:
                vuln_type = VulnerabilityType.XSS
                break
            elif "sqli" in tag_lower or "sql" in tag_lower:
                vuln_type = VulnerabilityType.SQLI
                break
            elif "ssrf" in tag_lower:
                vuln_type = VulnerabilityType.SSRF
                break
            elif "lfi" in tag_lower:
                vuln_type = VulnerabilityType.LFI
                break
            elif "rce" in tag_lower:
                vuln_type = VulnerabilityType.RCE
                break
        
        vulnerability = Vulnerability(
            scan_id=scan_id,
            title=vuln_data.get("info", {}).get("name", "Unknown Vulnerability"),
            description=vuln_data.get("info", {}).get("description", ""),
            severity=severity,
            vuln_type=vuln_type,
            url=vuln_data.get("matched-at", vuln_data.get("host", "")),
            evidence=str(vuln_data.get("matched-line", "")),
            tool="nuclei",
            references=vuln_data.get("info", {}).get("reference", [])
        )
        
        return vulnerability
        
    except Exception as e:
        logger.error(f"Error parsing vulnerability: {str(e)}")
        return None
