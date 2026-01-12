# Update .env to match Docker credentials
Write-Host "Updating .env file to match Docker credentials..." -ForegroundColor Cyan

$envContent = Get-Content .env -Raw
$envContent = $envContent -replace 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/northstar\?schema=public"', 'DATABASE_URL="postgresql://northstar:northstar_dev@localhost:5432/northstar?schema=public"'
Set-Content -Path .env -Value $envContent

Write-Host "✅ .env updated successfully!" -ForegroundColor Green
