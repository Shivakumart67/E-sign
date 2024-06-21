import * as fs from "fs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FileStorageService {
  saveFile(path: string, data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) reject(err);
        else resolve(path);
      });
    });
  }

  createDirectoryIfNotExists(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }
}
