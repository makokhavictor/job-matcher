// Add any global test setup here
import '@testing-library/jest-dom';

// Mock the NLP manager since we don't need its full functionality in tests
jest.mock('node-nlp', () => ({
  NlpManager: jest.fn().mockImplementation(() => ({
    // Add any specific mocked methods if needed
  })),
}));