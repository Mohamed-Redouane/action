/// <reference types="vitest" />

import { describe, expect, test } from 'vitest';
import { verifyEmailInput } from '../../utils/emailValidation.js'; 

describe('verifyEmailInput', () => {
  test('returns true for a valid email', () => {
    const email = 'test@example.com';
    expect(verifyEmailInput(email)).toBe(true);
  });

  test('returns false for an email missing "@"', () => {
    const email = 'testexample.com';
    expect(verifyEmailInput(email)).toBe(false);
  });

  test('returns false for an email missing the dot in the domain', () => {
    const email = 'test@examplecom';
    expect(verifyEmailInput(email)).toBe(false);
  });

  test('returns false for an email with length 256', () => {
   
    const localPart = 'a'.repeat(250);
    const email = `${localPart}@ex.co`;
    expect(email.length).toBe(256);
    expect(verifyEmailInput(email)).toBe(false);
  });

  test('returns true for an email with length 255', () => {
   
    const localPart = 'a'.repeat(249);
    const email = `${localPart}@ex.co`;
    expect(email.length).toBe(255);
    expect(verifyEmailInput(email)).toBe(true);
  });
});
