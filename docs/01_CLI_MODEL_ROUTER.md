# ⚡ Master CLI Tooling & AI Model Allocation Matrix

## 1. Tiered Task Allocation Rules

| Complexity Tier | Task Types & Scope | Recommended Model & Provider | Target CLI Tool | Command / Flag |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Heavy Code & Physics** | HTML5 Canvas GPU Shader, Spatial Gyroscope Physics, Bento Grid Morphing, Complex Algorithms | **Claude Sonnet 4.6 (Thinking)**<br>OR **Qwen3-Coder-480B-Instruct**<br>OR **DeepSeek-V4-Pro** | AGY CLI / OpenCode CLI | `agy --model claude-sonnet-4-6`<br>`opencode --model qwen/qwen3-coder-480b-a35b-instruct` |
| **Tier 2: Business Logic & Security** | Next.js Server Actions, Upstash Redis Rate Limiting, Sanity Schemas, Make.com Pipelines | **Gemini 3.6 Flash (High)**<br>OR **Kimi-K2.7-Code**<br>OR **GLM-5.2** | AGY CLI / OpenCode CLI | `agy --model gemini-3.6-flash-high`<br>`opencode --model moonshotai/Kimi-K2.7-Code` |
| **Tier 3: Standard UI & Glassmorphism** | Glass Cards, Executive Metric Bar, Tailwind Primitives, Responsive Layouts | **Gemini 3.6 Flash (Medium)**<br>OR **Gemma 4 31B** (Cerebras)<br>OR **Qwen3.6 27B** (Groq) | AGY CLI / OpenCode CLI | `agy --model gemini-3.6-flash-medium`<br>`opencode --model gemma-4-31b` |
| **Tier 4: Boilerplate, Config & Docs** | Project Init, ESLint/TS Configs, Markdown Docs, GitHub Actions Workflows | **Gemini 3.5 Flash (Low)**<br>OR **Llama 3.3 70B Versatile** (Groq)<br>OR **Cohere North Mini Code** | AGY CLI / OpenCode CLI | `agy --model gemini-3.5-flash-low`<br>`opencode --model llama-3.3-70b-versatile` |

---

## 2. CLI Execution & Token Monitoring Commands

### AGY CLI Commands
- Check Live Token Usage: `/usage`
- Switch Model Mid-Session: `/model <model-name>`
- Command Line Switch: `agy --model gemini-3.6-flash-high`

### OpenCode / OpenRouter / Groq / Cerebras Commands
- Switch Provider Endpoint: Set API key in environment (`GROQ_API_KEY`, `CEREBRAS_API_KEY`, `NVIDIA_API_KEY`).
- Free Tier Routing: `opencode --model openrouter/free`