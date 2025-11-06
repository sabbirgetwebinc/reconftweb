"""
reconFTW wrapper service for executing scans
"""
import os
import subprocess
import json
import logging
from typing import Dict, Any, Optional
from pathlib import Path

from app.core.config import settings

logger = logging.getLogger(__name__)


class ReconFTWWrapper:
    """Wrapper for reconFTW CLI tool"""
    
    def __init__(self):
        self.reconftw_path = settings.RECONFTW_PATH
        self.output_path = settings.RECONFTW_OUTPUT_PATH
        self.docker_image = settings.RECONFTW_DOCKER_IMAGE
    
    def execute_scan(
        self,
        domain: str,
        scan_id: int,
        mode: str = "full",
        config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Execute a reconFTW scan
        
        Args:
            domain: Target domain to scan
            scan_id: Database scan ID
            mode: Scan mode (passive, active, full, osint, custom)
            config: Additional configuration options
        
        Returns:
            Dict with scan results and metadata
        """
        try:
            # Create output directory for this scan
            scan_output_dir = Path(self.output_path) / f"scan_{scan_id}"
            scan_output_dir.mkdir(parents=True, exist_ok=True)
            
            # Build reconFTW command
            cmd = self._build_command(domain, scan_id, mode, config, scan_output_dir)
            
            logger.info(f"Executing reconFTW scan {scan_id} for domain {domain}")
            logger.debug(f"Command: {' '.join(cmd)}")
            
            # Execute the scan
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=settings.SCAN_TIMEOUT_HOURS * 3600,
                cwd=self.reconftw_path
            )
            
            # Parse results
            scan_results = self._parse_results(scan_output_dir, domain)
            
            return {
                "success": result.returncode == 0,
                "return_code": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "output_dir": str(scan_output_dir),
                "results": scan_results
            }
            
        except subprocess.TimeoutExpired:
            logger.error(f"Scan {scan_id} timed out after {settings.SCAN_TIMEOUT_HOURS} hours")
            return {
                "success": False,
                "error": f"Scan timed out after {settings.SCAN_TIMEOUT_HOURS} hours",
                "output_dir": str(scan_output_dir) if 'scan_output_dir' in locals() else None
            }
        except Exception as e:
            logger.error(f"Error executing scan {scan_id}: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "output_dir": str(scan_output_dir) if 'scan_output_dir' in locals() else None
            }
    
    def _build_command(
        self,
        domain: str,
        scan_id: int,
        mode: str,
        config: Optional[Dict[str, Any]],
        output_dir: Path
    ) -> list:
        """Build the reconFTW command"""
        
        # Base command - using Docker for isolation
        cmd = [
            "docker", "run", "--rm",
            "-v", f"{output_dir}:/output",
            self.docker_image,
            "-d", domain,
            "-o", "/output"
        ]
        
        # Add mode-specific flags
        mode_flags = {
            "passive": ["-p"],
            "active": ["-a"],
            "full": [],  # Full is default
            "osint": ["-s"],
            "custom": []
        }
        
        if mode in mode_flags:
            cmd.extend(mode_flags[mode])
        
        # Add custom configuration
        if config:
            if config.get("skip_subdomain_enum"):
                cmd.append("--skip-subdomains")
            if config.get("skip_screenshots"):
                cmd.append("--skip-screenshots")
            if config.get("deep_scan"):
                cmd.append("--deep")
            if config.get("axiom_scan"):
                cmd.append("--axiom")
        
        return cmd
    
    def _parse_results(self, output_dir: Path, domain: str) -> Dict[str, Any]:
        """
        Parse reconFTW output files
        
        Args:
            output_dir: Directory containing scan results
            domain: Target domain
        
        Returns:
            Parsed results dictionary
        """
        results = {
            "subdomains": [],
            "endpoints": [],
            "vulnerabilities": [],
            "ports": [],
            "technologies": [],
            "ips": []
        }
        
        try:
            # Parse subdomains
            subdomains_file = output_dir / domain / "subdomains" / "subdomains.txt"
            if subdomains_file.exists():
                with open(subdomains_file, 'r') as f:
                    results["subdomains"] = [line.strip() for line in f if line.strip()]
            
            # Parse endpoints
            endpoints_file = output_dir / domain / "webs" / "webs.txt"
            if endpoints_file.exists():
                with open(endpoints_file, 'r') as f:
                    results["endpoints"] = [line.strip() for line in f if line.strip()]
            
            # Parse vulnerabilities (nuclei output)
            nuclei_file = output_dir / domain / "vulnerabilities" / "nuclei.json"
            if nuclei_file.exists():
                with open(nuclei_file, 'r') as f:
                    for line in f:
                        try:
                            vuln = json.loads(line)
                            results["vulnerabilities"].append(vuln)
                        except json.JSONDecodeError:
                            continue
            
            # Parse ports
            ports_file = output_dir / domain / "hosts" / "portscan.txt"
            if ports_file.exists():
                with open(ports_file, 'r') as f:
                    results["ports"] = [line.strip() for line in f if line.strip()]
            
            # Parse IPs
            ips_file = output_dir / domain / "hosts" / "ips.txt"
            if ips_file.exists():
                with open(ips_file, 'r') as f:
                    results["ips"] = [line.strip() for line in f if line.strip()]
            
        except Exception as e:
            logger.error(f"Error parsing results: {str(e)}")
        
        return results
    
    def cancel_scan(self, scan_id: int) -> bool:
        """
        Cancel a running scan
        
        Args:
            scan_id: Database scan ID
        
        Returns:
            True if cancelled successfully
        """
        try:
            # Find and stop Docker container for this scan
            container_name = f"reconftw_scan_{scan_id}"
            subprocess.run(
                ["docker", "stop", container_name],
                capture_output=True,
                timeout=30
            )
            return True
        except Exception as e:
            logger.error(f"Error cancelling scan {scan_id}: {str(e)}")
            return False
