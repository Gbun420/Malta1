# Pre-commit Hooks Setup

This document explains how to set up pre-commit hooks to ensure code quality and maintain a green main branch.

## Overview

Pre-commit hooks run automatically before each commit to:
- Lint code for style and quality issues
- Check for type errors with TypeScript
- Run unit tests to prevent breaking changes
- Ensure consistent code formatting

## Setup

### 1. Install Pre-commit

First, install the pre-commit framework:

```bash
# Install pre-commit (varies by OS)
# macOS
brew install pre-commit

# Ubuntu/Debian
sudo apt install pre-commit

# Windows (via pip)
pip install pre-commit
```

### 2. Create Configuration File

Create a `.pre-commit-config.yaml` file in the project root:

```yaml
repos:
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.44.0
    hooks:
      - id: eslint
        files: \.[jt]sx?$  # *.js, *.jsx, *.ts, *.tsx
        types: [file]
        additional_dependencies:
          - eslint@8.44.0
          - @typescript-eslint/eslint-plugin@5.61.0
          - @typescript-eslint/parser@5.61.0

  - repo: local
    hooks:
      - id: type-check
        name: type-check
        entry: npx tsc --noEmit
        language: system
        pass_filenames: false
        files: \.[jt]sx?$

  - repo: local
    hooks:
      - id: unit-tests
        name: unit-tests
        entry: npm test
        language: system
        pass_filenames: false
        files: \.[jt]sx?$

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.0.0
    hooks:
      - id: prettier
        files: \.[jt]sx?$  # *.js, *.jsx, *.ts, *.tsx
```

### 3. Install Hooks

Install the pre-commit hooks in your local repository:

```bash
pre-commit install
```

## Configuration

### ESLint Hook

The ESLint hook will automatically check for code style issues and potential bugs. It uses the existing `.eslintrc.json` configuration.

### TypeScript Check Hook

The TypeScript check hook runs `tsc --noEmit` to verify there are no type errors without generating output files.

### Unit Tests Hook

The unit tests hook runs the existing test suite to ensure no existing functionality is broken.

### Prettier Hook

The Prettier hook automatically formats code to maintain consistent styling.

## Usage

Once installed, the hooks will run automatically before each commit:

```bash
git add .
git commit -m "Your commit message"
```

If any hook fails, the commit will be aborted. You'll need to fix the issues and try again.

### Manual Running

You can also run the hooks manually on all files:

```bash
# Run all hooks on all files
pre-commit run --all-files

# Run specific hook
pre-commit run eslint --all-files
```

## Customization

### Skipping Hooks

If you need to skip hooks for a specific commit (not recommended):

```bash
git commit -m "Your message" --no-verify
```

### Updating Hooks

To update the hooks to newer versions:

```bash
pre-commit autoupdate
```

### Adding New Hooks

To add new hooks, modify the `.pre-commit-config.yaml` file and run:

```bash
pre-commit install
```

## CI/CD Integration

Pre-commit hooks should complement but not replace CI/CD checks. Configure your CI pipeline to run the same checks:

```yaml
# GitHub Actions example
name: Code Quality
on: [push, pull_request]
jobs:
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run ESLint
        run: npx eslint src/**/*.ts
      - name: Type check
        run: npx tsc --noEmit
      - name: Run tests
        run: npm test
```

## Troubleshooting

### Hook Installation Issues

If you encounter issues installing hooks:

1. Ensure pre-commit is properly installed: `pre-commit --version`
2. Check that the configuration file is valid YAML
3. Verify all required dependencies are available

### Performance Issues

If hooks are taking too long to run:

1. Consider running only essential checks in pre-commit
2. Move slower checks to CI/CD pipeline
3. Use file filtering to limit which files are checked

### False Positives

If hooks are failing on files that should pass:

1. Check that the tools are properly configured
2. Ensure all dependencies are installed
3. Review the specific error messages for guidance

## Best Practices

1. **Keep hooks fast**: Only include essential checks in pre-commit
2. **Consistent configuration**: Ensure local and CI configurations match
3. **Regular updates**: Keep hook versions up to date
4. **Documentation**: Document any custom hooks or configurations
5. **Team adoption**: Ensure all team members have hooks installed