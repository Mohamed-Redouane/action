import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';           
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import pool from './config/db.js';
import { sessionCookieMiddleware } from "./middlewares/sessionMiddleware.js";
import cookieParser from "cookie-parser";
import path from 'path';

const app: Application = express();

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// CORS Configuration
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(sessionCookieMiddleware);

// Connect to Database
pool.connect((err, client, release) => {
    if (err) {
      console.error('Database connection failed:', err.stack);
    } else {
      console.log('Database connected successfully');
    }
    release();
});

// API Routes
app.use('/api', routes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== Serve Frontend ====================
// Serve static frontend files
const frontendPath = path.join(__dirname, 'public');
app.use(express.static(frontendPath));

// Catch-all route to serve React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error Middleware
app.use(errorMiddleware);

export default app;
