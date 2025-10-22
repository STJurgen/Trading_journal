#!/usr/bin/env pwsh
$ErrorActionPreference = 'Stop'

$RootDir = Resolve-Path (Join-Path $PSScriptRoot '..')
$BackendDir = Join-Path $RootDir 'backend'
$FrontendDir = Join-Path $RootDir 'frontend'

function Get-NpmExecutable {
    $candidateNames = @('npm.cmd', 'npm.exe', 'npm')
    foreach ($name in $candidateNames) {
        $command = Get-Command $name -ErrorAction SilentlyContinue
        if (-not $command) {
            continue
        }

        $path = $command.Path
        if (-not $path) {
            continue
        }

        $extension = [System.IO.Path]::GetExtension($path)
        if ($extension -in @('.cmd', '.exe')) {
            return $path
        }
    }

    throw 'npm is not available on the PATH. Install Node.js and ensure npm can be invoked from PowerShell.'
}

$NpmCommand = Get-NpmExecutable

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

function Start-NpmProcess {
    param (
        [string]$WorkingDirectory,
        [string[]]$Arguments
    )

    $extension = [System.IO.Path]::GetExtension($NpmCommand)
    if ($extension -ieq '.cmd') {
        $joinedArgs = ($Arguments -join ' ')
        $cmdArguments = @('/c', "`"$NpmCommand`" $joinedArgs")
        return Start-Process -FilePath $env:ComSpec -ArgumentList $cmdArguments -WorkingDirectory $WorkingDirectory -NoNewWindow -PassThru
    }

    return Start-Process -FilePath $NpmCommand -ArgumentList $Arguments -WorkingDirectory $WorkingDirectory -NoNewWindow -PassThru
}

Write-Host 'Starting backend on http://localhost:5000'
$backendProcess = Start-NpmProcess -WorkingDirectory $BackendDir -Arguments @('run','dev')

Write-Host 'Starting frontend on http://localhost:5173'
$frontendProcess = Start-NpmProcess -WorkingDirectory $FrontendDir -Arguments @('run','dev')

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
