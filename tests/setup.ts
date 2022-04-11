import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from '../src/config/database-client';

jest.mock('../src/config/database-client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMockClient);
});

export const prismaMockClient = prisma as unknown as DeepMockProxy<PrismaClient>;
