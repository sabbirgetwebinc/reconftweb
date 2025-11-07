#!/bin/bash

# Function to show additional help
function show_additional_help() {
  echo "Usage: $0 [OPTION]"
  echo "Run the script with specified options."
  echo ""
  echo "  -h, --help       Display this help and exit."
  echo "  --tools          Install the tools before running, useful for upgrading."
  echo ""
  echo "  ****             Without any arguments, the script will update reconftw"
  echo "                   and install all dependencies and requirements."
  exit 0
}

# Load main configuration
CONFIG_FILE="./reconftw.cfg"

if [[ ! -f $CONFIG_FILE ]]; then
  echo -e "${bred}[!] Config file reconftw.cfg not found.${reset}"
  exit 1
fi

source "$CONFIG_FILE"

# Initialize variables
dir="${tools}"
double_check=false

# ARM Detection
ARCH=$(uname -m)

# macOS Detection
IS_MAC=$([[ $OSTYPE == "darwin"* ]] && echo "True" || echo "False")

# Check Bash version
BASH_VERSION_NUM=$(bash --version | awk 'NR==1{print $4}' | cut -d'.' -f1)
if [[ $BASH_VERSION_NUM -lt 4 ]]; then
  echo -e "${bred}Your Bash version is lower than 4, please update.${reset}"
  if [[ $IS_MAC == "True" ]]; then
    echo -e "${yellow}For macOS, run 'brew install bash' and rerun the installer in a new terminal.${reset}"
  fi
  exit 1
fi

# Declare Go tools and their installation commands
declare -A gotools=(
  ["gf"]="go install -v github.com/tomnomnom/gf@latest"
  ["brutespray"]="go install -v github.com/x90skysn3k/brutespray@latest"
  ["qsreplace"]="go install -v github.com/tomnomnom/qsreplace@latest"
  ["ffuf"]="go install -v github.com/ffuf/ffuf/v2@latest"
  ["github-subdomains"]="go install -v github.com/gwen001/github-subdomains@latest"
  ["gitlab-subdomains"]="go install -v github.com/gwen001/gitlab-subdomains@latest"
  ["nuclei"]="go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest"
  ["anew"]="go install -v github.com/tomnomnom/anew@latest"
  ["notify"]="go install -v github.com/projectdiscovery/notify/cmd/notify@latest"
  ["unfurl"]="go install -v github.com/tomnomnom/unfurl@v0.3.0"
  ["httpx"]="go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest"
  ["github-endpoints"]="go install -v github.com/gwen001/github-endpoints@latest"
  ["dnsx"]="go install -v github.com/projectdiscovery/dnsx/cmd/dnsx@latest"
  ["subjs"]="go install -v github.com/lc/subjs@latest"
  ["Gxss"]="go install -v github.com/KathanP19/Gxss@latest"
  ["katana"]="go install -v github.com/projectdiscovery/katana/cmd/katana@latest"
  ["crlfuzz"]="go install -v github.com/dwisiswant0/crlfuzz/cmd/crlfuzz@latest"
  ["dalfox"]="go install -v github.com/hahwul/dalfox/v2@latest"
  ["puredns"]="go install -v github.com/d3mondev/puredns/v2@latest"
  ["interactsh-client"]="go install -v github.com/projectdiscovery/interactsh/cmd/interactsh-client@latest"
  ["analyticsrelationships"]="go install -v github.com/Josue87/analyticsrelationships@latest"
  ["gotator"]="go install -v github.com/Josue87/gotator@latest"
  ["roboxtractor"]="go install -v github.com/Josue87/roboxtractor@latest"
  ["mapcidr"]="go install -v github.com/projectdiscovery/mapcidr/cmd/mapcidr@latest"
  ["cdncheck"]="go install -v github.com/projectdiscovery/cdncheck/cmd/cdncheck@latest"
  ["dnstake"]="go install -v github.com/pwnesia/dnstake/cmd/dnstake@latest"
  ["tlsx"]="go install -v github.com/projectdiscovery/tlsx/cmd/tlsx@latest"
  ["gitdorks_go"]="go install -v github.com/damit5/gitdorks_go@latest"
  ["smap"]="go install -v github.com/s0md3v/smap/cmd/smap@latest"
  ["dsieve"]="go install -v github.com/trickest/dsieve@master"
  ["inscope"]="go install -v github.com/tomnomnom/hacks/inscope@latest"
  ["enumerepo"]="go install -v github.com/trickest/enumerepo@latest"
  ["Web-Cache-Vulnerability-Scanner"]="go install -v github.com/Hackmanit/Web-Cache-Vulnerability-Scanner@latest"
  ["subfinder"]="go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest"
  ["hakip2host"]="go install -v github.com/hakluke/hakip2host@latest"
  ["mantra"]="go install -v github.com/Brosck/mantra@latest"
  ["crt"]="go install -v github.com/cemulus/crt@latest"
  ["s3scanner"]="go install -v github.com/sa7mon/s3scanner@latest"
  ["nmapurls"]="go install -v github.com/sdcampbell/nmapurls@latest"
  ["shortscan"]="go install -v github.com/bitquark/shortscan/cmd/shortscan@latest"
  ["sns"]="go install github.com/sw33tLie/sns@latest"
  ["ppmap"]="go install -v github.com/kleiton0x00/ppmap@latest"
  ["sourcemapper"]="go install -v github.com/denandz/sourcemapper@latest"
  ["jsluice"]="go install -v github.com/BishopFox/jsluice/cmd/jsluice@latest"
  ["urlfinder"]="go install -v github.com/projectdiscovery/urlfinder/cmd/urlfinder@latest"
)

