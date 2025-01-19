describe('Sample Test', () => {
    it('should pass a simple test', () => {
      expect(1 + 1).toBe(2);
    });
  
    it('should handle asynchronous code', async () => {
      const asyncFunction = async () => {
        return 'Hello, Jest!';
      };
  
      const result = await asyncFunction();
      expect(result).toBe('Hello, Jest!');
    });
  });
  