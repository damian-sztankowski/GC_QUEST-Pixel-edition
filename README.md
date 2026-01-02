# Google Cloud Quest: Pixel Escape

A retro-styled educational escape room game designed to help users prepare for the Google Cloud Digital Leader (CDL) certification.

## Architecture

This application uses a Backend-for-Frontend (BFF) architecture to secure the Google Gemini API key.

- **Frontend:** React + Vite (TypeScript)
- **Backend:** Node.js + Express (handles API calls to Gemini)
- **Deployment:** Docker (Cloud Run ready)

## Run Locally

**Prerequisites:** Node.js (v18+)

### 1. Setup Environment
Create a `.env` file in the root directory (or rename `.env.local` if you have one) and add your Gemini API key:

```env
API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
To develop with hot-reloading, you need to run both the backend server (for API endpoints) and the Vite development server.

**Terminal 1 (Backend):**
```bash
node server.js
```
*Note: The backend runs on port 3000.*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*Note: The frontend proxies `/api` requests to `http://localhost:3000`.*

Open your browser at the URL provided by Vite (usually `http://localhost:5173`).

### 4. Run in Production Mode (Simulating Deployment)
This builds the frontend and serves it via the Express server, exactly as it runs in the container.

```bash
npm run build
npm start
```

Open `http://localhost:3000`.

## Docker Deployment

To run the application using Docker:

1. **Build the image:**
   ```bash
   docker build -t pixel-escape .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8080:8080 -e API_KEY=your_api_key pixel-escape
   ```

Open `http://localhost:8080`.
