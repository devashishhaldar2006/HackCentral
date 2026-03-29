import dotenv from 'dotenv';
dotenv.config();

export const ENV={
    MONGO_DB_URI: process.env.MONGO_DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
    NODE_ENV: process.env.NODE_ENV || 'development'
}