# NeuroTask

## Smart Task Breakdown for Developers

NeuroTask is a web application that helps development teams convert Product Requirements Documents (PRDs) into structured, actionable task lists for developers. By leveraging AI, it analyzes PRD content and generates categorized developer tasks, streamlining the pre-PR workflow.

## Features

- **Document Import**: Upload PRDs in multiple formats (PDF, DOCX, TXT, RTF, HTML, MD, CSV, JSON, XML)
- **Text Analysis**: AI-powered analysis of PRD content to extract actionable tasks
- **Task Generation**: Creates structured to-do lists with clearly defined tasks
- **Task Categorization**: Automatically sorts tasks into Backend, Frontend, and Testing categories
- **Task Management**: Mark tasks as completed, filter by category, search for specific tasks
- **Export Capabilities**: Download tasks as JSON for integration with other tools

## Getting Started

### Prerequisites

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/neurotask.git
   cd neurotask
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API key:
   ```
   REACT_APP_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Usage

### Step 1: Import PRD
- Enter your PRD text manually in the provided text area, or
- Upload a document file (PDF, DOCX, TXT, etc.)

### Step 2: Generate Tasks
- Preview the imported PRD content
- Click "Generate Developer Tasks" to analyze the document and create task lists

### Step 3: Review Tasks
- View the generated tasks categorized by Backend, Frontend, and Testing
- Mark tasks as completed as you work through them
- Filter tasks by category or search for specific tasks
- Export tasks as JSON for integration with other tools

## Technology Stack

- **React**: Frontend framework
- **Material-UI**: Component library for the user interface
- **Axios**: HTTP client for API requests
- **Mammoth**: Library for extracting text from Word documents
- **PDF.js** (implied): For extracting text from PDF files

## API Integration

NeuroTask uses Google's Gemini 1.5 Flash model for analyzing PRD documents and generating structured task lists. The application sends PRD content to the Gemini API and receives a structured JSON response containing categorized tasks.

## Project Structure

```
neurotask/
├── public/
├── src/
│   ├── components/
│   │   ├── PdfExtractor.js  # PDF text extraction utility
│   │   ├── TodoList.js      # Task list component
│   │   └── ...
│   ├── App.js               # Main application component
│   ├── index.js             # Application entry point
│   └── styles.css           # Global styles
├── .env                     # Environment variables (API keys)
├── package.json
└── README.md
```

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI task generation
- Material-UI for the component library
- All open-source libraries used in this project

## Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.