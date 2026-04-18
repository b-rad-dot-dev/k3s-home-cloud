const express = require('express');
const multer = require('multer');
const { mdToPdf } = require('md-to-pdf');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files (index.html)

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/markdown' || file.originalname.endsWith('.md')) {
      cb(null, true);
    } else {
      cb(new Error('Only .md files are allowed'), false);
    }
  }
});

// Convert markdown to PDF buffer
async function convertMarkdownToPdf(markdownContent) {
  console.log('[md-to-pdf] Starting conversion...');
  
  // md-to-pdf v3.x expects an object with content property
  const result = await mdToPdf({ content: markdownContent }, {
    launch_options: {
      headless: "new",
      args: ["--no-sandbox", "--disable-dev-shm-usage"]
    }
  });
  
  // According to docs, result has { filename, content } properties
  // The actual PDF data is in result.content (could be Buffer or Uint8Array)
  let pdfBuffer;
  if (typeof result === 'object' && result.content) {
    // Convert to Buffer if it's not already (handles Uint8Array, etc.)
    pdfBuffer = Buffer.from(result.content);
  } else if (result instanceof Buffer) {
    pdfBuffer = result;
  } else {
    throw new Error(`Unexpected md-to-pdf result type: ${typeof result}`);
  }
  
  console.log(`[md-to-pdf] Conversion successful! PDF size: ${pdfBuffer.length} bytes`);
  return pdfBuffer;
}

// API endpoint for converting pasted markdown content
app.post('/api/convert', async (req, res) => {
  try {
    const { markdown } = req.body;
    
    if (!markdown || typeof markdown !== 'string') {
      console.log('[API /convert] Error: Markdown content is required');
      return res.status(400).json({ error: 'Markdown content is required' });
    }

    console.log(`[API /convert] Received pasted content - Length: ${markdown.length} characters`);

    const pdfBuffer = await convertMarkdownToPdf(markdown);
    
    // Return as base64 for frontend to create blob
    const base64Data = pdfBuffer.toString('base64');
    console.log(`[API /convert] Sending response - Base64 length: ${base64Data.length} characters`);
    
    res.json({
      success: true,
      data: base64Data,
      mimeType: 'application/pdf'
    });
  } catch (error) {
    console.error('[API /convert] Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to convert markdown to PDF',
      message: error.message 
    });
  }
});

// API endpoint for uploading and converting markdown file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('[API /upload] Error: No file uploaded');
      return res.status(400).json({ error: 'No file uploaded. Please upload a .md file.' });
    }

    const markdownContent = req.file.buffer.toString('utf8');
    console.log(`[API /upload] Received file - Name: "${req.file.originalname}", Size: ${markdownContent.length} characters`);

    const pdfBuffer = await convertMarkdownToPdf(markdownContent);
    
    // Return as base64 for frontend to create blob
    const base64Data = pdfBuffer.toString('base64');
    console.log(`[API /upload] Sending response - Base64 length: ${base64Data.length} characters`);
    
    res.json({
      success: true,
      data: base64Data,
      mimeType: 'application/pdf'
    });
  } catch (error) {
    console.error('[API /upload] Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to convert markdown file to PDF',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Markdown to PDF converter running at http://localhost:${PORT}`);
});
