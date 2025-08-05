import { DynamicStructuredTool } from "@langchain/core/tools";
import Summary from '../models/Summary.js';

//save the summary to the database.
export const saveSummaryTool = new DynamicStructuredTool({
  name: "save_summary_to_database",
  description: "Save a summary text to the database",
  schema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "The summary text to save to database"
      }
    },
    required: ["summary"]
  },
  func: async ({ summary }) => {
    try {
      const summaryDoc = new Summary({
        text: summary
      });
      
      await summaryDoc.save();
      
      return {
        success: true,
        summaryId: summaryDoc._id.toString(),
        message: `Summary successfully saved to database with ID: ${summaryDoc._id}`
      };
    } catch (error) {
      console.error('❌ Error saving summary to database:', error);
      throw new Error(`Failed to save summary: ${error.message}`);
    }
  }
});