# Declare pipx tools and their paths
declare -A pipxtools=(
  ["dnsvalidator"]="vortexau/dnsvalidator"
  ["interlace"]="codingo/Interlace"
  ["wafw00f"]="EnableSecurity/wafw00f"
  ["commix"]="commixproject/commix"
  ["urless"]="xnl-h4ck3r/urless"
  ["ghauri"]="r0oth3x49/ghauri"
  ["xnLinkFinder"]="xnl-h4ck3r/xnLinkFinder"
  ["porch-pirate"]="MandConsultingGroup/porch-pirate"
  ["MetaFinder"]="Josue87/MetaFinder"
  ["EmailFinder"]="Josue87/EmailFinder"
  ["p1radup"]="iambouali/p1radup"
)

# Declare repositories and their paths
declare -A repos=(
  ["dorks_hunter"]="six2dez/dorks_hunter"
  ["gf"]="tomnomnom/gf"
  ["Gf-Patterns"]="1ndianl33t/Gf-Patterns"
  ["Corsy"]="s0md3v/Corsy"
  ["CMSeeK"]="Tuhinshubhra/CMSeeK"
  ["fav-up"]="pielco11/fav-up"
  ["massdns"]="blechschmidt/massdns"
  ["Oralyzer"]="r0075h3ll/Oralyzer"
  ["testssl.sh"]="drwetter/testssl.sh"
  ["JSA"]="w9w/JSA"
  ["CloudHunter"]="belane/CloudHunter"
  ["ultimate-nmap-parser"]="shifty0g/ultimate-nmap-parser"
  ["pydictor"]="LandGrey/pydictor"
  ["gitdorks_go"]="damit5/gitdorks_go"
  ["smuggler"]="defparam/smuggler"
  ["Web-Cache-Vulnerability-Scanner"]="Hackmanit/Web-Cache-Vulnerability-Scanner"
  ["regulator"]="cramppet/regulator"
  ["gitleaks"]="gitleaks/gitleaks"
  ["trufflehog"]="trufflesecurity/trufflehog"
  ["nomore403"]="devploit/nomore403"
  ["SwaggerSpy"]="UndeadSec/SwaggerSpy"
  ["LeakSearch"]="JoelGMSec/LeakSearch"
  ["ffufPostprocessing"]="Damian89/ffufPostprocessing"
  ["misconfig-mapper"]="intigriti/misconfig-mapper"
  ["Spoofy"]="MattKeeley/Spoofy"
  ["msftrecon"]="Arcanum-Sec/msftrecon"
)

