/// <reference types="vitest" />

import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';

process.env.PORT = '4000';

const listenMock = vi.fn((port: string | number, callback: () => void) => {
  callback();
});


vi.mock('../app.js', () => {
  return {
    default: {
      listen: listenMock,
    },
  };
});

const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('Server bootstrap', () => {
  beforeAll(async () => {
  
    await import('../server.mjs');
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test('should call app.listen with the correct port and log the expected message', () => {
    expect(listenMock).toHaveBeenCalledWith('4000', expect.any(Function));
    expect(consoleLogSpy).toHaveBeenCalledWith('Server is running on port 4000');
  });
});
