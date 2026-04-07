# Deploying ScanWise to Vercel

Your ScanWise application is now configured for a seamless fullstack deployment on Vercel.

### 1. Preparation
I have already:
- Created `vercel.json` for fullstack routing.
- Enabled high memory (1GB) and long duration (300s) for OCR serverless functions.
- Converted all frontend API calls to **relative paths** (e.g., `/api/analyze`).
- Made `server/server.js` serverless-compatible.

### 2. Deployment Steps
1.  **Push your code** to GitHub/GitLab/Bitbucket.
2.  **Import the project** into [Vercel](https://vercel.com/new).
3.  **Configure Environment Variables** in the Vercel Dashboard:
    - `GROQ_API_KEY`: Your Groq API key (Required).
    - `MONGO_URI`: Your MongoDB connection string (Optional).
4.  **Click Deploy.**

### 3. Note on Deprecation Warnings
The `npm` warnings about `multer` and `glob` are common and usually non-blocking for deployment. They are related to the base packages used in many Node.js templates. Your app is configured to use the LTS versions which are stable for your current implementation.

### 4. Running Locally
You can still run the app locally using:
- **Backend**: `node server/server.js`
- **Frontend**: `npm run dev`
