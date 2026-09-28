$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$partDir = "public/client/gabby/.bundle-parts"
$out = "public/client/gabby/Gabby-Final-Gallery.zip"
$parts = Get-ChildItem "$partDir/Gabby-Final-Gallery.zip.part*" | Sort-Object Name
if ($parts.Count -eq 0) { throw "Bundle parts not found in $partDir" }
$dest = [System.IO.File]::Create($out)
try {
  foreach ($part in $parts) {
    $bytes = [System.IO.File]::ReadAllBytes($part.FullName)
    $dest.Write($bytes, 0, $bytes.Length)
  }
} finally { $dest.Dispose() }
Write-Host "Restored $out"
