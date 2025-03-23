import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArticleIcon from "@mui/icons-material/Article";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import * as mammoth from "mammoth";
import { extractPdfText } from "./components/PdfExtractor";
import TodoList from "./components/TodoList"; // Import the TodoList component
import "./styles.css";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f8fa",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

// Helper function to read file as text
const readAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// Helper function to extract text from Word documents
const extractWordText = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Helper function to extract text from HTML
const extractHtmlText = async (file) => {
  const html = await readAsText(file);
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// File converter plugin
const FileConverter = {
  // Extract text from different file types
  extractText: async (file) => {
    if (!file) return null;

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // Plain text files
    if (fileType === "text/plain") {
      return await readAsText(file);
    }

    // PDF files
    else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return await extractPdfText(file);
    }

    // Word documents
    else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword" ||
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc")
    ) {
      return await extractWordText(file);
    }

    // Rich text format
    else if (fileType === "application/rtf" || fileName.endsWith(".rtf")) {
      return await readAsText(file);
    }

    // HTML files
    else if (
      fileType === "text/html" ||
      fileName.endsWith(".html") ||
      fileName.endsWith(".htm")
    ) {
      return await extractHtmlText(file);
    }

    // CSV files
    else if (fileType === "text/csv" || fileName.endsWith(".csv")) {
      return await readAsText(file);
    }

    // JSON files
    else if (fileType === "application/json" || fileName.endsWith(".json")) {
      return await readAsText(file);
    }

    // Markdown files
    else if (fileType === "text/markdown" || fileName.endsWith(".md")) {
      return await readAsText(file);
    }

    // XML files
    else if (fileType === "application/xml" || fileName.endsWith(".xml")) {
      return await readAsText(file);
    }

    // Unsupported file type
    else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  },
};

