param(
  [Parameter(Mandatory = $false)]
  [string]$Repo = "DYBInh2k5/Food_Ordering_App_Full_Stack_Delivery_Platform"
)

# Requires GitHub CLI: https://cli.github.com/
# Login first: gh auth login

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI (gh) is not installed."
  exit 1
}

$labels = @(
  @{ name = "bug"; color = "d73a4a"; description = "Something is not working" },
  @{ name = "enhancement"; color = "a2eeef"; description = "New feature or request" },
  @{ name = "documentation"; color = "0075ca"; description = "Documentation improvements" },
  @{ name = "triage"; color = "fbca04"; description = "Needs review and prioritization" },
  @{ name = "high-priority"; color = "b60205"; description = "Important and urgent" },
  @{ name = "release-blocker"; color = "5319e7"; description = "Must be fixed before release" },
  @{ name = "backend"; color = "0e8a16"; description = "Backend API or data layer changes" },
  @{ name = "frontend"; color = "1d76db"; description = "UI or client-side changes" },
  @{ name = "testing"; color = "c2e0c6"; description = "Test scope and quality work" },
  @{ name = "security"; color = "d93f0b"; description = "Security-related issue" }
)

foreach ($label in $labels) {
  $name = $label.name
  $color = $label.color
  $description = $label.description

  $exists = gh label list --repo $Repo --limit 200 --json name | ConvertFrom-Json | Where-Object { $_.name -eq $name }

  if ($exists) {
    gh label edit $name --repo $Repo --color $color --description $description | Out-Null
    Write-Host "Updated label: $name"
  }
  else {
    gh label create $name --repo $Repo --color $color --description $description | Out-Null
    Write-Host "Created label: $name"
  }
}

Write-Host "Label sync completed."
