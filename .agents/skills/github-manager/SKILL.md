---
name: github-manager
description: >-
  Use this skill to automatically parse and create GitHub issues from markdown files, 
  or whenever the user asks you to create issues in the repository.
---

# GitHub Issue Creator Skill

This skill teaches the agent how to automate the creation of GitHub issues from local markdown audit reports or lists.

## Prerequisites

1. The user must provide a valid GitHub Personal Access Token (PAT) with "Issues: Read and Write" permissions.
2. The token must be placed inside the `github_token.txt` file at the root of the workspace. This file is git-ignored.

## Steps to create issues

1. Ensure the `github_token.txt` file exists and has content. If it doesn't, politely ask the user to create the file and paste their token into it.
2. If the user asks you to parse a specific Markdown file for issues, you may optionally write a temporary script to parse that specific file, OR use the existing `scripts/create_issues.mjs` script if the format matches `consolidated_github_issues.md`.
3. To run the default script, simply execute:
   `node scripts/create_issues.mjs`
   The script will automatically read the token from `github_token.txt` and create the issues using the GitHub REST API.
4. If you need to create issues that are NOT in the `consolidated_github_issues.md` format, use the `scripts/create_issues.mjs` file as a reference implementation to write a custom node script that uses `fetch` to POST to `https://api.github.com/repos/dennierucom-com/mark-down/issues`.

## Important Rules

- Do NOT ask the user to paste their token directly in the chat. Always ask them to save it in `github_token.txt`.
- Do NOT commit `github_token.txt`.
