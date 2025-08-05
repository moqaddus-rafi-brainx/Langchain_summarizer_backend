# LangChain PDF Summarizer Backend

A Node.js backend API for loading, processing, and summarizing PDF and text documents using LangChain and LangGraph with human approval workflow.

## Features

- **Document Processing**: Load PDF and text documents
- **AI Summarization**: Generate summaries using OpenAI GPT-3.5-turbo
- **Human Approval Workflow**: LangGraph-based workflow with human approval step
- **Database Integration**: Save approved summaries to MongoDB
- **RESTful API**: Clean API endpoints for document processing
- **Error Handling**: Comprehensive error handling and validation
- **Modular Architecture**: Well-organized code structure

## Technology Stack

- **Node.js** with Express.js
- **LangChain** for AI document processing
- **LangGraph** for workflow orchestration
- **OpenAI GPT-3.5-turbo** for summarization
- **MongoDB** for data storage
- **Multer** for file uploads

## Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd Langchain_summarizer_backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create a `.env` file** in the root directory:
```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=your_mongodb_connection_string
```

4. **Start the server**:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Base URL: `http://localhost:3000`

### Upload & Processing Endpoints
- **POST** `/api/upload/load-document` - Upload and process document with summarization
- **POST** `/api/upload/save-summary` - Handle human approval and save to database


## Workflow

### 1. Document Upload & Processing
```bash
curl -X POST http://localhost:3000/api/upload/load-document \
  -F "document=@/path/to/your/document.pdf"
```

**Response**:
```json
{
  "threadId": "uuid-string",
  "summary": "Generated summary text...",
  "needsApproval": true,
  "message": "Summary generated, waiting for human approval"
}
```

### 2. Human Approval
```bash
curl -X POST http://localhost:3000/api/upload/save-summary \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "uuid-string",
    "decision": true
  }'
```

**Response (Approved)**:
```json
{
  "success": true,
  "result": {
    "success": true,
    "message": "✅ Summary successfully saved to database",
    "savedSummary": "Summary text...",
    "saveResult": "Database save result"
  },
  "message": "Summary approved and saved"
}
```

**Response (Rejected)**:
```json
{
  "success": false,
  "result": {
    "success": false,
    "message": "❌ Summary was rejected by user",
    "rejectedSummary": "Summary text...",
    "action": "rejected"
  },
  "message": "Summary rejected"
}
```

## LangGraph Workflow

The application uses LangGraph to orchestrate a multi-step workflow:

1. **Load & Generate Summary** (`loadAndGenerateSummary`):
   - Loads document using LangChain document loaders
   - Generates summary using OpenAI GPT-3.5-turbo
   - Returns summary text

2. **Human Approval** (`humanApproval`):
   - Interrupts workflow for human decision
   - Routes to appropriate path based on decision

3. **Save Summary** (`saveSummary`):
   - Saves approved summary to MongoDB
   - Returns success message

4. **Reject Summary** (`rejectedSummary`):
   - Handles rejected summaries
   - Returns rejection message

## Supported File Types

- **PDF files** (.pdf) - Using PDFLoader
- **Text files** (.txt) - Using TextLoader

## Project Structure

```
├── controllers/
│   └── summaryController.js    # LangGraph workflow controllers
├── routes/
│   └── uploadRoutes.js        # Upload and processing endpoints
├── langraph/
│   ├── graph.js              # LangGraph workflow definition
│   └── nodes.js              # Workflow node functions
├── utils/
│   ├── loader.js             # Document loading utilities
│   ├── llm.js                # LLM summarization functions
│   ├── saveSummary.js        # Database save utilities
│   └── approveSummary.js     # Approval utilities
├── models/
│   └── Summary.js            # MongoDB schema
├── index.js                  # Main server file
└── package.json
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 3000) |
| `OPENAI_API_KEY` | OpenAI API key for LLM | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |

## Error Handling

The API provides comprehensive error handling:

- **File Upload Errors**: Invalid file types, missing files
- **Processing Errors**: Document loading failures, LLM errors
- **Database Errors**: Connection issues, save failures
- **Workflow Errors**: LangGraph execution errors

## Response Format

All endpoints return a consistent response format:

**Success Response**:
```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Error description"
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Code Structure
- **ES Modules**: Uses ES module syntax throughout
- **LangGraph**: Modern workflow orchestration
- **Direct LLM**: Uses OpenAI LLM directly for summarization
- **Human-in-the-Loop**: Includes human approval step

## License

[Add your license information here]
