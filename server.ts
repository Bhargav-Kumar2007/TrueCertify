import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log('Starting TrueCertify server...');
  console.log('NODE_ENV:', process.env.NODE_ENV);

  // Request logger
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  const upload = multer({ storage: multer.memoryStorage() });

  // API Routes (Now handled client-side via Firestore for Vercel persistence)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API 404 handler - prevent falling through to Vite for /api routes
  app.use("/api", (req, res) => {
    console.log(`404 API: ${req.method} ${req.url}`);
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TrueCertify Server running on http://localhost:${PORT}`);
  });
}

startServer();
