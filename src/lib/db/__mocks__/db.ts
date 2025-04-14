// Mock PrismaClient for testing
export const prismaMock = {
  document: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  analysisResult: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));