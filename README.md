# HR Aura: AI Workforce Operating System

HR Aura is an enterprise HR SaaS platform centered on AI workflow orchestration, Make.com automation, Supabase realtime updates, and blockchain-style verification logs.

## Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally, on Atlas, or in Docker
- Supabase project credentials
- Make.com custom webhook URL
- OpenAI API key

Required backend environment:

```env
MONGO_URI=mongodb://localhost:27017/hraura
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
MAKE_WEBHOOK_URL=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-codex
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- **AI Copilot**: Conversational automation router for HR operations.
- **Leave Automation**: Leave balance checks, AI approval summaries, manager approvals, Make.com triggers, verification logs.
- **Onboarding Automation**: AI checklists, onboarding tasks, welcome summaries, employee setup progress, verification logs.
- **Payroll Automation**: Salary, attendance, and leave analysis; payroll records; HR approvals; Make.com triggers; verification logs.
- **Realtime Workflow State**: Supabase mirrors workflow status, events, approvals, payroll records, leave requests, onboarding tasks, and trust logs.

## Automation APIs

```text
POST /api/ai/command
POST /api/ai/automations/payroll/run
POST /api/ai/automations/onboarding/start
POST /api/leaves/request
POST /api/ai/webhooks/make
```

---

"Empowering the workforce with Aura."
