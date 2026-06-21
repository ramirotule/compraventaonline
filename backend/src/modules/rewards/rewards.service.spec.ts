import { Test, TestingModule } from '@nestjs/testing';
import { RewardsService } from './rewards.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RewardType, FeaturedPlan, SellerType, SellerTier, Condition, ListingStatus } from '@prisma/client';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

describe('RewardsService', () => {
  let service: RewardsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    seller: {
      findUnique: jest.fn(),
    },
    sellerReward: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    listing: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    highlightedProduct: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('grantReward', () => {
    it('should create a reward with expiresAt in 30 days by default', async () => {
      const sellerId = 'seller-uuid';
      const type = RewardType.FREE_FEATURED_HIGHLIGHT;

      mockPrismaService.sellerReward.create.mockResolvedValue({
        id: 'reward-uuid',
        sellerId,
        type,
        claimed: false,
      });

      const result = await service.grantReward(sellerId, type);

      expect(prisma.sellerReward.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            sellerId,
            type,
            claimed: false,
            expiresAt: expect.any(Date),
          }),
        }),
      );
      expect(result.claimed).toBe(false);
    });
  });

  describe('getSellerRewards', () => {
    it('should throw NotFoundException if seller does not exist', async () => {
      mockPrismaService.seller.findUnique.mockResolvedValue(null);

      await expect(service.getSellerRewards('user-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return rewards list for the seller', async () => {
      const mockSeller = { id: 'seller-uuid', userId: 'user-uuid' };
      const mockRewards = [{ id: 'reward-1' }, { id: 'reward-2' }];

      mockPrismaService.seller.findUnique.mockResolvedValue(mockSeller);
      mockPrismaService.sellerReward.findMany.mockResolvedValue(mockRewards);

      const result = await service.getSellerRewards('user-uuid');

      expect(prisma.seller.findUnique).toHaveBeenCalledWith({ where: { userId: 'user-uuid' } });
      expect(prisma.sellerReward.findMany).toHaveBeenCalledWith({
        where: { sellerId: 'seller-uuid' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockRewards);
    });
  });

  describe('claimHighlightReward', () => {
    it('should throw NotFoundException if seller does not exist', async () => {
      mockPrismaService.seller.findUnique.mockResolvedValue(null);

      await expect(
        service.claimHighlightReward('user-uuid', 'reward-uuid', 'listing-uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if reward does not exist or belong to seller', async () => {
      mockPrismaService.seller.findUnique.mockResolvedValue({ id: 'seller-uuid' });
      mockPrismaService.sellerReward.findFirst.mockResolvedValue(null);

      await expect(
        service.claimHighlightReward('user-uuid', 'reward-uuid', 'listing-uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if reward is already claimed', async () => {
      mockPrismaService.seller.findUnique.mockResolvedValue({ id: 'seller-uuid' });
      mockPrismaService.sellerReward.findFirst.mockResolvedValue({
        id: 'reward-uuid',
        claimed: true,
        expiresAt: new Date(Date.now() + 100000),
      });

      await expect(
        service.claimHighlightReward('user-uuid', 'reward-uuid', 'listing-uuid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if reward has expired', async () => {
      mockPrismaService.seller.findUnique.mockResolvedValue({ id: 'seller-uuid' });
      mockPrismaService.sellerReward.findFirst.mockResolvedValue({
        id: 'reward-uuid',
        claimed: false,
        expiresAt: new Date(Date.now() - 100000),
      });

      await expect(
        service.claimHighlightReward('user-uuid', 'reward-uuid', 'listing-uuid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if listing belongs to another seller', async () => {
      mockPrismaService.seller.findUnique.mockResolvedValue({ id: 'seller-uuid' });
      mockPrismaService.sellerReward.findFirst.mockResolvedValue({
        id: 'reward-uuid',
        claimed: false,
        type: RewardType.FREE_FEATURED_HIGHLIGHT,
        expiresAt: new Date(Date.now() + 100000),
      });
      mockPrismaService.listing.findUnique.mockResolvedValue({
        id: 'listing-uuid',
        sellerId: 'other-seller-uuid',
      });

      await expect(
        service.claimHighlightReward('user-uuid', 'reward-uuid', 'listing-uuid'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should successfully claim reward, mark it claimed, create highlight, and update listing plan', async () => {
      const sellerId = 'seller-uuid';
      const rewardId = 'reward-uuid';
      const listingId = 'listing-uuid';

      mockPrismaService.seller.findUnique.mockResolvedValue({ id: sellerId });
      mockPrismaService.sellerReward.findFirst.mockResolvedValue({
        id: rewardId,
        claimed: false,
        type: RewardType.FREE_FEATURED_HIGHLIGHT,
        expiresAt: new Date(Date.now() + 100000),
      });
      mockPrismaService.listing.findUnique.mockResolvedValue({
        id: listingId,
        sellerId: sellerId,
      });

      mockPrismaService.sellerReward.update.mockResolvedValue({
        id: rewardId,
        claimed: true,
      });
      mockPrismaService.highlightedProduct.create.mockResolvedValue({
        id: 'highlight-uuid',
        listingId,
        plan: FeaturedPlan.FEATURED,
      });

      const result = await service.claimHighlightReward('user-uuid', rewardId, listingId);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.sellerReward.update).toHaveBeenCalledWith({
        where: { id: rewardId },
        data: expect.objectContaining({
          claimed: true,
          claimedAt: expect.any(Date),
        }),
      });
      expect(prisma.highlightedProduct.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          listingId,
          plan: FeaturedPlan.FEATURED,
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        }),
      });
      expect(prisma.listing.update).toHaveBeenCalledWith({
        where: { id: listingId },
        data: { featuredPlan: FeaturedPlan.FEATURED },
      });

      expect(result.reward.claimed).toBe(true);
      expect(result.highlight.plan).toBe(FeaturedPlan.FEATURED);
    });
  });
});
