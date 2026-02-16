# Dairy Farm Production Tracker

A mobile-first web application for dairy farm advisors to upload, store, and analyze production reports — with offline access to previously saved data.

## Problem Statement

Technical advisors for dairy farms spend significant time on-site reviewing production reports from various sources (PDFs with different formats). They face two main challenges:

1. **Poor/No Internet Connectivity** at farm locations
2. **Manual Data Review** — opening multiple PDFs, scrolling tables, taking notes

This solution provides a practical, mobile-friendly tool to:

- Upload production report PDFs
- Extract and structure data automatically
- Store reports locally for offline access
- Visualize trends and compare data easily

## Features

- **Mobile-First Design** — Optimized for on-site tablet/phone use
- **Offline Access** — Previously uploaded reports are available without internet (via localStorage)
- **Visual Analytics** — Individual charts per metric for clear trend visibility
- **Flexible Data Handling** — Adapts to different PDF report structures dynamically
- **Local Persistence** — All data persists in browser, no server dependency after upload

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **localStorage** for offline persistence

## Installation

```bash
git clone https://github.com/<your-username>/farm-project.git
cd farm-project
npm install
npm run dev
```

## Usage

1. **Upload a PDF** — Click the upload area and select a production report
2. **Wait for Processing** — The API extracts data (30-60 seconds)
3. **View Results** — See charts and detailed tables automatically
4. **Offline Access** — Reload the page — your data persists
5. **Switch Between Reports** — Upload multiple PDFs and select any to review

## Architecture Decisions

### Why Offline Access via localStorage?

Farm locations often have poor connectivity. By storing extracted data in localStorage, advisors can review previously uploaded reports without internet. Upload still requires connectivity.

### Why Flexible Data Structure?

Production reports vary widely (milk production, lab results, delivery summaries). The app dynamically adapts to whatever fields the PDF contains, rather than hardcoding specific columns. This means `ProductionData` uses a flexible `[key: string]: unknown` shape.

### Why localStorage over IndexedDB?

For MVP simplicity. localStorage is sufficient for storing ~10-20 reports (under 5MB). Future versions could migrate to IndexedDB for larger datasets.

### Why One Chart Per Metric?

Different metrics have very different scales (e.g. litres: 45,000 vs fat percentage: 3.8). Combining them on one chart makes smaller values invisible. Separate charts give each metric its own Y-axis and scale, which is much more readable — especially on mobile.

## Key Assumptions

1. **User has internet during upload** — Initial PDF processing requires connectivity
2. **PDF quality is reasonable** — OCR extraction may have imperfections (the app handles missing/null values gracefully)
3. **Mobile devices are primary use case** — Design prioritizes touch interactions and small screens
4. **Single farm context** — Currently configured for "Farm_Zero_C" client

## API Integration

Uses a document processing service:

- `POST /process-file/` — Submit PDF for async processing, returns `session_id`
- `GET /results/{session_id}/dairyProduction` — Poll for extracted JSON data

The app handles asynchronous processing with automatic retry logic (up to 30 attempts, 2s intervals).

## AI Tools Used

See [PROMPTS.md](PROMPTS.md) for detailed documentation of AI assistance.
