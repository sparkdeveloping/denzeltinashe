$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$partDir = Join-Path $PSScriptRoot 'public/client/gabby/.bundle-parts'
$outPath = Join-Path $PSScriptRoot 'public/client/gabby/Gabby-Final-Gallery.zip'
$parts = Get-ChildItem -Path $partDir -Filter 'Gabby-Final-Gallery.zip.part*' | Sort-Object Name
$out = [System.IO.File]::Create($outPath)
try {
  foreach ($part in $parts) {
    $input = [System.IO.File]::OpenRead($part.FullName)
    try { $input.CopyTo($out) } finally { $input.Dispose() }
  }
} finally { $out.Dispose() }
Write-Host "Restored $outPath"
