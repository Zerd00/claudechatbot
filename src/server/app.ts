// server/app.ts
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// === Import des outils et des routes ===
import { registerAllTools } from './tools';
import { setupRoutes } from './routes';

// === MCP tools registration ===
registerAllTools(app);

// === PATCH : Ajout d'une middleware qui injecte le prompt utilisateur dans toolInput ===

// (1) Ce middleware doit être placé AVANT les routes qui traitent les appels MCP/tools
app.use('/api/mcp-tool', (req, res, next) => {
  // On suppose que tu reçois { prompt: "xxx", toolInput: {...} }
  const userPrompt = req.body.prompt;
  if (req.body.toolInput && userPrompt) {
    req.body.toolInput.prompt = userPrompt;
    // DEBUG: pour vérifier que le prompt est bien ajouté
    console.log('[MCP PATCH] toolInput after injection:', req.body.toolInput);
  }
  next();
});

// === Main routes (chat etc.) ===
setupRoutes(app);

// === Lancement du serveur ===
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

export default app;
