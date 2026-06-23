$project = "lms-alprodas-frontend"
$hostUrl = "http://localhost:9000"

if (-not $env:SONAR_TOKEN) {
  Write-Host "ERROR: SONAR_TOKEN belum diatur." -ForegroundColor Red
  exit 1
}

$headers = @{
  Authorization = "Bearer $env:SONAR_TOKEN"
}

$page = 1
$pageSize = 500
$allIssues = @()

do {
  $url = "$hostUrl/api/issues/search?componentKeys=$project&issueStatuses=OPEN,CONFIRMED&impactSoftwareQualities=MAINTAINABILITY&ps=$pageSize&p=$page"
  $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get

  $allIssues += $response.issues
  $total = $response.total
  $page++
} while ($allIssues.Count -lt $total)

$issues = $allIssues | Select-Object `
  @{Name="File";Expression={$_.component.Replace("${project}:","")}}, `
  @{Name="Line";Expression={$_.line}}, `
  @{Name="Severity";Expression={$_.severity}}, `
  @{Name="CleanCodeAttribute";Expression={$_.cleanCodeAttribute}}, `
  @{Name="SoftwareQuality";Expression={($_.impacts | ForEach-Object { "$($_.softwareQuality):$($_.severity)" }) -join "; "}}, `
  @{Name="Effort";Expression={$_.effort}}, `
  @{Name="Rule";Expression={$_.rule}}, `
  @{Name="Message";Expression={$_.message}}

$issues | Export-Csv ".\sonarqube-frontend-maintainability-issues.csv" -NoTypeInformation -Encoding UTF8

$txt = "MAINTAINABILITY ISSUES - LMS ALPRODAS FRONTEND`n"
$txt += "================================================`n`n"
$txt += "Total Maintainability Issues: $($issues.Count)`n`n"

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

$txt | Out-File ".\sonarqube-frontend-maintainability-issues.txt" -Encoding UTF8

Write-Host "Export selesai." -ForegroundColor Green
Write-Host "Total Maintainability Issues:" $issues.Count
Write-Host "File dibuat:"
Write-Host "- sonarqube-frontend-maintainability-issues.csv"
Write-Host "- sonarqube-frontend-maintainability-issues.txt"