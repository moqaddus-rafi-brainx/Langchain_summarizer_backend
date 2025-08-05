import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config(); // Load OPENAI_API_KEY from .env

/**
 * Summarizes an array of LangChain Documents using OpenAI directly.
 * @param {Document[]} documents - Array of LangChain documents (from PDF or TXT).
 * @returns {Promise<string>} - The generated summary.
 */
export async function summarizeDocuments(documents) {
  try {
    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const textContent = documents.map(doc => doc.pageContent).join('\n\n');
    const prompt = `Please provide a comprehensive 4-5 lines summary of the following text. Focus on the key points and main ideas:
${textContent}
Summary:`;
    
    const response = await llm.invoke(prompt);
    return {
      text: response.content
    }; 
  } catch (err) {
    console.error(`❌ Error during summarization :`, err);
    throw err;
  }
}
