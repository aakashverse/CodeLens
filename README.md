# 🔍 CodeLens

> A collaborative platform designed to analyze GitHub repositories using Generative AI, allowing developers to query repository structures and logic through a natural language interface.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

---

## Problem Context
Standard documentation for large repositories is often outdated or difficult to parse. CodeLens addresses this by creating an indexed knowledge base of a repository, allowing developers to ask context-aware questions about codebases without manually reading through thousands of files.

---

## Key Features
- **Repository Connection:** Securely fetch and parse GitHub repository structures with the help of vector embeddings.
- **CodeLens AI:** Chat with your repository using an integrated LLM to find the exact context in a messy codebase.
- **Auto-Readme Generator:** Uses the same repository context to automatically generate a comprehensive README file for your project.
- **Architecture Viewer:** Visualize the complex architecture of your system.
- **Code Smell Detector:** Judge the code based on performance, efficiency, and security to analyze and prevent bottlenecks.
- **PRLens Analyzer:** Understand and analyze Pull Requests to streamline the review process.
- **Blast Radius:** Prevent bottlenecks before merging by finding the exact affected areas of a Pull Request.
- **User Auth:** JWT-based session management using HttpOnly cookies with Header fallback.

---

## Technical Architecture
The application follows a standard MERN stack architecture with a separate containerized backend to handle the compute-heavy tasks of repository parsing and LLM communication.

* **Frontend:** React 19 (Vite), Tailwind CSS, Axios
* **Backend:** Node.js, Express, MongoDB (Mongoose)
* **AI Integration:** LangChain, Google GenAI
* **Infrastructure:** Docker Compose (local dev), Render (Backend/Docker), Vercel (Frontend)

---

## Quick Start

### 1. Prerequisites
Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v22+)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Setup
Clone the repository and set up your environment variables:

```bash
git clone [https://github.com/aakashverse/CodeLens.git](https://github.com/aakashverse/CodeLens.git)
cd codelens

# Copy environment templates
cp server/.env.example server/.env
cp client/.env.example client/.env