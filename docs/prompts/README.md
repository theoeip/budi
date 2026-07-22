# AI Prompts — BUDI

> This folder contains prompts and instructions for AI assistants (Claude, ChatGPT, Gemini, Blackbox) to maintain context and consistency when working on the BUDI project.

## Purpose

AI assistants often lose context between sessions. These prompts ensure any AI can quickly understand:

1. The BUDI project structure
2. Coding conventions
3. Architectural decisions
4. Current development status

## Contents

| File | Purpose | AI Tool |
|------|---------|---------|
| `system-prompt.md` | Master system prompt for any AI | All |

## Usage

When starting a new AI session:

1. Copy the relevant prompt file
2. Paste it as context/system prompt
3. Start working on the task

## Updating Prompts

When project structure or conventions change:

1. Update the relevant prompt file
2. Document the change in CHANGELOG.md
3. Notify the team

## Related Documents

- [AI Context](../../AI_CONTEXT.md)
- [Architecture](../architecture.md)
- [Coding Standard](../../CODE_STYLE.md)

