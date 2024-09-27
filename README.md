# Linear PR Title Action

Update your PR's title to the linked Linear issue's title.

To trigger the update, set your PRs title to `x`.

## Inputs

| Input            | Required | Description             |
| ---------------- | -------- | ----------------------- |
| `github-token`   | ✔️       | GitHub API auth token.  |
| `linear-api-key` | ✔️       | Linear personal API key |

## Installation

### 1. Workflow

Create a Github workflow (e.g. `.github/workflows/linear.yaml`):

```yaml
name: Linear

on:
  pull_request:
    types: [opened, edited]

env:
  PR_NUMBER: ${{ github.event.number }}
  GH_TOKEN: ${{ github.token }}

jobs:
  pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: shoooe/linear-pr-action@main
        with:
          linearApiKey: ${{ secrets.LINEAR_API_KEY }}
          ghToken: ${{ github.token }}
```

### 2. Secret

Now in Linear go to Settings > API > Personal API keys and create a new API key.
Once you have the API key go to the repository settings in Github; under "Security" go to Secrets and variables > Actions > Secrets and add a secret `LINEAR_API_KEY` with the Linear API key.

### 3. Action permissions

Now it's time to set the correct permissions for the workflow.
In Github go to the repository settings and then under "Code and automation" go to Actions > General.
Under "Worflow permissions" toggle "Read and write permissions".
