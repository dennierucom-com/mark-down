import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './msw.node';

// 1. Establish MSW API mocking
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 2. Mock Cache Storage API for PWA testing
const mockCache = {
  put: vi.fn(),
  match: vi.fn(),
  delete: vi.fn(),
  keys: vi.fn(),
};

const mockCaches = {
  open: vi.fn().mockResolvedValue(mockCache),
  has: vi.fn(),
  delete: vi.fn(),
  keys: vi.fn(),
};

vi.stubGlobal('caches', mockCaches);

// Prevent window/document errors in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
