# Deployment Guide: Google Cloud Run

This application is designed as a decoupled architecture with two separate services:
1.  **Secure AI Backend**: A Node.js/Express service that manages Google Gemini API calls.
2.  **Pixel Static Frontend**: A React/Vite application served via a lightweight Node.js host.

## Prerequisites

-   Google Cloud Platform (GCP) Project.
-   [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed and authenticated.
-   Google Gemini API Key.

## 1. Environment Setup

Define your project ID and region:
```bash
export PROJECT_ID="your-project-id"
export REGION="us-central1"
export API_KEY="your-gemini-api-key"
export HANDSHAKE_SECRET="your-secure-random-secret"

gcloud config set project $PROJECT_ID
```

## 2. Deploy Backend Service

The backend must be deployed first because the frontend needs the backend's URL during its build process.

1.  **Build and Submit Backend Image**:
    ```bash
    gcloud builds submit . --config=cloudbuild.backend.yaml \
      --substitutions=_IMAGE_NAME=pixel-backend

    # OR manual Docker build/push
    docker build -f Dockerfile.backend -t gcr.io/$PROJECT_ID/pixel-backend .
    docker push gcr.io/$PROJECT_ID/pixel-backend
    ```

2.  **Deploy to Cloud Run**:
    ```bash
    gcloud run deploy pixel-backend \
      --image gcr.io/$PROJECT_ID/pixel-backend \
      --platform managed \
      --region $REGION \
      --allow-unauthenticated \
      --set-env-vars API_KEY=$API_KEY,HANDSHAKE_SECRET=$HANDSHAKE_SECRET
    ```

3.  **Retrieve Backend URL**:
    Capture the URL from the output (e.g., `https://pixel-backend-xyz.a.run.app`).
    ```bash
    export BACKEND_URL="https://pixel-backend-xyz.a.run.app"
    ```

## 3. Deploy Frontend Service

The frontend requires the `BACKEND_URL` at build time to bake it into the static assets.

1.  **Build and Submit Frontend Image**:
    *Note: We pass build arguments so Vite can substitute env vars.*

    ```bash
    # Manual Docker build/push
    docker build -f Dockerfile.frontend \
      --build-arg VITE_BACKEND_URL=$BACKEND_URL \
      --build-arg VITE_HANDSHAKE_SECRET=$HANDSHAKE_SECRET \
      -t gcr.io/$PROJECT_ID/pixel-frontend .

    docker push gcr.io/$PROJECT_ID/pixel-frontend
    ```

2.  **Deploy to Cloud Run**:
    ```bash
    gcloud run deploy pixel-frontend \
      --image gcr.io/$PROJECT_ID/pixel-frontend \
      --platform managed \
      --region $REGION \
      --allow-unauthenticated
    ```

3.  **Access the App**:
    Open the URL provided by the frontend deployment (e.g., `https://pixel-frontend-xyz.a.run.app`).

4.  **Finalize Backend Configuration (CORS)**:
    Now that you have the Frontend URL, update the Backend service to allow requests from it (CORS).

    ```bash
    export FRONTEND_URL="https://pixel-frontend-xyz.a.run.app"

    gcloud run services update pixel-backend \
      --region $REGION \
      --update-env-vars FRONTEND_URL=$FRONTEND_URL
    ```

## Security Notes

-   **Handshake Secret**: This secret ensures that your backend only processes requests that originate from your specific frontend logic (though client-side secrets are not bulletproof, they prevent trivial direct API access). Ensure both `HANDSHAKE_SECRET` variables match.
-   **CORS**: The backend is configured to allow specific origins. In a production environment, you may want to update `backend_api.js` to strictly allow only your frontend's Cloud Run URL if the dynamic check is insufficient.
