import { StateGraph, Command, END, MemorySaver } from "@langchain/langgraph";

import { loadAndGenerateSummary, humanApproval, saveSummary, rejectedSummary, State } from "./nodes.js";

const builder = new StateGraph(State);

builder.addNode("generate_llm_output", loadAndGenerateSummary);
builder.addNode("human_approval", humanApproval, { ends: ["approved_path", "rejected_path"] });
builder.addNode("approved_path", saveSummary);
builder.addNode("rejected_path", rejectedSummary);

builder.setEntryPoint("generate_llm_output");
builder.addEdge("generate_llm_output", "human_approval");

builder.addEdge("approved_path", END);
builder.addEdge("rejected_path", END);

const checkpointer = new MemorySaver();
const graph = builder.compile({ checkpointer });

export default graph;

