"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const font_service_1 = require("./services/font.service");
// Constants
const PORT = 44950;
const VERSION = 17;
// Initialize services
const fontService = new font_service_1.FontService(VERSION);
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "https://www.figma.com",
}));
// Routes
app.get("/figma/font-files", (req, res) => {
    console.log("Retrieving font  list");
    res.json(fontService.getFontList());
});
app.get("/figma/font-file", async (req, res) => {
    const filePath = req.query.file;
    if (filePath && fontService.getFontList().fontFiles[filePath]) {
        console.log("Retrieving font file:", filePath);
        res.setHeader("Content-Type", "application/octet-stream");
        try {
            const data = await fontService.getFontFile(filePath);
            res.send(data);
        }
        catch (err) {
            res.status(500).send("Failed to read font file");
        }
    }
    else {
        res.status(404).json({ error: "Font file not found" });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server started on http://127.0.0.1:${PORT}`);
}).on('error', (err) => {
    console.error('❌ Server failed to start:', err);
});
