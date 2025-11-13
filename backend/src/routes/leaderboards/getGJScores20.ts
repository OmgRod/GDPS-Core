import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, formatResponse, formatListResponse } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Get leaderboard scores
 * POST /getGJScores20.php
 * 
 * Parameters:
 * - type: Leaderboard type (top=global, creators=creator points, relative=around you)
 * - accountID: Account ID (for relative leaderboard)
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function getGJScores20(req: Request, res: Response) {
  try {
    const { type = 'top', accountID, secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    const pageSize = 100;
    let users;

    if (type === 'creators') {
      // Creator points leaderboard
      users = await prisma.users.findMany({
        where: {
          creatorPoints: { gt: 0 },
          isBanned: 0,
        },
        orderBy: { creatorPoints: 'desc' },
        take: pageSize,
      });
    } else if (type === 'relative' && accountID) {
      // Get user's position and users around them
      const user = await prisma.users.findFirst({
        where: { extID: accountID.toString() },
      });

      if (!user) {
        return res.send(ERROR_GENERIC);
      }

      // Get users with similar star counts
      users = await prisma.users.findMany({
        where: {
          isBanned: 0,
        },
        orderBy: { stars: 'desc' },
        take: pageSize,
      });
    } else {
      // Global leaderboard (top players by stars)
      users = await prisma.users.findMany({
        where: {
          isBanned: 0,
        },
        orderBy: { stars: 'desc' },
        take: pageSize,
      });
    }

    if (users.length === 0) {
      return res.send(ERROR_GENERIC);
    }

    // Get accounts for all users
    const extIDs = users.map((u) => u.extID);
    const accounts = await prisma.account.findMany({
      where: { accountID: { in: extIDs.map((id) => parseInt(id)) } },
    });

    const accountMap = new Map(accounts.map((a) => [a.accountID.toString(), a]));

    // Format user responses
    const userStrings = users.map((user, index) => {
      const account = accountMap.get(user.extID);
      const sortValue = type === 'creators' ? user.creatorPoints : user.stars;

      return formatResponse({
        1: user.userName,
        2: user.userID,
        3: sortValue,
        4: user.demons,
        6: index + 1, // Rank
        7: user.extID,
        8: type === 'creators' ? user.creatorPoints : 0,
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
        49: account?.twitter || '',
        50: account?.twitch || '',
      });
    });

    const response = formatListResponse(userStrings, '', '|', '#');

    return res.send(response);
  } catch (error) {
    console.error('Error in getGJScores20:', error);
    return res.send(ERROR_GENERIC);
  }
}
