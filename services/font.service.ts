import { execSync } from 'child_process';
import { IFont, IResponse } from '../interfaces/font.interfaces';
import * as fs from 'fs';

export class FontService {
  private response: IResponse;

  constructor(version: number) {
    this.response = {
      fontFiles: {},
      version,
    };
    this.loadFonts();
  }

  private createFontInfo(info: string[]): IFont {
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

  private loadFonts(): void {
    try {
      const stdout = execSync(
        `bash -c "fc-list --format '%{file}|%{family[0]}|%{weight}|%{style[0]}|%{postscriptname}\\n' | sort | grep -e '\\.ttf\\|\\.otf'"`
      ).toString();

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
    } catch (error) {
      console.error("Failed to retrieve fonts using fc-list:", error);
    }
  }

  public getFontList(): IResponse {
    return this.response;
  }

  public getFontFile(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}