# run-fixed.ps1 - Script corrigido para TransactionService
Write-Host " TRANSACTIONSERVICE - EXECUÇÃO CORRIGIDA" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# 1. Ir para pasta correta
Set-Location "D:\Projects\FinTrackAI\src\Services\TransactionService"
Write-Host "Pasta atual: $(Get-Location)" -ForegroundColor Gray

# 2. Parar processos existentes
Write-Host "`n[1/5] Parando processos..." -ForegroundColor Cyan
taskkill /F /IM dotnet.exe 2>$null
Start-Sleep -Seconds 3

# 3. Limpar
Write-Host "`n[2/5] Limpando build..." -ForegroundColor Cyan
Remove-Item -Path "bin", "obj" -Recurse -Force -ErrorAction SilentlyContinue

# 4. Restaurar e build
Write-Host "`n[3/5] Build do projeto..." -ForegroundColor Cyan
dotnet restore
dotnet build --configuration Release

if ($LASTEXITCODE -ne 0) {
    Write-Host " Build falhou" -ForegroundColor Red
    exit 1
}

# 5. Executar
Write-Host "`n[4/5] Executando serviço..." -ForegroundColor Cyan
Write-Host "Iniciando na porta 5001..." -ForegroundColor Yellow

# Executar em novo processo
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "dotnet"
$psi.Arguments = "run --project TransactionService.csproj --urls http://*:5001 --configuration Release"
$psi.UseShellExecute = $true
$psi.WindowStyle = "Normal"

$process = [System.Diagnostics.Process]::Start($psi)
Write-Host "Processo iniciado com PID: $($process.Id)" -ForegroundColor Gray

# 6. Testar
Write-Host "`n[5/5] Testando conexão..." -ForegroundColor Cyan
Write-Host "Aguardando 20 segundos para inicialização..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

try {
    $health = Invoke-RestMethod -Uri "http://localhost:5001/api/transactions/health" -Method Get -ErrorAction Stop
    Write-Host "`n SUCESSO! TransactionService está ONLINE!" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    
    Write-Host "`n INFORMAÇÕES:" -ForegroundColor White
    Write-Host "   Status: $($health.Status)" -ForegroundColor Gray
    Write-Host "   Service: $($health.Service)" -ForegroundColor Gray
    Write-Host "   Timestamp: $($health.Timestamp)" -ForegroundColor Gray
    
    Write-Host "`n ENDPOINTS:" -ForegroundColor Cyan
    Write-Host "   Health: http://localhost:5001/api/transactions/health" -ForegroundColor White
    Write-Host "   Swagger: http://localhost:5001/swagger" -ForegroundColor White
    Write-Host "   API: http://localhost:5001/api/transactions" -ForegroundColor White
    
    Write-Host "`n PARA TESTAR:" -ForegroundColor Yellow
    Write-Host "   Abra novo terminal e execute:" -ForegroundColor White
    Write-Host "   curl -X POST http://localhost:5001/api/transactions ^" -ForegroundColor Cyan
    Write-Host "     -H `"Content-Type: application/json`" ^" -ForegroundColor Cyan
    Write-Host "     -d `"{`"type`":`"TRANSFER`",`"amount`":1000,`"fromAccountId`":`"ACC001`",`"toAccountId`":`"ACC002`"}`"" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n FALHA: TransactionService não responde" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Yellow
    
    Write-Host "`n SOLUÇÕES:" -ForegroundColor White
    Write-Host "   1. Verifique se porta 5001 não está em uso" -ForegroundColor Gray
    Write-Host "   2. Tente porta diferente: dotnet run --urls http://*:5002" -ForegroundColor Gray
    Write-Host "   3. Verifique logs do processo" -ForegroundColor Gray
}
