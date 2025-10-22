#!/usr/bin/env pwsh
$ErrorActionPreference = 'Stop'

$RootDir = Resolve-Path (Join-Path $PSScriptRoot '..')
$BackendDir = Join-Path $RootDir 'backend'
$FrontendDir = Join-Path $RootDir 'frontend'

try {
    $NpmCommand = (Get-Command npm -ErrorAction Stop).Source
} catch {
    throw 'npm is not available on the PATH. Install Node.js and ensure npm can be invoked from PowerShell.'
}

function Install-Dependencies {
    param (
        [string]$Directory,
        [string]$Name,
        [string]$NpmCommand
    )

    $nodeModulesPath = Join-Path $Directory 'node_modules'
    if (-not (Test-Path $nodeModulesPath)) {
        Write-Host "Installing $Name dependencies..."
        Push-Location $Directory
        try {
            & $NpmCommand install
        }
        finally {
            Pop-Location
        }
    }
}

Install-Dependencies -Directory $BackendDir -Name 'backend' -NpmCommand $NpmCommand
Install-Dependencies -Directory $FrontendDir -Name 'frontend' -NpmCommand $NpmCommand

function Start-NpmDevServer {
    param (
        [string]$Directory,
        [string]$Name,
        [int]$Port
    )

    Write-Host "Starting $Name on http://localhost:$Port"

    try {
        return Start-Process -FilePath $NpmCommand -ArgumentList 'run','dev' -WorkingDirectory $Directory -NoNewWindow -PassThru
    }
    catch {
        throw "Failed to launch $Name dev server: $($_.Exception.Message)"
    }
}

$backendProcess = Start-NpmDevServer -Directory $BackendDir -Name 'backend' -Port 5000
$frontendProcess = Start-NpmDevServer -Directory $FrontendDir -Name 'frontend' -Port 5173

$isWindows = [System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform([System.Runtime.InteropServices.OSPlatform]::Windows)

function Stop-ProcessTree {
    param (
        [System.Diagnostics.Process]$Process,
        [string]$Name
    )

    if (-not $Process -or $Process.HasExited) {
        return
    }

    try {
        if ($isWindows) {
            & taskkill.exe /T /F /PID $Process.Id | Out-Null
        }
        else {
            $killWithTree = $Process.GetType().GetMethod('Kill', [Type[]]@([bool]))

            if ($killWithTree) {
                $killWithTree.Invoke($Process, @($true)) | Out-Null
            }
            else {
                $Process.Kill()
            }
        }
    }
    catch {
        Write-Warning "Failed to stop $Name process: $($_.Exception.Message)"
    }
}


$script:shutdownInvoked = $false
$script:shutdownReason = $null
function Invoke-Shutdown {
    param (
        [string]$Reason = 'cleanup'
    )

    if ($script:shutdownInvoked) {
        return
    }

    $script:shutdownInvoked = $true
    $script:shutdownReason = $Reason
    Write-Host 'Shutting down...'
    Stop-ProcessTree -Process $backendProcess -Name 'backend'
    Stop-ProcessTree -Process $frontendProcess -Name 'frontend'
}

$eventSubscriptions = @()
$eventSubscriptions += Register-EngineEvent -SourceIdentifier 'PowerShell.Exiting' -Action { & $function:Invoke-Shutdown -Reason 'engine-exiting' }
$eventSubscriptions += Register-ObjectEvent -InputObject ([Console]::CancelKeyPress) -EventName 'CancelKeyPress' -SourceIdentifier 'ConsoleCancel' -Action {
    param($sender, $eventArgs)

    $eventArgs.Cancel = $true
    & $function:Invoke-Shutdown -Reason 'signal'
}

try {
    Wait-Process -InputObject @($backendProcess, $frontendProcess)
}
finally {
    Invoke-Shutdown

    foreach ($subscription in $eventSubscriptions) {
        try {
            Unregister-Event -SubscriptionId $subscription.Id -ErrorAction Stop
        }
        catch {
            # ignore cleanup failures
        }
    }

    Get-Event -SourceIdentifier 'ConsoleCancel','PowerShell.Exiting' -ErrorAction SilentlyContinue | Remove-Event -ErrorAction SilentlyContinue
}

if ($script:shutdownReason -eq 'signal' -or $script:shutdownReason -eq 'engine-exiting') {
    exit 0
}

$backendExitCode = if ($backendProcess -and $backendProcess.HasExited) { $backendProcess.ExitCode } else { 0 }
$frontendExitCode = if ($frontendProcess -and $frontendProcess.HasExited) { $frontendProcess.ExitCode } else { 0 }

if ($backendExitCode -ne 0) {
    exit $backendExitCode
}

if ($frontendExitCode -ne 0) {
    exit $frontendExitCode
}

exit 0
