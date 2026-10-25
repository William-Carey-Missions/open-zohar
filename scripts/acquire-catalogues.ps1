$ErrorActionPreference='Stop'
$utf8=New-Object System.Text.UTF8Encoding($false)
foreach($title in @('Zohar','Zohar Chadash','Tikkunei Zohar')) {
$url='https://www.sefaria.org/api/v2/raw/index/'+[uri]::EscapeDataString($title)
$file=$title.ToLower().Replace(' ','-')+'-sefaria-index.json'
$response=Invoke-WebRequest -Uri $url -UseBasicParsing
[System.IO.File]::WriteAllText((Join-Path $PSScriptRoot ('../data/sources/'+$file)),$response.Content,$utf8)
Write-Output ($title+': index opgeslagen')
Start-Sleep -Seconds 2
}
