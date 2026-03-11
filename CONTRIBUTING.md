# Contributing Guidelines

Thank you for taking the time to contribute! 🙌  
This document outlines the process for contributing to this project — please read it before opening an issue or submitting a PR.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Commit Message Convention](#commit-message-convention)
- [Branch Naming](#branch-naming)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Review Process](#review-process)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment.  
Be constructive. Be kind. Disagreements happen — handle them professionally.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/0x-70da/horus-shop.git
   cd horus-shop
   ```
3. **Install dependencies:**
   ```bash
   pnpm install
   ```
4. **Create a new branch** for your changes (see [Branch Naming](#branch-naming))
5. Make your changes, then open a Pull Request

---

## How to Contribute

### Reporting Bugs

Found something broken? Please [open a bug issue](../../issues/new?template=bug_report.yml) and fill in the template carefully.  
Before you do, search existing issues to avoid duplicates.

### Suggesting Features

Have an idea? [Open a feature request](../../issues/new?template=feature_request.yml) and describe it clearly.  
A good feature request explains the **why**, not just the **what**.

### Submitting a Pull Request

- Keep PRs focused — one concern per PR
- Reference the related issue: `Closes #123`
- Make sure tests pass before opening the PR
- Add/update tests if your change introduces new behavior
- Update documentation if needed
- Don't include unrelated formatting or whitespace changes

---

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer: Closes #issue]
```

**Types:**

| Type       | When to use                                      |
|------------|--------------------------------------------------|
| `feat`     | A new feature                                    |
| `fix`      | A bug fix                                        |
| `docs`     | Documentation changes only                       |
| `style`    | Formatting, missing semicolons, etc. (no logic)  |
| `refactor` | Code change that's neither a fix nor a feature   |
| `perf`     | Performance improvement                          |
| `test`     | Adding or updating tests                         |
| `chore`    | Build process, tooling, dependency updates       |
| `ci`       | CI/CD config changes                             |

**Examples:**
```
feat(auth): add OAuth2 login support
fix(api): handle null response from /users endpoint
docs: update setup instructions in README
```

---

## Branch Naming

```
<type>/<short-description>
```

Examples:
- `feat/user-authentication`
- `fix/login-redirect-loop`
- `refactor/cleanup-api-handlers`
- `docs/update-contributing-guide`

---

## Development Setup

> Update this section with your actual setup steps.

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Run tests
pnpm test

# Lint
pnpm run lint
```

---

## Project Structure

gonna be changed

---

## Review Process

- All PRs require at least **one approval** before merging
- Maintainers may request changes — this isn't personal, it's how we keep quality high
- Once approved, the PR author merges (unless otherwise agreed)
- PRs that go stale (no activity for 30 days) may be closed

---

_If you have questions not covered here, feel free to open a discussion or reach out directly._
