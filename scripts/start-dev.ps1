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

Write-Host 'Starting backend on http://localhost:5000'
$backendProcess = Start-Process -FilePath $NpmCommand -ArgumentList 'run','dev' -WorkingDirectory $BackendDir -NoNewWindow -PassThru

Write-Host 'Starting frontend on http://localhost:5173'
$frontendProcess = Start-Process -FilePath $NpmCommand -ArgumentList 'run','dev' -WorkingDirectory $FrontendDir -NoNewWindow -PassThru

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
            $Process.Kill()
        }
    }
    catch {
        Write-Warning "Failed to stop $Name process: $($_.Exception.Message)"
    }
}

$script:shutdownInvoked = $false
function Invoke-Shutdown {
    if ($script:shutdownInvoked) {
        return
    }

    $script:shutdownInvoked = $true
    Write-Host 'Shutting down...'
    Stop-ProcessTree -Process $backendProcess -Name 'backend'
    Stop-ProcessTree -Process $frontendProcess -Name 'frontend'
}

$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Invoke-Shutdown }
$null = Register-EngineEvent -InputObject ([Console]::CancelKeyPress) -SourceIdentifier ConsoleCancel -EventName CancelKeyPress -Action {
    $eventArgs.Cancel = $true
    Invoke-Shutdown
}

try {
    Wait-Process -Id $backendProcess.Id, $frontendProcess.Id
}
finally {
    Invoke-Shutdown
    Unregister-Event -SourceIdentifier PowerShell.Exiting, ConsoleCancel -ErrorAction SilentlyContinue
}
