
import graph from "../utils/langraph/graph.js";
import { v4 as uuidv4 } from "uuid";
import { Command } from "@langchain/langgraph";
import { APPROVAL_DECISIONS } from "../constants.js";

const threadStore = {}; // Or use Redis

export const generateSummary = async (req, res) => {
  try {
    const threadId = uuidv4(); //required for the graph to work.
    const config = { configurable: { thread_id: threadId } };

    //initial state of the graph for the first node to get the file.
    const initialState = {
      file: req.file,
    };
    //invoke the graph with the initial state and config.
    const result = await graph.invoke(initialState, config);
    threadStore[threadId] = config;

    //interrupt.
    if (result.__interrupt__ && result.__interrupt__.length > 0) {
      res.json({
        threadId,
        summary: result.llm_output, //This is the summary from loadAndGenerateSummary
        needsApproval: true,
        message: 'Summary generated, waiting for human approval'
      });
    } else {
      //No interrupt.
      res.json({
        threadId,
        summary: result.llm_output,
        message: 'Summary completed successfully'
      });
    }
    
  } catch (error) {
    console.error("❌ Error in generateSummary:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to generate summary'
    });
  }
};

//after interrupt occured.
export const humanApproval = async (req, res) => {
  try {
    const { threadId, decision } = req.body;
    const config = threadStore[threadId];
    if (!config) {
      return res.status(400).json({ error: "Invalid threadId" });
    }
    
    const commandValue = decision === APPROVAL_DECISIONS.APPROVE ? APPROVAL_DECISIONS.APPROVE : 
                        decision === APPROVAL_DECISIONS.REJECT ? APPROVAL_DECISIONS.REJECT :
                        APPROVAL_DECISIONS.REGENERATE;
    
    const finalResult = await graph.invoke(
      new Command({resume: commandValue}),
      config
    );

    //if regenerate, send back the new summary for approval again.
    if (finalResult.__interrupt__ && finalResult.__interrupt__.length > 0) {
      res.json({
        threadId,
        summary: finalResult.llm_output,
        needsApproval: true,
        message: 'Summary regenerated, waiting for human approval'
      });
    } else {
      //else its either saved in db or rejected.
      res.json({ 
        success: true,
        result: finalResult,
        message: decision === APPROVAL_DECISIONS.APPROVE ? 'Summary approved and saved' : 
                decision === APPROVAL_DECISIONS.REJECT ? 'Summary rejected' :
                'Summary regenerated and approved'
      });
    }
    
  } catch (error) {
    console.error("❌ Error in humanApproval:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to process approval'
    });
  }
};



