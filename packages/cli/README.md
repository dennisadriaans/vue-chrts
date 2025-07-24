# Nuxt Charts CLI

A secure command-line interface for downloading and installing Nuxt Charts components.

## Installation

```bash
npm install -g nuxt-charts-cli
```

## Usage

### Add a component

```bash
# Add to default location (./app/components/{ComponentName})
nuxt-charts add calendar

# Add to custom location
nuxt-charts add progress-circle ./components/ui/ProgressCircle.vue
```

### List available components

```bash
nuxt-charts list
```

### Get help

```bash
nuxt-charts --help
```

## Available Components

- `calendar` - Calendar component
- `progress-circle` - Progress circle component

## Security Features

This CLI includes comprehensive security measures to protect your system:

### Input Validation

- ✅ Validates component names against whitelist
- ✅ Sanitizes file paths to prevent directory traversal
- ✅ Restricts file extensions to safe types
- ✅ Validates path length and characters

### Download Security

- ✅ HTTPS-only downloads from trusted domain
- ✅ Request timeout protection (30 seconds)
- ✅ File size limits (50MB max)
- ✅ Content-type validation

### Zip File Protection

- ✅ Zip bomb protection (compression ratio checks)
- ✅ Path traversal prevention in archives
- ✅ File count limits (max 1000 files)
- ✅ Individual file size validation
- ✅ Extension filtering for extracted files

### File System Safety

- ✅ Prevents writing outside project directory
- ✅ Automatic cleanup on errors
- ✅ Safe file extraction with validation

## Configuration

The CLI uses these security limits:

- Maximum file size: 50MB
- Request timeout: 30 seconds
- Maximum files in zip: 1000
- Allowed extensions: `.vue`, `.ts`, `.js`, `.json`, `.md`, `.zip`

## Error Handling

The CLI provides clear error messages and:

- Graceful error handling without system crashes
- Automatic cleanup of temporary files
- Detailed logging for debugging

## Development

```bash
# Install dependencies
npm install

# Build the CLI
npm run build

# Test locally
npm link
```

## Security Considerations

This CLI has been designed with security as a priority:

1. **No arbitrary code execution** - Downloads are limited to whitelisted components
2. **Path validation** - Prevents directory traversal attacks
3. **Size limits** - Prevents resource exhaustion
4. **Safe extraction** - Zip files are validated before extraction
5. **Timeout protection** - Prevents hanging downloads

## License

MIT
