Parfait, voici la version **mise à jour de ton `README.md`** avec l’ajout d’un exemple `.env`, une mise en garde sur la clé API, et un rappel clair que **la clé est nécessaire mais non incluse** :

---

```markdown
# Claude Chatbot (TypeScript Edition)

This project is a smart chatbot powered by Anthropic's Claude API, integrated with the Model Context Protocol (MCP) to dynamically call custom tools like real estate and car website scrapers.

> ⚠️ **Important:** This project requires a Claude API key stored in a `.env` file.  
> The key is **not included** in this repo for security reasons.

---

## 🔧 Features

- ✨ Dynamic MCP tool support (`scanWebsite`, `scanCarWebsite`, etc.)
- 🔁 Automatic Claude tool selection via `tool_choice: auto`
- 🌐 Express.js backend server
- 📦 Fully written in TypeScript
- ⚙️ Local MCP middleware support
- 🌍 Web scraping for live data extraction
- 🧠 Multi-step Claude interaction (tool_use + tool_result)

---

## 🗂️ Project Structure

```

claude-chatbot-ts/
├── src/
│   ├── server.ts               # Main entry point (Express + Claude + tools)
│   ├── tools.ts                # MCP tool aggregation
│   ├── types.ts                # Shared MCP interfaces
│   ├── mcp-sdk-local/          # Local MCP middleware
│   │   └── index.ts
│   └── tools/
│       ├── scan-website/
│       │   └── index.ts
│       └── scan-car-website/
│           └── index.ts
├── public/                     # HTML / CSS frontend files
├── .env                        # API key config (NOT COMMITTED)
├── .env.example                # Example of expected env vars
├── .gitignore                  # Prevents secrets from being pushed
├── tsconfig.json               # TypeScript config
└── package.json

````

---

## 🚀 Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/Zerd00/claudechatbot.git
cd claudechatbot
````

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file with your Claude API key:**

```env
# .env
ANTHROPIC_API_KEY=your_api_key_here
```

> ✅ Or copy the example:

```bash
cp .env.example .env
```

4. **Start the development server:**

```bash
npm run dev
```

Then open: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Prompt Example

> "Do you have a property with ID 3702?"

Claude will automatically choose `scanWebsite`, execute it, and use the results in the response.

---

## 🧩 Adding a new MCP Tool

Create a `index.ts` file inside `src/tools/your-tool-name/`, and register it in `src/tools.ts`:

```ts
import * as myTool from './tools/your-tool-name/index.ts';
export const tools: Tool[] = [myTool /* add others */];
```

---

## 🧠 Claude Settings

* Model: `claude-3-haiku-20240307`
* Tool usage: `tool_choice: auto`
* System prompt: real estate + automotive assistant

---

## 📦 Core Dependencies

```bash
npm install express dotenv node-fetch ts-node typescript @types/node
```

---

## 📜 License

MIT – Built with ❤️ by Zerd00.
