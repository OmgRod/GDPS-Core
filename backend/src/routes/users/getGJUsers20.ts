import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams, formatResponse, formatListResponse } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Search for users
 * POST /getGJUsers20.php
 * 
 * Parameters:
 * - str: Search string (username)
 * - page: Page number (0-indexed)
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function getGJUsers20(req: Request, res: Response) {
  try {
    const { str, page = '0', secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['str'])) {
      return res.send(ERROR_GENERIC);
    }

    const pageNum = parseInt(page);
    const pageSize = 10;
    const offset = pageNum * pageSize;

    // Search for users
    const users = await prisma.users.findMany({
      where: {
        userName: {
          contains: str,
        },
        isBanned: 0,
      },
      orderBy: { stars: 'desc' },
      skip: offset,
      take: pageSize,
    });

    if (users.length === 0) {
      return res.send(ERROR_GENERIC);
    }

    // Get total count
    const totalCount = await prisma.users.count({
      where: {
        userName: {
          contains: str,
        },
        isBanned: 0,
      },
    });

    // Get accounts for all users
    const extIDs = users.map((u) => u.extID);
    const accounts = await prisma.account.findMany({
      where: { accountID: { in: extIDs.map((id) => parseInt(id)) } },
    });

    const accountMap = new Map(accounts.map((a) => [a.accountID.toString(), a]));

    // Format user responses
    const userStrings = users.map((user) => {
      const account = accountMap.get(user.extID);

      return formatResponse({
        1: user.userName,
        2: user.userID,
        3: user.stars,
        4: user.demons,
        6: '0', // Ranking
        7: user.extID,
        8: user.creatorPoints,
        9: user.icon,
        10: user.color1,
        11: user.color2,
        12: user.coins,
        13: user.iconType,
        14: user.accGlow,
        15: '0', // Account highlight
        16: user.userID,
        17: user.userCoins,
        18: '0', // Message state
        19: '0', // Friend request state
        20: account?.youtubeurl || '',
        21: user.accIcon,
        22: user.accShip,
        23: user.accBall,
        24: user.accBird,
        25: user.accDart,
        26: user.accRobot,
        27: user.accGlow,
        28: '0', // Registered
        30: user.diamonds,
        42: user.accExplosion || 0,
        43: '0', // Mod level
        46: user.diamonds,
        48: user.accSpider || 0,
      });
    });

    const response = formatListResponse(userStrings, `${totalCount}:${offset}:${pageSize}`, '|', '#');

    return res.send(response);
  } catch (error) {
    console.error('Error in getGJUsers20:', error);
    return res.send(ERROR_GENERIC);
  }
}
