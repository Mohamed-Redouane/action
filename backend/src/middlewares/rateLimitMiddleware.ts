import rateLimit from "express-rate-limit";


export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10,                   
  message: {
    error: "Too many login attempts. Please try again in 10 minutes."
  },
  standardHeaders: true,    
  legacyHeaders: false      
});


export const registerRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5,
  message: {
    error: "Too many registration attempts. Please try again in 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});


export const passwordResetRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: 3,
  message: {
    error: "Too many password reset requests. Please try again in 30 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});


