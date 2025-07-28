# Nuxt Charts CLI

A secure command-line interface for downloading and installing Nuxt Charts components.

## Installation

```bash
npm install -g nuxt-charts-cli
```

## Usage

### Authentication (API Token)

Some commands require an API token for authentication. You can set your token once and it will be used automatically for future commands:

```bash
# Set your API token
nuxt-charts config set-token <your-token-here>

# You can also pass the token directly to commands if needed
nuxt-charts add calendar --token <your-token-here>
```

If no token is provided via CLI option, the CLI will use the token saved in your config file.

### Add a component

```bash
# Add to default location (./app/components/{ComponentName})
nuxt-charts add calendar

# Add to custom location
nuxt-charts add progress-circle ./components/ui/ProgressCircle.vue

# Add with token (if not set globally)
nuxt-charts add calendar --token <your-token-here>
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

## License

MIT
