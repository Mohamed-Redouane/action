import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';           
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import pool from './config/db.js'

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); 

pool.connect((err,client, release) => {
    if (err) {
      console.error('Database connection failed:', err.stack);
    } else {
      console.log('Database connected successfully');
    }
    release(); 
  });
// routes
app.use('/api', routes); 

app.get('/', (req, res) => {
  res.send('Hello Asymptotes');
});

app.use(errorMiddleware);

export default app;
