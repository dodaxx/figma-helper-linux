"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontService = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
class FontService {
    constructor(version) {
        this.response = {
            fontFiles: {},
            version,
        };
        this.loadFonts();
    }
    createFontInfo(info) {
        return {
            localizedFamily: info[1],
            postscript: info[4],
            style: info[3],
            weight: info[2],
            stretch: 5,
            italic: info[3] === "Italic" || info[3] === "Oblique",
            family: info[1],
            localizedStyle: info[3],
        };
    }
    loadFonts() {
        try {
            const stdout = (0, child_process_1.execSync)(`bash -c "fc-list --format '%{file}|%{family[0]}|%{weight}|%{style[0]}|%{postscriptname}\\n' | sort | grep -e '\\.ttf\\|\\.otf'"`).toString();
            stdout.split("\n").forEach((line) => {
                const info = line.split("|");
                if (info.length === 5) {
                    const filePath = info[0];
                    if (!this.response.fontFiles[filePath]) {
                        this.response.fontFiles[filePath] = [];
                    }
                    this.response.fontFiles[filePath].push(this.createFontInfo(info));
                }
            });
        }
        catch (error) {
            console.error("Failed to retrieve fonts using fc-list:", error);
        }
    }
    getFontList() {
        return this.response;
    }
    getFontFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
}
exports.FontService = FontService;
