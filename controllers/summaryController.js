
import graph from "../langraph/graph.js";
import { v4 as uuidv4 } from "uuid";
import { Command } from "@langchain/langgraph";

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
    const commandValue = decision==='approve' ? "approve" : "reject";
    //again invoke with resume command.
    //command value will be used my humanApproval node to route to appropriate path.
    const finalResult = await graph.invoke(
     new Command({resume:commandValue}),
      config
    );

    res.json({ 
      success: true,
      result: finalResult,
      message: decision==='approve' ? 'Summary approved and saved' : 'Summary rejected'
    });
    
  } catch (error) {
    console.error("❌ Error in humanApproval:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to process approval'
    });
  }
};



