
import { ChatOpenAI } from "@langchain/openai";
import { loadFile } from "../utils/loader.js";
import { summarizeDocuments } from "../utils/llm.js";
import { interrupt } from "@langchain/langgraph";
import { saveSummaryTool } from "../utils/saveSummary.js";
import { Annotation } from "@langchain/langgraph";
import { Command } from "@langchain/langgraph";

export const State = Annotation.Root({
  llm_output: Annotation(),
  decision: Annotation(),
  file: Annotation(),
});

//first node to get the  and generate summary.
async function loadAndGenerateSummary(state) {
    try {
        if (!state.file) {
            throw new Error("No file provided in state");
        }

        const documents = await loadFile(state.file);
        const summary = await summarizeDocuments(documents);
        
        const result = {
            llm_output: summary.text,
        };
        
        return result;
        
    } catch (error) {
        console.error("❌ Error in loadAndGenerateSummary:", error);
        throw error;
    }
}

//second node to get the human approval (includes interrupt).
async function humanApproval(state) {
    // Get the decision from the interrupt
    const decision = await interrupt({
        "llm_output": state["llm_output"]
    });

    // Return Command to route to appropriate path
    if (decision === "approve") {
        return new Command({goto:"approved_path", update:{decision: "approved"}});
    }
    else
    {
        return new Command({goto:"rejected_path", update:{decision: "rejected"}});
    }
}

//third node to save the summary to the database.
async function saveSummary(state) {
    try {
        const saveResult = await saveSummaryTool.invoke({
            summary: state["llm_output"],
        });

        return {
            success: true,
            message: "✅ Summary successfully saved to database",
            savedSummary: state["llm_output"],
            saveResult: saveResult
        };
        
    } catch (error) {
        console.error("❌ Database save failed:", error);
        return {
            success: false,
            message: "❌ Failed to save summary to database",
            error: error.message
        };
    }
}

//fourth node to handle the rejected summary.
async function rejectedSummary(state) {
    return {
        success: false,
        message: "❌ Summary was rejected by user",
        rejectedSummary: state["llm_output"],
        action: "rejected"
    };
}

export {
    loadAndGenerateSummary,
    humanApproval,
    saveSummary,
    rejectedSummary,
};
  


