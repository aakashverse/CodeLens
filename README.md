# 🔍 CodeLens

> A RAG (Retrieval-Augmented Generation) powered code intelligence platform that analyzes GitHub repositories using Generative AI, enabling developers to understand, explore, and query large codebases through natural language.

<p align="center">
  <a href="https://code-lens-tau.vercel.app"><strong>Live Demo</strong></a>
</p>

---

## ✨ Features

- 🤖 Repository Chat – Ask questions about any GitHub repository and receive context-aware answers using a RAG pipeline.
- 🏗️ IArchitecture Visualization – Generates interactive architecture diagrams using Mermaid.js.
- 🔍 Code Smell Detection – Identifies potential maintainability, performance, and security issues to improve code quality.
- 🔀 PRLens – Simplifies Pull Request reviews with AI-generated summaries, change explanations, and review-focused insights.
- 💥Blast Radius Analysis – Predicts the files, modules, and components that may be affected by a PR before merging.
- 📄README Generator – Automatically generates structured and comprehensive README files based on the repository's codebase.
- 🔐 Secure API Key Management – Encrypts user Gemini API keys using AES-256-CBC (Node.js Crypto) before storing them in the database.
- 🐳 Containerized Deployment – Dockerized the backend and deployed it on Render, ensuring a consistent development and production environment.

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 19, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | LangChain, Google GenAI, RAG |
| Deployment | Docker, Render, Vercel |

---

## ⚙️ Setup

### Prerequisites

- Node.js 22+
- Docker Desktop
- Google AI (Gemini) API Key

### Installation

```bash
git clone https://github.com/aakashverse/CodeLens.git
cd CodeLens
```

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

### Run the backend

Using Docker:

```bash
docker compose up --build
```

Or locally:

```bash
cd server
npm run dev
```

### Run the frontend

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 🔐 Security

- JWT authentication
- HttpOnly cookies with Authorization header fallback
- AES-256-CBC encryption for user API keys
- Environment-based configuration

## Author
Akash Yadav
