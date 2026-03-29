import admin from "firebase-admin";
import { ENV } from "./env.js";

// Initialize Firebase Admin SDK using environment variables
// This avoids storing the service account JSON in the codebase
const serviceAccount = {
  type: "service_account",
  project_id: ENV.FIREBASE_PROJECT_ID,
  private_key_id: ENV.FIREBASE_PRIVATE_KEY_ID,
  private_key: ENV.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: ENV.FIREBASE_CLIENT_EMAIL,
  client_id: ENV.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
