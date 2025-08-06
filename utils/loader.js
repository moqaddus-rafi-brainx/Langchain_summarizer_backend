import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";

//load the file and return the documents.
export async function loadFile(filePath) {
  const ext = path.extname(filePath.originalname).toLowerCase();
  if (ext === ".txt") {
    const loader = new TextLoader(filePath.path);
    return await loader.load();
  }
  if (ext === ".pdf") {
    const loader = new PDFLoader(filePath.path,{
        splitPages: false,
      });
    return await loader.load();
  }
  throw new Error("Unsupported file type. Only .txt and .pdf are supported.");
}
