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

$shutdownScript = {
    Write-Host 'Shutting down...'
    if ($backendProcess -and -not $backendProcess.HasExited) {
        $backendProcess.Kill()
    }
    if ($frontendProcess -and -not $frontendProcess.HasExited) {
        $frontendProcess.Kill()
    }
}

$null = Register-EngineEvent -SourceIdentifier ConsoleBreak -Action $shutdownScript

try {
    Wait-Process -Id $backendProcess.Id, $frontendProcess.Id
}
finally {
    & $shutdownScript
    Unregister-Event -SourceIdentifier ConsoleBreak -ErrorAction SilentlyContinue
}
