"use client"

import { useState, useEffect } from "react"
import { Search, Shield, Globe, Code, GitBranch, Server, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [domain, setDomain] = useState("")
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setDarkMode(savedTheme === "dark")
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light")
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const handleSearch = (dork: string) => {
    if (!domain) {
      alert("Please enter a target domain.")
      return
    }

    const finalDork = dork.replace("example.com", domain)

    if (finalDork.startsWith("http://") || finalDork.startsWith("https://")) {
      window.open(finalDork, "_blank")
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(finalDork)}`, "_blank")
    }
  }

  const subdomainDork = (dork: string) => handleSearch(dork)
  const portDork = (dork: string) => handleSearch(dork)
  const urlDork = (dork: string) => handleSearch(dork)
  const genericDork = (dork: string) => handleSearch(dork)
  const allDork = (dork: string) => handleSearch(dork)
  const gitDork = (dork: string) => handleSearch(dork)
  const cmsDork = (dork: string) => handleSearch(dork)

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <header className="sticky top-0 z-50 border-b backdrop-blur-sm bg-opacity-80 bg-background">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
              Advanced Recon Engine
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="theme-switch" checked={darkMode} onCheckedChange={setDarkMode} />
              <Label htmlFor="theme-switch">{darkMode ? "Dark Mode" : "Light Mode"}</Label>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                id="searchdomain"
                className="pl-10 py-6 text-lg"
                placeholder="Enter target domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="subdomain" className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
            <TabsTrigger value="subdomain" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">Subdomains</span>
            </TabsTrigger>
            <TabsTrigger value="tech" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden md:inline">Technology</span>
            </TabsTrigger>
            <TabsTrigger value="port" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden md:inline">Port Scan</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">URLs</span>
            </TabsTrigger>
            <TabsTrigger value="vuln" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Vulnerabilities</span>
            </TabsTrigger>
            <TabsTrigger value="git" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span className="hidden md:inline">Git Dorks</span>
            </TabsTrigger>
            <TabsTrigger value="generic" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden md:inline">Generic</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subdomain" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-red-500" />
                  Subdomain Finding
                </CardTitle>
                <CardDescription>
                  Discover subdomains of the target domain using various tools and techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  <Button variant="outline" onClick={() => subdomainDork("https://crt.sh/?q=%25.example.com")}>
                    crt.sh
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => subdomainDork("https://dorki.attaxa.com/search?q=site:example.com")}
                  >
                    dorki.attaxa.com
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => subdomainDork("https://securitytrails.com/list/apex_domain/example.com")}
                  >
                    securitytrails.com
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => subdomainDork("https://www.vedbex.com/subdomain-finder/example.com")}
                  >
                    vedbex.com
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => subdomainDork("https://viewdns.info/reverseip/?host=example.com&t=1")}
                  >
                    viewdns.info
                  </Button>
                  <Button variant="outline" onClick={() => subdomainDork("site:*.example.com")}>
                    *.Google
                  </Button>
                  <Button variant="outline" onClick={() => subdomainDork("site:*.example.com.*")}>
                    *.Google.*
                  </Button>
                  <Button variant="outline" onClick={() => subdomainDork("site:*.*.example.com.*")}>
                    *.*.Google.*
                  </Button>
                  <Button variant="outline" onClick={() => subdomainDork("site:*.*.*.example.com")}>
                    *.*.*.Google
                  </Button>
                  <Button variant="outline" onClick={() => subdomainDork("site:*.*.*.*.example.com")}>
                    *.*.*.*.Google
                  </Button>
                  <Button variant="outline" onClick={() => subdomainDork("site:*.*.*.*.*.example.com")}>
                    *.*.*.*.*.Google
                  </Button>
                  <Button variant="outline" onClick={() => subdomainDork("site:*.*.*.*.*.*.*.example.com")}>
                    *.*.*.*.*.*.*.Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      subdomainDork(
                        "https://search.censys.io/search?resource=hosts&sort=RELEVANCE&per_page=25&virtual_hosts=EXCLUDE&q=example.com",
                      )
                    }
                  >
                    search.censys.io
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => subdomainDork("https://www.shodan.io/search?query=example.com")}
                  >
                    shodan.io
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-red-500" />
                  Technology Detector
                </CardTitle>
                <CardDescription>Identify technologies used by the target website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  <Button variant="outline" onClick={() => gitDork("https://builtwith.com/example.com")}>
                    builtwith.com
                  </Button>
                  <Button variant="outline" onClick={() => gitDork("https://webtechsurvey.com/website/example.com")}>
                    webtechsurvey.com
                  </Button>
                  <Button variant="outline" onClick={() => gitDork("https://w3techs.com/sites/info/example.com")}>
                    w3techs.com
                  </Button>
                  <Button variant="outline" onClick={() => genericDork("https://whatcms.org/?s=example.com")}>
                    whatcms.org
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="port" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-red-500" />
                  Port Scanning
                </CardTitle>
                <CardDescription>Scan for open ports on the target domain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  <Button variant="outline" onClick={() => portDork("https://viewdns.info/portscan/?host=example.com")}>
                    viewdns.info
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => portDork("https://dnschecker.org/port-scanner.php?query=example.com&ptype=server")}
                  >
                    dnschecker.org
                  </Button>
                  <Button variant="outline" onClick={() => portDork("https://web-check.xyz/check/example.com")}>
                    web-check.xyz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-red-500" />
                  URLs Collecting
                </CardTitle>
                <CardDescription>Gather URLs related to the target domain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      urlDork(
                        "https://web.archive.org/cdx/search/cdx?url=*.example.com/*&output=txt&collapse=urlkey&fl=original&page=/",
                      )
                    }
                  >
                    web.archive.org
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => urlDork("https://urlscan.io/api/v1/search/?q=example.com&size=10000")}
                  >
                    urlscan.io
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      urlDork(
                        "https://otx.alienvault.com/api/v1/indicators/domain/example.com/url_list?limit=500&page=1",
                      )
                    }
                  >
                    otx.alienvault.com
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      portDork(
                        "https://www.virustotal.com/vtapi/v2/domain/report?apikey=5a6041a927876d0ab05e627cb85b5046f3bf1c3b4ed3b5c6fe2f54f3235bd8bd&domain=example.com",
                      )
                    }
                  >
                    virustotal.com (API)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vuln" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  All Vulnerabilities
                </CardTitle>
                <CardDescription>Search for various vulnerabilities in the target domain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">SQL Injection Parameters</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com  inurl:cat= | inurl:search= | inurl:action= | inurl:module= | inurl:rep= | inurl:review= | inurl:rep= | inurl:rep= | inurl:rep= | inurl:rep= | inurl:rep= | inurl:total= | inurl:selectID= | inurl:page= | inurl:search= | inurl:recherche= | inurl:term= | inurl:misc= | inurl:idProduct= | inurl:num= | inurl:idCategory= | inurl:no= | inurl:table= | inurl:bbs= | inurl:bookPageNo= | inurl:proj_nr= | inurl:card= | inurl:category= | inurl:LAN= | inurl:cid= | inurl:class= | inurl:column= | inurl:p= | inurl:mode= | inurl:date= | inurl:cPath= | inurl:delete= | inurl:dir= | inurl:chnum= | inurl:code= | inurl:email= | inurl:T****= | inurl:fetch= | inurl:file= | inurl:field= | inurl:first name= | inurl:form= | inurl:from= | inurl:filter= | inurl:pr= | inurl:gubun=",
                          )
                        }
                      >
                        SQLi Parameters (51)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com  inurl:doc= | inurl:code= | inurl:data= | inurl:id= | inurl:view= | inurl:i= | inurl:modus= | inurl:section= | inurl:site= | inurl:url= | inurl:w= | inurl:item= | inurl:join= | inurl:board= | inurl:keyword= | inurl:lang= | inurl:last name= | inurl:login= | inurl:ps_db= | inurl:main= | inurl:menu= | inurl:typeboard= | inurl:name= | inurl:nav= | inurl:t= | inurl:news= | inurl:number= | inurl:show= | inurl:order= | inurl:orm= | inurl:ref= | inurl:modul= | inurl:params= | inurl:pass= | inurl:password= | inurl:PageID= | inurl:pid= | inurl:process= | inurl:shop= | inurl:q= | inurl:query= | inurl:region= | inurl:register= | inurl:report= | inurl:reset password= | inurl:reset= | inurl:results= | inurl:role= | inurl:row= | inurl:search= | inurl:sel= | inurl:select= | inurl:sleep= | inurl:sort= | inurl:string= | inurl:table= | inurl:thread= | inurl:time= | inurl:title= | inurl:topic= | inurl:type= | inurl:update= | inurl:url= | inurl:user= | inurl:username= | inurl:users= | inurl:view= | inurl:where=",
                          )
                        }
                      >
                        SQLi Parameters (68)
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Error SQLIs</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com intext:Syntax error | intext:Fatal error | intext:MariaDB | intext:corresponds | intext:Database Error | intext:syntax | intext:/usr/www | intext:public_html | intext:database error | intext:on line | intext:RuntimeException | intext:mysql_ | intext:MySQL | intext:PSQLException | intext:at line | intext:You have an error in your SQL syntax | intext:mysql_query() | intext:pg_connect() | intext:SQLiteException | intext:ORA- | intext:invalid input syntax for type | intext:unterminated quoted string | intext:PostgreSQL query failed: | intext:unrecognized token: | intext:binding parameter | intext:undeclared variable: | intext:SQLSTATE | intext:constraint failed | intext:ORA-00936: missing expression | intext:ORA-06512: | intext:PLS- | intext:SP2- | intext:dynamic SQL error | intext:SQL command not properly ended | intext:T-SQL Error | intext:Msg  | intext:Level  | intext:Unclosed quotation mark after the character string | intext:quoted string not properly terminated | intext:Incorrect syntax near | intext:An expression of non-boolean type specified in a context where a condition is expected | intext:Conversion failed when converting | intext:Unclosed quotation mark before the character string | intext:SQL Server | intext:OLE DB | intext:Unknown column | intext:Access violation | intext:No such host is known | intext:server error | intext:syntax error at or near | intext:column does not exist | intext:could not prepare statement | intext:no such table: | intext:near | intext:unknown error | intext:unexpected end of statement | intext:ambiguous column name | intext:database is locked | intext:permission denied | intext:attempt to write a readonly database | intext:out of memory | intext:disk I/O error | intext:cannot attach the file | intext:operation is not allowed in this state | intext:data type mismatch | intext:cannot open database | intext:table or view does not exist | intext:index already exists | intext:index not found | intext:division by zero | intext:value too large for column",
                          )
                        }
                      >
                        Error SQLIs (71)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com intext:deadlock detected | intext:invalid operator | intext:sequence does not exist | intext:duplicate key value violates unique constraint | intext:string data, right truncated | intext:insufficient privileges | intext:missing keyword | intext:too many connections | intext:configuration limit exceeded | intext:network error while attempting to read from the file | intext:cannot rollback - no transaction is active | intext:feature not supported | intext:system error | intext:object not in prerequisite state | intext:login failed for user | intext:remote server is not known",
                          )
                        }
                      >
                        Error SQLIs (16)
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Open Redirects</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com inurl:redir= | inurl:url= | inurl:redirect= | inurl:return= | inurl:src=http | inurl:r=http | inurl:goto= | inurl:Lmge_url= | inurl:Open= | inurl:cgi-bin/redirect.cgi | inurl:checkout= | inurl:data= | inurl:dir= | inurl:domain= | inurl:feed= | inurl:file= | inurl:file_name= | inurl:file_url= | inurl:folder= | inurl:forward= | inurl:from_uri= | inurl:goto= | inurl:host= | inurl:html= | inurl:img_url= | inurl:load_file= | inurl:load_url= | inurl:login?to= | inurl:login_url= | inurl:logout= | inurl:navigation= | inurl:next_page= | inurl:page= | inurl:page_url= | inurl:redirect_to= | inurl:redirect_uri= | inurl:reference= | inurl:return_url= | inurl:rt= | inurl:ret= | inurl:r2=",
                          )
                        }
                      >
                        Open Redirects (41)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com inurl:show= | inurl:site= | inurl:uri= | inurl:val= | inurl:next= | inurl:url= | inurl:target= | inurl:rurl= | inurl:dest= | inurl:redir= | inurl:out= | inurl:image_url= | inurl:returnTo= | inurl:checkout_url= | inurl:continue= | inurl:=http | inurl:?next= | inurl:nexrurI=",
                          )
                        }
                      >
                        Open Redirects (18)
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Other Vulnerabilities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com inurl:redir | inurl:url= | inurl:redirect= | inurl:return= | inurl:dest= | inurl:uri= | inurl:path= | inurl:continue= | inurl:window= | inurl:next= | inurl:data= | inurl:reference= | inurl:site= | inurl:html= | inurl:val= | inurl:validate= | inurl:domain= | inurl:callback= | inurl:feed= | inurl:host= | inurl:port= | inurl:to= | inurl:out= | inurl:view= | inurl:dir=",
                          )
                        }
                      >
                        SSRF Params (24)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com inurl:cmd= | inurl:exec= | inurl:command= | inurl:execute= | inurl:ping= | inurl:query= | inurl:jump= | inurl:code= | inurl:reg= | inurl:do= | inurl:func= | inurl:arg= | inurl:option= | inurl:load= | inurl:process= | inurl:step= | inurl:read= | inurl:feature= | inurl:exe= | inurl:module= | inurl:payload= | inurl:run= | inurl:print=",
                          )
                        }
                      >
                        RCE Params (23)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com inurl:q= | inurl:s= | inurl:username= | inurl:search= | inurl:id= | inurl:lang= | inurl:keyword= | inurl:query= | inurl:page= | inurl:year= | inurl:view= | inurl:email= | inurl:type= | inurl:name= | inurl:p= | inurl:month= | inurl:image= | inurl:list_type= | inurl:url= | inurl:terms= | inurl:categoryid= | inurl:key= | inurl:l= | inurl:begindate= | inurl:enddate= | inurl:inviteby= | inurl:utm_source=",
                          )
                        }
                      >
                        XSS Params (27)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          allDork(
                            "site:example.com inurl:user= | inurl:id= | inurl:email= | inurl:account= | inurl:number= | inurl:order= | inurl:no= | inurl:doc= | inurl:key= | inurl:group= | inurl:profile= | inurl:edit= | inurl:report= ",
                          )
                        }
                      >
                        Idor Params (12)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="git" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-red-500" />
                  Git Dorking
                </CardTitle>
                <CardDescription>Search for sensitive information in Git repositories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  <Button variant="outline" onClick={() => gitDork("inurl:gitlab example.com")}>
                    GitLab
                  </Button>
                  <Button variant="outline" onClick={() => gitDork("site:example.com/.git/")}>
                    .git
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      gitDork(
                        "https://github.com/search?q=%27API_KEY%27%20OR%20%27api_key%27%20OR%20%27API_SECRET%27%20OR%20%27api_secret%27%20example.com&type=code",
                      )
                    }
                  >
                    API Keys
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      gitDork(
                        "https://github.com/search?q=%27DB_PASSWORD%27%20OR%20%27DATABASE_URL%27%20OR%20%27DATABASE_Password%27%20example.com&type=code",
                      )
                    }
                  >
                    DB Passwords
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      gitDork(
                        "https://github.com/search?q=%27AWS_ACCESS_KEY_ID%27%20OR%20%27aws_access_key_id%27%20OR%20%27aws_secret_access_key%27%20example.com&type=code",
                      )
                    }
                  >
                    AWS Keys
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => gitDork("https://github.com/search?q=filename%3A.env+example.com&type=code")}
                  >
                    .env Files
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      gitDork(
                        "https://github.com/search?q=%27password%27%20OR%20%27secrat%27%20OR%20%27credential%27%20example.com&type=code",
                      )
                    }
                  >
                    Passwords/Credentials
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      gitDork(
                        "https://github.com/search?q=%22-----BEGIN+OPENSSH+PRIVATE+KEY-----%22+example.com&type=code",
                      )
                    }
                  >
                    SSH Keys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-red-500" />
                  Generic Searches
                </CardTitle>
                <CardDescription>General reconnaissance techniques for the target domain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">File Exposure</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => genericDork("site:example.com intitle:index.of")}>
                        Directory Listing
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          genericDork(
                            "site:example.com ext:xml | ext:conf | ext:cnf | ext:reg | ext:inf | ext:rdp | ext:cfg | ext:txt | ext:ora | ext:ini",
                          )
                        }
                      >
                        Config Files
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => genericDork("site:example.com ext:sql | ext:dbf | ext:mdb")}
                      >
                        Database Files
                      </Button>
                      <Button variant="outline" onClick={() => genericDork("site:example.com ext:log")}>
                        Log Files
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          genericDork("site:example.com ext:bkf | ext:bkp | ext:bak | ext:old | ext:backup")
                        }
                      >
                        Backup Files
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Sensitive Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          genericDork(
                            "site:example.com inurl:login | inurl:admin | inurl:login | inurl:logon | inurl:sign-in | inurl:signin | inurl:signup | inurl:sign-up | inurl:dash | inurl:portal | inurl:panel | inurl:register | inurl:administrator",
                          )
                        }
                      >
                        Login/Admin Finder
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          genericDork(
                            "site:example.com  inurl:shell | inurl:backdoor | inurl:wso | inurl:cmd | shadow | passwd | boot.ini | inurl:backdoor | intitle:Mini Shell",
                          )
                        }
                      >
                        Backdoor Finder
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          genericDork(
                            "site:example.com%20(intext:%22aws_access_key_id%22%20OR%20intext:%22aws_secret_access_key%22)%20(filetype:json%20OR%20filetype:yaml)",
                          )
                        }
                      >
                        Cloud Credentials
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          genericDork(
                            "site:example.com inurl:readme | inurl:license | inurl:install | inurl:setup | inurl:config",
                          )
                        }
                      >
                        Setup Files
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Cloud Storage</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => genericDork("site:digitaloceanspaces.com example.com")}>
                        Digital Ocean
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => genericDork("site:firebaseio.com &quot;example.com&quot;")}
                      >
                        Firebase
                      </Button>
                      <Button variant="outline" onClick={() => genericDork("site:.s3.amazonaws.com example.com")}>
                        S3 Bucket
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => genericDork("site:googleapis.com &quot;example.com&quot;")}
                      >
                        Google APIs
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => genericDork("site:drive.google.com &quot;example.com&quot;")}
                      >
                        Google Drive
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => genericDork("site:dev.azure.com &quot;example.com&quot;")}
                      >
                        Azure
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Other Tools</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => genericDork("https://securityheaders.com/?q=example.com")}
                      >
                        Security Headers
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => genericDork("https://iplocation.io/website-server-software/example.com")}
                      >
                        Server Software
                      </Button>
                      <Button variant="outline" onClick={() => genericDork("site:linkedin.com employees example.com")}>
                        LinkedIn Employees
                      </Button>
                      <Button variant="outline" onClick={() => genericDork("site:facebook.com employees example.com")}>
                        Facebook Employees
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className={`py-6 border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Advanced Recon Engine | Developed by{" "}
            <a
              href="https://github.com/freelancermijan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:underline"
            >
              Mijanur Rahman
            </a>
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <Badge variant="outline">
              <a
                href="https://www.exploit-db.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                exploit-db.com
              </a>
            </Badge>
            <Badge variant="outline">
              <a
                href="https://dorki.attaxa.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                dorki.attaxa.com
              </a>
            </Badge>
            <Badge variant="outline">
              <a href="https://dorksearch.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                dorksearch.com
              </a>
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  )
}
