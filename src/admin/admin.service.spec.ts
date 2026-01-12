/**
 * Admin Service Unit Tests
 * @author Arman Hazrati
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminService', () => {
  let service: AdminService;

  const mockAuditLog = {
    id: '1',
    userId: 'user-1',
    action: 'LOGIN',
    resource: 'AUTH',
    resourceId: null,
    metadata: null,
    ipAddress: '127.0.0.1',
    userAgent: 'Jest Test',
    createdAt: new Date(),
    user: {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
  };

  const mockPrismaService = {
    auditLog: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs', async () => {
      const logs = [mockAuditLog];
      mockPrismaService.auditLog.findMany.mockResolvedValue(logs);
      mockPrismaService.auditLog.count.mockResolvedValue(1);

      const result = await service.getAuditLogs({
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({ data: logs, total: 1 });
    });

    it('should filter audit logs by userId', async () => {
      mockPrismaService.auditLog.findMany.mockResolvedValue([mockAuditLog]);
      mockPrismaService.auditLog.count.mockResolvedValue(1);

      await service.getAuditLogs({
        userId: 'user-1',
        skip: 0,
        take: 10,
      });

      expect(mockPrismaService.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
        }),
      );
    });

    it('should filter audit logs by resource and action', async () => {
      mockPrismaService.auditLog.findMany.mockResolvedValue([mockAuditLog]);
      mockPrismaService.auditLog.count.mockResolvedValue(1);

      await service.getAuditLogs({
        resource: 'AUTH',
        action: 'LOGIN',
        skip: 0,
        take: 10,
      });

      expect(mockPrismaService.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { resource: 'AUTH', action: 'LOGIN' },
        }),
      );
    });
  });
});
