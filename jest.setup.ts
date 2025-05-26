import '@testing-library/jest-dom';

// Mock Next.js route hooks and segments
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '',
}));

// Reset all mocks automatically between tests
beforeEach(() => {
  jest.clearAllMocks();
});
