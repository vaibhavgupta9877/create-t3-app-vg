# Local Setup Steps - Running CLI Globally


  However, I'd strongly recommend switching to Option 1 instead — it's much simpler and doesn't require manual file management:
```
  pnpm install
  pnpm build:cli
  cd cli
  pnpm link "D:\Vaibhav\Saas\t3package\create-t3-app-vg\cli\" --global
  cd ..

  create-t3-app-vg
```
  Then just run create-t3-app-vg from anywhere. This is the cleanest approach for development.

  Which would you prefer? Or do you want to stick with Option 3 and I can verify the .cmd wrapper works?

This guide explains how to make your `create-t3-app-vg` CLI available globally on your system so you can run it from any directory.

## Overview

Your `package.json` already has a `bin` entry configured:
```json
"bin": {
  "create-t3-app-vg": "./dist/index.js"
}
```

This means your package is ready for global installation. Choose one of the 4 methods below.

---

## Option 1: Using `pnpm link` (Recommended for Development)

The cleanest approach for local development:

```bash
# From the root of your project
pnpm install          # Ensure dependencies are installed
pnpm build:cli        # Build the CLI first
cd cli
pnpm link --global    # Register globally
cd ..
```

Then run from anywhere:
```bash
create-t3-app-vg
```

**To unlink later:**
```bash
cd cli
pnpm unlink --global
cd ..
```

---

## Option 2: Install Globally from Local Path

Install your local package globally:

```bash
# From root
pnpm install
pnpm build:cli
pnpm add -g file:./cli   # Install from local path
```

To update after making changes, rebuild and reinstall:
```bash
pnpm build:cli
pnpm add -g file:./cli --force
```

---

## Option 3: Manual Symlink (Full Control)

Create a symlink manually in your PATH:

### Windows (Run as Administrator in PowerShell)

```powershell
# First, build your CLI
pnpm build:cli

# Find where pnpm stores global binaries
# Usually: C:\Users\<YourUsername>\AppData\Local\pnpm

# Create symlink to the dist/index.js file
cmd /c mklink "C:\Users\Vaibhav\AppData\Local\pnpm\create-t3-app-vg.cmd" "D:\Vaibhav\Saas\t3package\create-t3-app-vg\cli\dist\index.js"
```

### Linux/macOS

```bash
pnpm build:cli
ln -s /path/to/cli/dist/index.js /usr/local/bin/create-t3-app-vg
chmod +x /usr/local/bin/create-t3-app-vg
```

---

## Option 4: Add to System PATH

Modify your system PATH to include the `cli/dist` directory.

### Windows (PowerShell as Administrator)

```powershell
# Get current PATH
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")

# Add the dist directory
$newPath = $currentPath + ";D:\Vaibhav\Saas\t3package\create-t3-app-vg\cli\dist"

# Set it
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
```

Then create a wrapper script `create-t3-app-vg.cmd` in the `cli/dist` folder:
```batch
@echo off
node "%~dp0\index.js" %*
```

### Linux/macOS

Add to your `~/.bashrc` or `~/.zshrc`:
```bash
export PATH="/path/to/cli/dist:$PATH"
```

Then reload:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

---

## Recommendation

- **For daily development**: Use **Option 1 (`pnpm link`)** — simplest and most convenient
- **For distribution**: Once you publish to npm, users can simply run:
  ```bash
  pnpm create create-t3-app-vg@latest
  ```
  or
  ```bash
  npm create create-t3-app-vg@latest
  ```

---

## Quick Start (Option 1)

To get going right now:

```bash
# From repo root
pnpm install
pnpm build:cli
cd cli && pnpm link --global
cd ..

# Now from anywhere, you can run:
create-t3-app-vg
```

---

## Troubleshooting

**Command not found after linking?**
- Restart your terminal or shell
- Check that `pnpm link --global` completed without errors
- Run `which create-t3-app-vg` (or `where create-t3-app-vg` on Windows) to verify it's in PATH

**Changes not reflected?**
- Rebuild: `pnpm build:cli`
- For Option 1, re-link: `cd cli && pnpm unlink --global && pnpm link --global`
- For Option 2, reinstall: `pnpm add -g file:./cli --force`

**Permissions error on Linux/macOS?**
- You may need `sudo` for `/usr/local/bin` operations
- Consider using a user-local directory instead (e.g., `~/.local/bin`)
