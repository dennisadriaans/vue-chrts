# chrts-release

> CLI tool for managing releases of the vue-chrts monorepo

A command-line interface for streamlining the release process for vue-chrts monorepo, ensuring that all packages are versioned, documented, and published consistently.

## Features

- **Conventional Commits:** Interactive prompts for creating standardized commit messages
- **Automated Version Management:** Determine next semantic version based on commit history
- **Changelog Generation:** Create and update changelogs based on commit history
- **Coordinated Releases:** Release multiple packages with the same version number
- **Git Integration:** Create and push version tags to your repository
- **NPM Publishing:** Publish packages to the npm registry

## Installation

The CLI is included in the monorepo and can be used directly:

```bash
# Run from monorepo root
npm run release
```

You can also install it globally:

```bash
# From monorepo root
npm install -g ./

# Then use from anywhere
chrts-release
```

## Commands

### Initialize Configuration

```bash
chrts-release init
```

This interactive command helps you create a configuration file (`.chrts-release.json`) with your preferred settings:

- Packages to include in the release process
- Changelog file locations
- npm publish access level

### Create Conventional Commits

```bash
chrts-release commit
```

Interactively create commits that follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

1. Select commit type (feat, fix, docs, etc.)
2. Add optional scope
3. Write commit description
4. Add optional longer message
5. Indicate breaking changes

### Update Package Versions

```bash
chrts-release version [--type <major|minor|patch|auto>] [--dry-run]
```

Update the version number in all package.json files:

- `--type`: Specify the version increment type (default: auto)
- `--dry-run`: Show what would change without making changes

The tool will:

1. Determine current version from package.json files
2. Analyze commits since the last tag to suggest next version
3. Update all package.json files to the same new version
4. Update internal dependencies between packages

### Generate Changelogs

```bash
chrts-release changelog [--from <tag>] [--to <ref>] [--dry-run]
```

Generate or update changelog files for each package:

- `--from`: Starting reference (default: last tag)
- `--to`: Ending reference (default: HEAD)
- `--dry-run`: Show changelog without saving to files

The tool will:

1. Parse commits since the specified reference
2. Group changes by type (features, bug fixes, etc.)
3. Create or update changelog files for each package

### Complete Release Process

```bash
chrts-release release [--dry-run] [--skip-build] [--skip-publish]
```

Execute the full release workflow:

- `--dry-run`: Show what would be done without making changes
- `--skip-build`: Skip building packages
- `--skip-publish`: Skip publishing to npm

This command runs through the entire release process:

1. Update package versions
2. Generate changelogs
3. Build packages
4. Create a Git tag
5. Push changes and tags to remote
6. Publish packages to npm

## Configuration

Configuration is stored in `.chrts-release.json` in the project root:

```json
{
  "packages": ["packages/vue", "packages/nuxt"],
  "changelogFiles": {
    "vue-chrts": "packages/vue/CHANGELOG.md",
    "nuxt-charts": "packages/nuxt/CHANGELOG.md"
  },
  "npmPublishAccess": "public",
  "commitTypes": {
    "feat": "Features",
    "fix": "Bug Fixes",
    "docs": "Documentation",
    "style": "Styles",
    "refactor": "Code Refactoring",
    "perf": "Performance Improvements",
    "test": "Tests",
    "build": "Build System",
    "ci": "CI",
    "chore": "Chores"
  }
}
```

## Release Workflow Example

Here's a typical workflow for releasing new versions:

1. Make changes to the codebase
2. Create commits with `chrts-release commit`
3. When ready to release:
   ```bash
   # Update versions based on conventional commits
   chrts-release version
   
   # Generate changelogs
   chrts-release changelog
   
   # Complete the release (or use release command to do everything)
   chrts-release release
   ```

## License

MIT