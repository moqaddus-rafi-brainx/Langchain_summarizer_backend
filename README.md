# LangChain PDF Summarizer Backend

A Node.js backend API for loading and processing PDF and text documents using LangChain.

## Features

- Load PDF and text documents
- Extract document information
- RESTful API endpoints
- Error handling and validation
- Modular route structure

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Base URL: `http://localhost:3000`

### Health Endpoints
- **GET** `/api/health` - Basic health check
- **GET** `/api/health/detailed` - Detailed system health information

### Document Endpoints
- **POST** `/api/documents/load` - Load a document file
- **POST** `/api/documents/info` - Get document information
- **GET** `/api/documents/supported-types` - Get supported file types

### Summary Endpoints
- **GET** `/api/summary/health` - Summary service health check
- **GET** `/api/summary/status` - Summary service status and capabilities

## Example Usage

### Health Checks:
```bash
# Basic health check
curl http://localhost:3000/api/health

# Detailed health check
curl http://localhost:3000/api/health/detailed
```

### Document Operations:
```bash
# Load a document
curl -X POST http://localhost:3000/api/documents/load \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/path/to/document.pdf"}'

# Get document info
curl -X POST http://localhost:3000/api/documents/info \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/path/to/document.pdf"}'

# Get supported file types
curl http://localhost:3000/api/documents/supported-types
```

### Summary Service:
```bash
# Summary service health check
curl http://localhost:3000/api/summary/health

# Summary service status
curl http://localhost:3000/api/summary/status
```

### Using JavaScript:

```javascript
// Load document
const response = await fetch('http://localhost:3000/api/documents/load', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    filePath: '/path/to/document.pdf'
  })
});

const result = await response.json();
console.log(result);
```

## Supported File Types

- **PDF files** (.pdf)
- **Text files** (.txt)

## Response Format

All endpoints return a consistent response format:

```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

Or for errors:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Error description"
}
```

## Project Structure

```
├── controllers/
│   └── summaryController.js    # Business logic
├── routes/
│   ├── healthRoutes.js        # Health check endpoints
│   ├── documentRoutes.js      # Document processing endpoints
│   └── summaryRoutes.js       # Summary service endpoints
├── utils/
│   └── loader.js              # Document loading utilities
├── index.js                   # Main server file
└── package.json
```

## Route Organization

The API is organized into logical route groups:

- **Health Routes** (`/api/health`): System health and monitoring
- **Document Routes** (`/api/documents`): Document loading and processing
- **Summary Routes** (`/api/summary`): Summary service status and capabilities
