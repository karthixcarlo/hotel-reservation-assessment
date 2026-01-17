# Deployment Guide: SmartStay System

Follow this "Golden Path" to deploy your application.

## Prerequisites
*   GitHub Account
*   Render Account (Linked to GitHub)
*   Vercel Account (Linked to GitHub)

## Step 1: Push to GitHub
1.  Initialize git in your project root (if not already done):
    ```bash
    git init
    git add .
    git commit -m "Ready for deployment"
    ```
2.  Create a new repository on GitHub (e.g., `smartstay-system`).
3.  Push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/smartstay-system.git
    git push -u origin main
    ```

## Step 2: Deploy Backend (Render)
1.  Go to **dashboard.render.com** -> **New** -> **Web Service**.
2.  Connect your `smartstay-system` repository.
3.  **Important**: Configure the following settings:
    *   **Root Directory**: `backend` (This is crucial!)
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4.  Click **Create Web Service**.
5.  Wait for deployment. Copy your backend URL (e.g., `https://smartstay-backend.onrender.com`).

## Step 3: Deploy Frontend (Vercel)
1.  Go to **vercel.com** -> **Add New** -> **Project**.
2.  Import your `smartstay-system` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    *   Add a new variable:
        *   **Name**: `VITE_API_URL`
        *   **Value**: (Paste your Render Backend URL here, e.g., `https://smartstay-backend.onrender.com`)
5.  Click **Deploy**.

## verification
Once Vercel finishes, click the domain they provide.
1.  You should see the "SmartStay System" operational.
2.  Try running the "Recruiter Scenarios" to confirm everything behaves as expected in production.
