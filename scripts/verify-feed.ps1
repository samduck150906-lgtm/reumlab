$ErrorActionPreference = 'Stop'
$feedPath = Join-Path $PSScriptRoot '../out/feed.xml'
$xml = [System.Xml.XmlDocument]::new()
$xml.XmlResolver = $null
$xml.Load((Resolve-Path -LiteralPath $feedPath))
$namespace = [System.Xml.XmlNamespaceManager]::new($xml.NameTable)
$namespace.AddNamespace('content', 'http://purl.org/rss/1.0/modules/content/')
$items = $xml.SelectNodes('/rss/channel/item')
if ($items.Count -lt 1) { throw 'Feed has no items' }
$reportPath = Join-Path $PSScriptRoot '../docs/execution-20261020/feed-verification.json'
$report = Get-Content -LiteralPath $reportPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($report.items -ne $items.Count) { throw 'Feed item count differs from rendered-article report' }
$seen = @{}
$sha = [System.Security.Cryptography.SHA256]::Create()
foreach ($item in $items) {
  $full = $item.SelectSingleNode('content:encoded', $namespace).InnerText
  if ($full -ne $item.SelectSingleNode('description').InnerText) { throw "Full body fields differ: $($item.link)" }
  if ($full -notmatch '<article' -or $full -notmatch '<h1') { throw "Missing full article: $($item.link)" }
  $url = [string]$item.link
  if ($seen.ContainsKey($url)) { throw "Duplicate feed URL: $url" }
  $seen[$url] = $true
  $article = @($report.articles | Where-Object { $_.url -eq $url })
  if ($article.Count -ne 1) { throw "Missing rendered article report: $url" }
  $hashBytes = $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($full))
  $hash = ([System.BitConverter]::ToString($hashBytes)).Replace('-', '').ToLowerInvariant()
  if ($hash -ne $article[0].articleSha256) { throw "CDATA body differs from rendered article: $url" }
  $published = [DateTimeOffset]::Parse([string]$item.pubDate, [System.Globalization.CultureInfo]::InvariantCulture)
  if ($published.ToString('yyyy-MM-dd') -ne $article[0].publishedAt) { throw "Publication date changed: $url" }
  if ($full -match '(?:href|src|poster)="(?!https?://|mailto:|tel:)[^"]+"') { throw "Relative or unsupported URL in article: $url" }
}
$sha.Dispose()
$bytes = (Get-Item -LiteralPath $feedPath).Length
if ($bytes -ge 10000000) { throw 'Feed reaches 10MB limit' }
$report.xmlParserValidation = @{
  status = 'PASS'
  parser = 'System.Xml.XmlDocument (XmlResolver disabled)'
  checkedAt = [DateTimeOffset]::UtcNow.ToString('o')
  assertions = @('XML well-formed', 'CDATA round-trip', 'description equals full content', 'all rendered article SHA256 values match', 'unique canonical item URLs', 'original publication dates preserved', 'absolute links', 'under 10MB')
}
[System.IO.File]::WriteAllText([System.IO.Path]::GetFullPath($reportPath), ($report | ConvertTo-Json -Depth 30), [System.Text.UTF8Encoding]::new($false))
Write-Output "PASS XML parse, CDATA, full-article hashes, dates, links: $($items.Count) items; $bytes bytes"
