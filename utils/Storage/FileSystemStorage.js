import StorageInterface from "./StorageInterface.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname)

class FileSystemStorage extends StorageInterface {
  async upload(base64String, request_id) {
    const destinationPath = path.join(
      __dirname,
      "..",
      "..",
      "screenshots",
      "images"
    );
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    const imageName = path.join(destinationPath, `${request_id}.jpg`);
    // Decode the base64 string
    const buffer = Buffer.from(base64String, "base64");
    // Write the file to destination path
    fs.writeFileSync(imageName, buffer);
    return {
      filePath: imageName,
    };
  }

  async download(filePath) {
    // Check if file exist
    if (!fs.existsSync(filePath)) {
      throw new Error(`${filePath} not found`);
    }
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    return {
      fileBuffer,
      filePath,
    };
  }
  async delete(filePath) {
    // Check if file exist
    if (!fs.existsSync(filePath)) {
      throw new Error(`${filePath} not found`);
    }
    // delete the file at filePath
    fs.unlinkSync(filePath);
    return {
      filePath,
    };
  }
}

export default FileSystemStorage;
