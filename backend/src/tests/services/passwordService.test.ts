import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyPasswordNotPwned } from "../../services/passwordService.js";
import { sha1 } from "@oslojs/crypto/sha1";
import { encodeHexLowerCase } from "@oslojs/encoding";

global.fetch = vi.fn();

describe("Password Utility Functions - verifyPasswordNotPwned", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true for a non-pwned password", async () => {
    const password = "SecurePassword123!";
    const hashVal = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
    const hashPrefix = hashVal.slice(0, 5);

    (fetch as any).mockResolvedValueOnce({
      text: vi.fn().mockResolvedValueOnce(""),
    });

    const isSafe = await verifyPasswordNotPwned(password);

    expect(isSafe).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.pwnedpasswords.com/range/${hashPrefix}`
    );
  });

  it("should return false for a pwned password", async () => {
    const password = "PwnedPassword123!";
    const hashVal = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
    const hashPrefix = hashVal.slice(0, 5);
    const hashSuffix = hashVal.slice(5).toUpperCase(); 
    const mockResponse = `${hashSuffix}:100`; 
  

    (fetch as any).mockResolvedValueOnce({
      text: vi.fn().mockResolvedValueOnce(mockResponse),
    });
  
    const isSafe = await verifyPasswordNotPwned(password);
  
    expect(isSafe).toBe(false); 
    expect(fetch).toHaveBeenCalledWith(
      `https://api.pwnedpasswords.com/range/${hashPrefix}`
    );
  });
  
  it("should return false for invalid password length", async () => {
    const shortPassword = "short";
    const longPassword = "a".repeat(256);

    expect(await verifyPasswordNotPwned(shortPassword)).toBe(false);
    expect(await verifyPasswordNotPwned(longPassword)).toBe(false);
  });
});
