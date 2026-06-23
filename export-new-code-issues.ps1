$project = "lms-alprodas-frontend"
$hostUrl = "http://localhost:9000"

if (-not $env:SONAR_TOKEN) {
  Write-Host "ERROR: SONAR_TOKEN belum diatur." -ForegroundColor Red
  exit 1
}

$headers = @{
  Authorization = "Bearer $env:SONAR_TOKEN"
}

$url = "$hostUrl/api/issues/search?componentKeys=$project&issueStatuses=OPEN,CONFIRMED&sinceLeakPeriod=true&ps=500"
$response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get

$issues = $response.issues | Select-Object `
  @{Name="File";Expression={$_.component.Replace("${project}:","")}}, `
  @{Name="Line";Expression={$_.line}}, `
  @{Name="Severity";Expression={$_.severity}}, `
  @{Name="SoftwareQuality";Expression={($_.impacts | ForEach-Object { "$($_.softwareQuality):$($_.severity)" }) -join "; "}}, `
  @{Name="Effort";Expression={$_.effort}}, `
  @{Name="Rule";Expression={$_.rule}}, `
  @{Name="Message";Expression={$_.message}}

$issues | Export-Csv ".\sonarqube-frontend-new-code-issues.csv" -NoTypeInformation -Encoding UTF8

$txt = "NEW CODE ISSUES - LMS ALPRODAS FRONTEND`n"
$txt += "=========================================`n`n"
$txt += "Total New Issues: $($issues.Count)`n`n"

foreach ($issue in $issues) {
  $txt += "File     : $($issue.File)`n"
  $txt += "Line     : $($issue.Line)`n"
  $txt += "Severity : $($issue.Severity)`n"
  $txt += "Quality  : $($issue.SoftwareQuality)`n"
  $txt += "Effort   : $($issue.Effort)`n"
  $txt += "Rule     : $($issue.Rule)`n"
  $txt += "Message  : $($issue.Message)`n"
  $txt += "------------------------------------------------`n"
}

$txt | Out-File ".\sonarqube-frontend-new-code-issues.txt" -Encoding UTF8

Write-Host "Export selesai." -ForegroundColor Green
Write-Host "Total New Issues:" $issues.Count
Write-Host "File dibuat:"
Write-Host "- sonarqube-frontend-new-code-issues.csv"
Write-Host "- sonarqube-frontend-new-code-issues.txt"