import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, formatResponse, formatListResponse } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Get map packs
 * POST /getGJMapPacks21.php
 * 
 * Parameters:
 * - page: Page number (0-indexed)
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function getGJMapPacks21(req: Request, res: Response) {
  try {
    const { page = '0', secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    const pageNum = parseInt(page);
    const pageSize = 10;
    const offset = pageNum * pageSize;

    // Get map packs
    const mapPacks = await prisma.mapPacks.findMany({
      orderBy: { ID: 'asc' },
      skip: offset,
      take: pageSize,
    });

    if (mapPacks.length === 0) {
      return res.send(ERROR_GENERIC);
    }

    // Get total count
    const totalCount = await prisma.mapPacks.count();

    // Format map pack responses
    const packStrings = mapPacks.map((pack) => {
      return formatResponse({
        1: pack.ID,
        2: pack.name,
        3: pack.levels,
        4: pack.stars,
        5: pack.coins,
        6: pack.difficulty,
        7: pack.rgbcolors,
        8: pack.colors2,
      });
    });

    const response = formatListResponse(packStrings, `${totalCount}:${offset}:${pageSize}`, '|', '#');

    return res.send(response);
  } catch (error) {
    console.error('Error in getGJMapPacks21:', error);
    return res.send(ERROR_GENERIC);
  }
}
