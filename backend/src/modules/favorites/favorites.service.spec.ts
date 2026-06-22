import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    favorite: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    listing: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFavorite', () => {
    it('should throw NotFoundException if listing does not exist', async () => {
      mockPrismaService.listing.findUnique.mockResolvedValue(null);

      await expect(service.addFavorite('user-uuid', 'listing-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return existing favorite if already favorited', async () => {
      const mockListing = {
        id: 'listing-uuid',
        images: ['image1.jpg'],
        product: { name: 'Miel de Caldén' },
      };
      const mockFavorite = { id: 'fav-uuid', userId: 'user-uuid', listingId: 'listing-uuid' };

      mockPrismaService.listing.findUnique.mockResolvedValue(mockListing);
      mockPrismaService.favorite.findUnique.mockResolvedValue(mockFavorite);

      const result = await service.addFavorite('user-uuid', 'listing-uuid');

      expect(prisma.listing.findUnique).toHaveBeenCalledWith({
        where: { id: 'listing-uuid' },
        include: { product: true },
      });
      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          userId_listingId: {
            userId: 'user-uuid',
            listingId: 'listing-uuid',
          },
        },
      });
      expect(result).toEqual(mockFavorite);
    });

    it('should create new favorite if not already favorited', async () => {
      const mockListing = {
        id: 'listing-uuid',
        images: ['image1.jpg'],
        product: { name: 'Miel de Caldén', images: [] },
      };
      const mockCreatedFav = {
        id: 'fav-uuid',
        userId: 'user-uuid',
        listingId: 'listing-uuid',
        cachedTitle: 'Miel de Caldén',
        cachedImage: 'image1.jpg',
      };

      mockPrismaService.listing.findUnique.mockResolvedValue(mockListing);
      mockPrismaService.favorite.findUnique.mockResolvedValue(null);
      mockPrismaService.favorite.create.mockResolvedValue(mockCreatedFav);

      const result = await service.addFavorite('user-uuid', 'listing-uuid');

      expect(prisma.favorite.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-uuid',
          listingId: 'listing-uuid',
          cachedTitle: 'Miel de Caldén',
          cachedImage: 'image1.jpg',
        },
      });
      expect(result).toEqual(mockCreatedFav);
    });
  });

  describe('removeFavoriteByListingId', () => {
    it('should throw NotFoundException if favorite does not exist', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue(null);

      await expect(service.removeFavoriteByListingId('user-uuid', 'listing-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete and return favorite if found', async () => {
      const mockFavorite = { id: 'fav-uuid', userId: 'user-uuid', listingId: 'listing-uuid' };

      mockPrismaService.favorite.findUnique.mockResolvedValue(mockFavorite);
      mockPrismaService.favorite.delete.mockResolvedValue(mockFavorite);

      const result = await service.removeFavoriteByListingId('user-uuid', 'listing-uuid');

      expect(prisma.favorite.delete).toHaveBeenCalledWith({
        where: { id: 'fav-uuid' },
      });
      expect(result).toEqual(mockFavorite);
    });
  });

  describe('removeFavoriteById', () => {
    it('should throw NotFoundException if favorite does not exist', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue(null);

      await expect(service.removeFavoriteById('user-uuid', 'fav-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if favorite does not belong to user', async () => {
      const mockFavorite = { id: 'fav-uuid', userId: 'other-user-uuid', listingId: 'listing-uuid' };
      mockPrismaService.favorite.findUnique.mockResolvedValue(mockFavorite);

      await expect(service.removeFavoriteById('user-uuid', 'fav-uuid')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should delete and return favorite if valid', async () => {
      const mockFavorite = { id: 'fav-uuid', userId: 'user-uuid', listingId: 'listing-uuid' };

      mockPrismaService.favorite.findUnique.mockResolvedValue(mockFavorite);
      mockPrismaService.favorite.delete.mockResolvedValue(mockFavorite);

      const result = await service.removeFavoriteById('user-uuid', 'fav-uuid');

      expect(prisma.favorite.delete).toHaveBeenCalledWith({
        where: { id: 'fav-uuid' },
      });
      expect(result).toEqual(mockFavorite);
    });
  });

  describe('getFavorites', () => {
    it('should return favorites query list ordered by desc', async () => {
      const mockFavoritesList = [{ id: 'fav-1' }, { id: 'fav-2' }];
      mockPrismaService.favorite.findMany.mockResolvedValue(mockFavoritesList);

      const result = await service.getFavorites('user-uuid');

      expect(prisma.favorite.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid' },
        include: {
          listing: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
              seller: true,
              currency: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockFavoritesList);
    });
  });

  describe('isFavorite', () => {
    it('should return true if favorite exists', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue({ id: 'fav-uuid' });

      const result = await service.isFavorite('user-uuid', 'listing-uuid');

      expect(result).toBe(true);
    });

    it('should return false if favorite does not exist', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue(null);

      const result = await service.isFavorite('user-uuid', 'listing-uuid');

      expect(result).toBe(false);
    });
  });
});
