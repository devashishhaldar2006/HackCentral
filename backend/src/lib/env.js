import dotenv from 'dotenv';
dotenv.config();

export const ENV={
    MONGO_DB_URI: process.env.MONGO_DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT
}