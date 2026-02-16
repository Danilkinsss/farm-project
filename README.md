# Dairy Farm Production Tracker

A mobile-first Progressive Web App for dairy farm advisors to upload, store, and analyze production reports offline.

## 🎯 Problem Statement

Technical advisors for dairy farms spend significant time on-site reviewing production reports from various sources (PDFs with different formats). They face two main challenges:

1. **Poor/No Internet Connectivity** at farm locations
2. **Manual Data Review** - opening multiple PDFs, scrolling tables, taking notes

This solution provides a practical, mobile-friendly tool to:

- Upload production report PDFs
- Extract and structure data automatically
- Store reports locally for offline access
- Visualize trends and compare data easily

## 🚀 Features

- **📱 Mobile-First Design** - Optimized for on-site tablet/phone use
- **📡 Offline-First** - Works without internet after initial data upload
- **📊 Visual Analytics** - Charts and tables for quick insights
- **🔄 Flexible Data Handling** - Adapts to different PDF report structures
- **💾 Local Storage** - All data persists in browser, no server dependency

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **LocalStorage API** for offline persistence

## 📦 Installation

```bash
# Clone repository
git clone <your-repo-url>
cd dairy-farm-tracker

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎮 Usage

1. **Upload a PDF** - Click the upload area and select a production report
2. **Wait for Processing** - The API extracts data (30-60 seconds)
3. **View Results** - See charts and detailed tables automatically
4. **Offline Access** - Reload the page - your data persists!
5. **Compare Reports** - Upload multiple PDFs and switch between them

## 🏗️ Architecture Decisions

### Why Offline-First?

Farm locations often have poor connectivity. By storing data in localStorage, advisors can access previously uploaded reports without internet.

### Why Flexible Data Structure?

Production reports vary widely (milk production, lab results, delivery summaries). The app dynamically adapts to whatever fields the PDF contains, rather than hardcoding specific columns.

### Why localStorage over IndexedDB?

For MVP simplicity. localStorage is sufficient for storing ~10-20 reports (under 5MB). Future versions could migrate to IndexedDB for larger datasets.

## 🔑 Key Assumptions

1. **User has internet during upload** - Initial PDF processing requires connectivity
2. **PDF quality is reasonable** - OCR extraction may have imperfections (addressed in UI)
3. **Mobile devices are primary use case** - Design prioritizes touch interactions
4. **Single farm context** - Currently hardcoded to "Farm_Zero_C" client

## 📊 API Integration

Uses a document processing service:

- `POST /process-file/` - Submit PDF, returns session_id
- `GET /results/{session_id}/dairyProduction` - Poll for extracted JSON data

The app handles asynchronous processing with automatic retry logic.

## 🎥 Demo

[Link to video demonstration]

## 🧠 AI Tools Used

See [PROMPTS.md](PROMPTS.md) for detailed documentation of AI assistance.

## 📄 License

MIT
