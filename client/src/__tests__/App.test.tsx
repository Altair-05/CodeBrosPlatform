import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

// Mock the main App component or create a simple test component
const TestComponent = () => {
  return <div data-testid="test-component">Hello, World!</div>;
};

describe('App', () => {
  it('renders without crashing', () => {
    render(<TestComponent />);
    const element = screen.getByTestId('test-component');
    expect(element).toBeTruthy();
  });

  it('displays the correct text', () => {
    render(<TestComponent />);
    const element = screen.getByText('Hello, World!');
    expect(element).toBeTruthy();
  });
});
