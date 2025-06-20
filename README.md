
# Claude Chatbot (TypeScript Edition)

This project is a smart chatbot powered by Anthropic's Claude API, integrated with the Model Context Protocol (MCP) to dynamically call custom tools like real estate and car website scrapers.

## 🔧 Features

- ✨ Dynamic MCP tool support (`scanWebsite`, `scanCarWebsite`, `filterProperties`, etc.)
- 🌍 Express.js backend server (TypeScript)
- 🧠 Multi-step Claude interaction (tool_use + tool_result)
- 🗨️ Automatic language detection for Greek, English, French (prompt, results, and property details)
- 📦 Fully written in TypeScript
- ⚙️ Local MCP middleware support
- 🌐 Web scraping + real-time data extraction
- 🏠 Supports both real estate search/filter and car modules
- 🖼️ Responsive, scrollable property display (with images)
- 🚦 Hard limit: **shows max 20 properties per request**
- 📃 Details page: property details returned in the same language as the question (GR/EN/FR)
- 💡 “Tool auto-selection”: Claude chooses when to call a tool (or which one)

---

## 🗂️ Project Structure

```

claude-chatbot-ts/
├── src/
│   ├── server/
│   │   ├── app.ts                # Main Express entry point
│   │   ├── routes.ts             # All API/chat routes
│   │   └── tools/
│   │       └── generate-property-detail-html.ts
│   ├── tools/
│   │   ├── scan-website/
│   │   │   └── index.ts
│   │   ├── scan-car-website/
│   │   │   └── index.ts
│   │   ├── filter-properties/
│   │   │   └── index.ts
│   │   ├── details/
│   │   │   └── get-property-details.ts
│   │   └── localize.ts           # Language detection helper
│   ├── tools.ts                  # MCP tool aggregation/registration
│   ├── types.ts                  # Shared MCP interfaces
│   └── mcp-sdk-local/            # Local MCP middleware
│       └── index.ts
├── public/                       # HTML/CSS frontend files
├── .env                          # API key config (see below)
├── tsconfig.json                 # TypeScript config
├── package.json
└── README.md

````

---

## 🚀 Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-account/claude-chatbot-ts.git
    cd claude-chatbot-ts
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` file with your Claude API key:**

    ```
    ANTHROPIC_API_KEY=your_api_key_here
    ```

4. **Start the chatbot server:**

    ```bash
    npx ts-node src/server/app.ts
    ```

    _(ou ajoute `"dev": "ts-node src/server/app.ts"` dans ton package.json pour `npm run dev`)_

5. **Open your browser and visit:**
    ```
    http://localhost:3000
    ```

---

## 🧪 Example Prompts

> **"Do you have a property with ID 3702?"**  
> **"Έχετε κάποιο σπίτι στη θάλασσα;"**  
> **"Propose-moi des appartements à louer à Patras"**

Claude will detect the language, choose the right tool (search or details), and reply in the same language with up to 20 properties (scrollable display).

---

## 🧩 Adding a new MCP Tool

1. Create a `index.ts` inside `src/tools/your-tool-name/`
2. Register it in `src/tools.ts`:

    ```ts
    import * as myTool from './tools/your-tool-name/index';
    export const tools: Tool[] = [myTool /*, ...other tools */];
    ```

---

## 🧠 Claude Settings

- Model: `claude-3-haiku-20240307`
- Tool usage: `tool_choice: auto`
- Language: supports Greek, French, English for search AND property details
- System prompt: Real estate/automotive assistant

---

## 📦 Core Dependencies

```bash
npm install express dotenv node-fetch ts-node typescript @types/node cheerio
````

---

## ⚡️ Tips

* **Development:**
  To start easily every time, add in `package.json`:

  ```json
  "scripts": {
    "dev": "ts-node src/server/app.ts"
  }
  ```

  Then run:

  ```bash
  npm run dev
  ```

* **.env file** must not be shared (contains your Anthropic API key).

* For production or team deployment, see [Docker](https://docs.docker.com/) or share via ZIP/Git (see instructions above).

---

## 📜 License

MIT – Built with ❤️ by you.

```

---

