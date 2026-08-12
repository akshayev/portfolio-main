# 🧠 Graphify & Obsidian Second Brain Vault Architecture

## 1. Overview
This `/docs` directory serves as the interactive Second Brain knowledge graph for the **Titanium & Emerald Spatial UI Portfolio**. It is configured to run seamlessly as an Obsidian Vault and integrates with `graphify` for graph visualization and AI knowledge mapping.

## 2. Obsidian Vault Setup Instructions
1. Launch **Obsidian**.
2. Click **"Open folder as vault"**.
3. Navigate to and select the repository root directory (`/home/akshay/Desktop/project/portfolio`).
4. Obsidian will recognize the `/docs` structure and render markdown links, tags, and graph nodes.

## 3. Graphify Knowledge Graph Integration
- Run `graphify` against the codebase or `/docs` directory to generate knowledge graphs.
- Knowledge graph artifacts are saved in `graphify-out/`.
- Obsidian Graph View enables visual navigation of architectural decisions, CLI routing rules, and build journal logs.

## 4. Git Tracking & Vault Isolation
- `/docs/*.md` files are fully version-controlled in Git.
- Local user-specific Obsidian settings (`.obsidian/workspace.json`, `.obsidian/workspace-mobile.json`) are ignored via `.gitignore` to maintain clean commits across team members.