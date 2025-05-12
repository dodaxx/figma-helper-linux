import express, { Request, Response } from 'express';
import cors from 'cors';
import { FontService } from './services/font.service';

// Constants
const PORT = 44950;
const VERSION = 17;

// Initialize services
const fontService = new FontService(VERSION);

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: "https://www.figma.com",
}));

// Routes
app.get("/figma/font-files", (req: Request, res: Response) => {
  console.log("Retrieving font  list");
  res.json(fontService.getFontList());
});

app.get("/figma/font-file", async (req: Request, res: Response) => {
  const filePath = req.query.file as string;
  if (filePath && fontService.getFontList().fontFiles[filePath]) {
    console.log("Retrieving font file:", filePath);
    res.setHeader("Content-Type", "application/octet-stream");
    try {
      const data = await fontService.getFontFile(filePath);
      res.send(data);
    } catch (err) {
      res.status(500).send("Failed to read font file");
    }
  } else {
    res.status(404).json({ error: "Font file not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://127.0.0.1:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});