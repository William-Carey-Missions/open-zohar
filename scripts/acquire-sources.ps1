param([switch]$RefreshCatalogues)
$ErrorActionPreference='Stop'
$utf8=New-Object System.Text.UTF8Encoding($false)
$projectRoot=Split-Path $PSScriptRoot -Parent
$manifest=Get-Content -LiteralPath (Join-Path $projectRoot 'data/source-manifest.json') -Raw | ConvertFrom-Json
$groups=$manifest.pages | Group-Object file
$ua='OpenZohar/0.1 (https://github.com/William-Carey-Missions/open-zohar; corpus research)'
foreach($group in $groups){
  $ids=($group.Group | ForEach-Object {$_.revision}) -join '|'
  $url='https://he.wikisource.org/w/api.php?action=query&format=json&formatversion=2&maxlag=5&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&revids='+[uri]::EscapeDataString($ids)
  $response=Invoke-WebRequest -Uri $url -UseBasicParsing -UserAgent $ua
  $data=$response.Content|ConvertFrom-Json
  if($data.error -or !$data.query.pages){throw 'Bronaanvraag mislukt'}
  foreach($record in $group.Group){
    $page=$data.query.pages | Where-Object {$_.pageid -eq $record.pageId}
    if($page.revisions[0].revid -ne $record.revision){throw 'Bronrevisie wijkt af'}
    $bytes=[Text.Encoding]::UTF8.GetBytes($page.revisions[0].slots.main.content)
    $hash=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($bytes)).ToLower()
    if($hash -ne $record.sha256){throw ('Bronhash wijkt af: '+$record.title)}
  }
  [IO.File]::WriteAllText((Join-Path $projectRoot $group.Name),($data|ConvertTo-Json -Depth 100),$utf8)
  Write-Output ('Vaste bronrevisies hersteld: '+$group.Name)
  Start-Sleep -Seconds 3
}
if($RefreshCatalogues){ & (Join-Path $PSScriptRoot 'acquire-catalogues.ps1') }