const App = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState(null);
  const [fileText, setFileText] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle text input change
  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  // Handle file selection and conversion
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setProcessingFile(true);
    setError(null);

    try {
      const extractedText = await FileConverter.extractText(selectedFile);
      setFileText(extractedText);
      // Update the text input with the file content
      setTextInput(extractedText);
      setSuccessMessage(`Successfully processed "${selectedFile.name}"`);
    } catch (err) {
      console.error("File conversion error:", err);
      setError(`Error converting file: ${err.message}`);
    } finally {
      setProcessingFile(false);
    }
  };

  // Clear the file and text input
  const handleClearDocument = () => {
    setFile(null);
    setFileText("");
    setTextInput("");
  };

  // Navigate to next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Navigate to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Make API call
  const handleApiCall = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    let inputData = textInput || fileText;

    if (!inputData) {
      setError("Please enter text or upload a file.");
      setLoading(false);
      return;
    }

    const apiKey = process.env.REACT_APP_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Analyze the PRD below and generate a **structured to-do list** for developers to complete **before submitting a PR**.
    
    ### Guidelines:
    - Focus only on **development** and **pre-PR manual testing**.
    - **Exclude deployment, CI/CD, and post-merge tasks**.
    - **Exclude unit tests** (assumed to be automated).
    - Testing should be written for developers performing **manual unit tests** (not testers). No automated test instructions.
    - Ensure **every task has a heading and a description**.
    - Categorize tasks into **Backend, Frontend, and Testing**.
    
    ### Format:
    Return a JSON array where each task follows this structure:
    {
      "id": 1,
      "heading": "[Short Task Title]",
      "description": "[Brief Explanation]",
      "category": "[backend/frontend/testing]",
      "completed": false
    }
    
    ### PRD Content:
    ${inputData}
    
    Ensure all necessary development and testing tasks are **clearly outlined**.`,
            },
          ],
        },
      ],
    };

    try {
      console.log("Sending request:", requestBody);

      const res = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      let generatedText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";
      generatedText = generatedText.replace(/```json\n|\n```/g, "").trim();
      
      const parsedResponse = JSON.parse(generatedText);
      setResponse(parsedResponse);
      setSuccessMessage("Tasks generated successfully!");
      handleNext(); // Move to the next step automatically
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch response from API. Please try again.");
    }

    setLoading(false);
  };

  // Handle task update (when checking/unchecking tasks)
  const handleTaskUpdate = (updatedTasks) => {
    setResponse(updatedTasks);
  };

  // Download tasks as JSON
  const handleDownloadJson = () => {
    if (!response) return;
    
    const jsonString = JSON.stringify(response, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSuccessMessage("Tasks downloaded as JSON!");
  };

  // Steps for the stepper
  const steps = [
    { label: "Import PRD", icon: <ArticleIcon /> },
    { label: "Generate Tasks", icon: <AutoAwesomeIcon /> },
    { label: "Review Tasks", icon: <TaskAltIcon /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormatListBulletedIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1.5 }} />
              <Typography variant="h4" color="primary.main">
                NeuroTask
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Smart Task Breakdown
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                      color: activeStep >= index ? 'white' : 'grey.700',
                    }}
                  >
                    {step.icon}
                  </Box>
                )}>
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 4 }} />

          {/* Step Content */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Import Product Requirements Document
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Enter your PRD text or upload a document file. We support PDF, Word, TXT, and other text formats.
              </Typography>

              {/* Content Cards */}
              <Grid container spacing={3}>
                {/* Text Input Card */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ArticleIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Enter PRD Text</Typography>
                      </Box>
                      <TextField
                        label="Paste your PRD content here"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={8}
                        value={textInput}
                        onChange={handleTextChange}
                        sx={{ mb: 2 }}
                        placeholder="Copy and paste your requirements document here..."
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {textInput && (
                          <Button
                            startIcon={<DeleteIcon />}
                            onClick={handleClearDocument}
                            sx={{ mr: 1 }}
                          >
                            Clear
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* File Upload Card */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CloudUploadIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Upload PRD File</Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          border: '2px dashed',
                          borderColor: 'primary.light',
                          borderRadius: 2,
                          p: 3,
                          mb: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '160px',
                          bgcolor: 'rgba(63, 81, 181, 0.04)'
                        }}
                      >
                        {file ? (
                          <Box sx={{ textAlign: 'center' }}>
                            <ArticleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                            <Typography variant="subtitle1" fontWeight="medium">
                              {file.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {Math.round(file.size / 1024)} KB • {fileText.length} characters extracted
                            </Typography>
                            <Button
                              startIcon={<DeleteIcon />}
                              onClick={handleClearDocument}
                              sx={{ mt: 2 }}
                            >
                              Remove File
                            </Button>
                          </Box>
                        ) : (
                          <>
                            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.light', mb: 1 }} />
                            <Typography sx={{ mb: 1 }}>Drag and drop your file here or</Typography>
                            <Button
                              variant="contained"
                              component="label"
                              disabled={processingFile}
                            >
                              {processingFile ? "Processing..." : "Choose File"}
                              <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              Supported formats: PDF, DOCX, TXT, RTF, HTML, MD
                            </Typography>
                          </>
                        )}
                        {processingFile && <CircularProgress size={24} sx={{ mt: 2 }} />}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Tooltip title="Enter your PRD content or upload a document to continue">
                  <span>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!textInput && !fileText}
                      sx={{ minWidth: 150 }}
                    >
                      Continue
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Generate Developer Tasks
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                We'll analyze your PRD and generate a structured task list for developers, categorized into Backend, Frontend, and Testing tasks.
              </Typography>

              {/* PRD Preview */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ArticleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">PRD Content Preview</Typography>
                    <Tooltip title="This is what we'll analyze to generate your tasks">
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      maxHeight: '200px',
                      overflow: 'auto',
                      bgcolor: 'grey.50',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                    }}
                  >
                    {textInput || fileText}
                  </Paper>
                </CardContent>
              </Card>

              {/* Generation Button */}
              <Box sx={{ textAlign: 'center', my: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleApiCall}
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />
                  }
                  sx={{ px: 4, py: 1.5 }}
                >
                  {loading ? "Generating Tasks..." : "Generate Developer Tasks"}
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  This may take a moment as we analyze your document
                </Typography>
              </Box>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Developer Task List
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Here are the generated tasks based on your PRD. You can mark tasks as completed, filter by category, or search for specific tasks.
              </Typography>

              {/* Todo List Component */}
              {response ? (
                <>
                  <TodoList tasks={response} onTaskUpdate={handleTaskUpdate} />
                  
                  {/* Download Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadJson}
                      sx={{ mr: 2 }}
                    >
                      Download Tasks as JSON
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                    >
                      Save Tasks
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading tasks...</Typography>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
              </Box>
            </Box>
          )}

          {/* Success and Error Messages */}
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!successMessage}
            autoHideDuration={4000}
            onClose={() => setSuccessMessage(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="success" onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;