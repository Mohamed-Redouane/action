import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  err: any,                       
  req: Request,                   
  res: Response,                  
  next: NextFunction             
) {
  console.error('Error occurred:', err.message); 

  const status = err.status || 500;             
  const message = err.message || 'Something went wrong';

  res.status(status).json({                     
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
