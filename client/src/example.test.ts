// Example test to demonstrate testing setup
// This file can be removed once real tests are added

describe('Example Test Suite', () => {
  test('should pass basic arithmetic', () => {
    expect(2 + 2).toBe(4);
  });

  test('should handle string operations', () => {
    const message = 'Hello, CodeBros!';
    expect(message).toContain('CodeBros');
    expect(message.length).toBeGreaterThan(0);
  });

  test('should work with arrays', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
    expect(numbers[0]).toBe(1);
  });
}); 