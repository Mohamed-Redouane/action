import 'dotenv/config'; 
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import pool from './config/db.js';
import { sessionCookieMiddleware } from './middlewares/sessionMiddleware.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// 1) Build array of allowed origins
const allowedOrigins: string[] = [
  'http://localhost:5173',  // Local dev
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL); // Production URL from .env
}

// 2) Use array in CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(sessionCookieMiddleware);

// Database connection
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

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the React frontend directly from __dirname
app.use(express.static(__dirname));

// Catch-all route => serve index.html for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      res.status(500).send('Error loading frontend');
    }
  });
});

// Error Handling
app.use(errorMiddleware);

export default app;
