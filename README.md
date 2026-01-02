<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1XRmUffOuQEDw6Xxwq5mD0kqJZQclAP9S

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `API_KEY` (Gemini API Key) and `HANDSHAKE_SECRET` in your environment.
   *(See `backend_api.js` for required variables)*.
3. Run the backend:
   `npm run start-backend`
4. Run the frontend (in a separate terminal):
   `npm run dev`

## Deployment

For detailed instructions on deploying to Google Cloud Run, please see [DEPLOYMENT.md](DEPLOYMENT.md).
