/// <reference types="vitest" />

import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';

import pool from '../config/db.js';

let app: any; 

beforeAll(async () => {

    vi.spyOn(pool, "connect").mockImplementation((callback: (err: any, client: any, release: () => void) => void) => {

        callback(null, {}, () => {});
  });

  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  
  const appModule = await import('../app.js');
  app = appModule.default;

  expect(consoleLogSpy).toHaveBeenCalledWith('Database connected successfully');

  consoleLogSpy.mockRestore();
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('Express App', () => {
  it('should return health status on GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('should return "Hello Asymptotes" on GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello Asymptotes');
  });
});
