# Dairy Farm Production Tracker

Video explanation: https://www.youtube.com/watch?v=c-HOuCTnyOM

A mobile-first web application for dairy farm advisors to upload, store, and analyze production reports — with offline access to previously saved data.

## Problem Statement

Technical advisors for dairy farms spend significant time on-site reviewing production reports from various sources (PDFs with different formats). They face two main challenges:

1. **Poor/No Internet Connectivity** at farm locations
2. **Manual Data Review** — opening multiple PDFs, scrolling tables, taking notes

This solution provides a practical, mobile-friendly tool to:

- Upload production report PDFs
- Extract and structure data automatically via an internal API
- Store reports locally for offline access
- Visualize trends with per-metric charts and summary tables

## Features

- **Mobile-First Design** — Optimized for on-site tablet/phone use with responsive layouts
- **Offline Access** — Previously uploaded reports stay available without internet (localStorage). A reactive indicator notifies the user when connectivity changes.
- **Visual Analytics** — One chart per metric with focused Y-axis domains, making small differences visible even between values like 3.2% and 3.3%
- **Flexible Data Handling** — Adapts dynamically to whatever fields the API returns, preserving original column order. Null/missing values are handled gracefully with dash placeholders.
- **Local Persistence** — All extracted data persists in browser, no server dependency after upload
- **Report Management** — Upload multiple PDFs, switch between saved reports, delete old ones

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **Tailwind CSS v4** for styling (via Vite plugin)
- **Recharts** for data visualization
- **localStorage** for offline persistence

## Project Structure

```
src/
├── App.tsx                  # Main app layout, report selection, offline indicator
├── main.tsx                 # React entry point
├── index.css                # Tailwind import and base styles
├── components/
│   ├── Chart.tsx            # One chart per numeric field with Y-axis domain calculation
│   ├── DataTable.tsx        # Dynamic table with summary cards and formatted values
│   └── FileUpload.tsx       # PDF upload with progress feedback
├── services/
│   ├── api.ts               # API integration, polling, data transformation
│   └── storage.ts           # localStorage CRUD for reports
├── types/
│   └── index.ts             # TypeScript interfaces (flexible ProductionData, Report, etc.)
└── utils/
    └── format.ts            # Shared formatting helpers (field names, cell values)
```

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
3. **View Results** — Charts and a detailed table appear automatically
4. **Offline Access** — Reload the page — your data persists
5. **Switch Between Reports** — Upload multiple PDFs and select any to review

## Architecture Decisions

### Why Offline Access via localStorage?

Farm locations often have poor connectivity. By storing extracted data in localStorage, advisors can review previously uploaded reports without internet. Upload still requires connectivity. The app listens for `online`/`offline` events and shows a banner when the user goes offline.

### Why Flexible Data Structure?

Production reports vary widely (milk production, lab results, delivery summaries). The app dynamically adapts to whatever fields the PDF contains, rather than hardcoding specific columns. `ProductionData` uses a flexible `[key: string]: unknown` shape, and field order is preserved from the API response.

### Why localStorage over IndexedDB?

For MVP simplicity. localStorage is sufficient for storing ~10-20 reports (under 5MB). Future versions could migrate to IndexedDB for larger datasets.

### Why One Chart Per Metric?

Different metrics have very different scales (e.g. litres: 45,000 vs fat percentage: 3.8). Combining them on one chart makes smaller values invisible. Separate charts give each metric its own Y-axis with a focused domain (calculated from the actual data range), which is much more readable — especially on mobile.

### Why Shared Formatting Utilities?

Field name formatting (`camelCase` to readable text) and cell value formatting (numbers, percentages, null handling) are used across multiple components. Extracting them to `src/utils/format.ts` avoids duplication and ensures consistent display everywhere.

## Key Assumptions

1. **User has internet during upload** — Initial PDF processing requires connectivity
2. **PDF quality is reasonable** — OCR extraction may have imperfections (the app handles missing/null values gracefully with dash placeholders)
3. **Mobile devices are primary use case** — Design prioritizes touch interactions and small screens
4. **Single farm context** — Currently configured for "Farm_Zero_C" client

## API Integration

Uses a document processing service:

- `POST /process-file/` — Submit PDF for async processing, returns `session_id`
- `GET /results/{session_id}/dairyProduction` — Poll for extracted JSON data

The app handles asynchronous processing with automatic retry logic (up to 30 attempts, 2s intervals). The `transformApiData()` function converts API responses into the app's internal format, mapping `ordinal` to month names and preserving all other fields in their original order.

## AI Tools Used

See [PROMPTS.md](PROMPTS.md) for detailed documentation of AI assistance.
