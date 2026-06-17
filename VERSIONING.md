# Versioning Policy

## Overview

This project follows **Semantic Versioning 2.0.0** (`MAJOR.MINOR.PATCH`) for all releases.
Versioning is automated via **MinVer**, which derives the version from git tags.

## How Versioning Works (MinVer)

MinVer reads the most recent **git tag** matching the prefix `v` (e.g., `v0.1.0`) and
computes the version as follows:

| Scenario | Version |
|---|---|
| Tagged commit `v1.0.0` | `1.0.0` |
| 3 commits after `v0.1.0` | `0.1.0-alpha.0.3` + commit hash |
| No tags exist | `0.0.0-alpha.0.N` (N = commit count) |

- **Pre-release phase**: `alpha.0` by default (configurable in `Directory.Build.props`)
- **Build metadata**: includes the git commit SHA (e.g., `+abc1234`)

## Version Bump Rules

| Bump | When | Example |
|---|---|---|
| **MAJOR** | Breaking API or database changes | `1.0.0` → `2.0.0` |
| **MINOR** | New feature (backward-compatible) | `1.0.0` → `1.1.0` |
| **PATCH** | Bug fix or internal refactor | `1.0.0` → `1.0.1` |

## Creating a Release

```bash
# Tag the current commit
git tag v1.0.0

# Push the tag
git push origin v1.0.0
```

After tagging, MinVer will produce the exact version on that commit.
Subsequent commits will get a pre-release suffix (`-alpha.0.1`, etc.).

## Version Consistency

All .NET projects in the solution share the same version via `Directory.Build.props`.
The frontend (`package.json`) should be updated manually to match.

## Pre-release Identifiers

- `alpha` – active development, unstable
- `beta` – feature-complete, testing
- `rc`  – release candidate

Set the pre-release identifiers in `Directory.Build.props`:

```xml
<MinVerDefaultPreReleaseIdentifiers>beta.0</MinVerDefaultPreReleaseIdentifiers>
```
