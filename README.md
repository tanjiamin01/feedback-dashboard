# Feedback Intelligence Dashboard

An AI-powered feedback management system built for product managers using Cloudflare's Developer Platform.

**Live Demo:** [Link](https://feedback-dashboard.quiet-frost-42e7.workers.dev)

## Overview

This dashboard aggregates mock customer feedback and uses AI to automatically prioritize issues and extract themes.

## Features

- **AI-Powered Analysis** - Automatic priority classification and theme extraction using Workers AI (Llama 3)
- **Visual Analytics** - Donut charts, source distribution, and priority breakdowns
- **Workflow Management** - Kanban-style tabs (New → In Progress → Completed)
- **Smart Filtering** - Filter by priority, source, theme, or status
- **Persistent State** - Status changes saved to D1 database
- **Real-time Insights** - AI-generated executive summaries

## Tech Stack

- **Cloudflare Workers** - Serverless application hosting
- **D1 Database** - SQL database for feedback storage
- **Workers AI** - LLM-powered analysis (Llama 3 8B Instruct)

## Architecture
```
User Request
    ↓
Cloudflare Workers (Frontend + API)
    ↓
┌─────────────┬──────────────┐
│             │              │
D1 Database   Workers AI     │
(Feedback)    (Analysis)     │
│             │              │
└─────────────┴──────────────┘
```

### Data Flow
1. Dashboard loads feedback from D1
2. New feedback → Workers AI analyzes priority & themes
3. Results stored back in D1
4. AI generates summary for PMs
5. UI updates with insights

### Database Schema
```sql
CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  text TEXT NOT NULL,
  priority TEXT,
  themes TEXT,
  status TEXT DEFAULT 'new',
  timestamp TEXT NOT NULL
);
```

## API Endpoints

- `GET /` - Dashboard UI
- `GET /api/feedback` - Fetch all feedback
- `POST /api/analyze` - Trigger AI analysis
- `GET /api/summary` - Get AI-generated summary
- `POST /api/update-status` - Update feedback status

## Key Features Breakdown

### AI Priority Classification
```javascript
// AI analyzes and assigns:
- Urgent: System failures, blocking bugs
- High: Major UX problems, broken features
- Medium: Minor bugs, feature requests
- Low: Nice-to-haves, positive feedback
```

### Theme Extraction
AI identifies patterns like:
- `documentation` - Missing or unclear docs
- `performance` - Speed/latency issues
- `ux` - User interface confusion
- `api` - Integration problems
- `deployment` - CI/CD issues

## Cost Optimization

- Checks for NULL values before calling AI
- 60-second cache on summary endpoint
- No background jobs (only on user visits)
