import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams, formatResponse } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Get user info by target user ID
 * POST /getGJUserInfo20.php
 * 
 * Parameters:
 * - targetAccountID: Target account ID to get info for
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function getGJUserInfo20(req: Request, res: Response) {
  try {
    const { targetAccountID, secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['targetAccountID'])) {
      return res.send(ERROR_GENERIC);
    }

    // Find account
    const account = await prisma.account.findFirst({
      where: { accountID: parseInt(targetAccountID) },
    });

    if (!account) {
      return res.send(ERROR_GENERIC);
    }

    // Find user
    const user = await prisma.users.findFirst({
      where: { extID: account.accountID.toString() },
    });

    if (!user) {
      return res.send(ERROR_GENERIC);
    }

    // Count creator points from levels
    const creatorPoints = user.creatorPoints || 0;

    // Format response
    const response = formatResponse({
      1: user.userName,
      2: user.userID,
      3: user.stars,
      4: user.demons,
      6: '0', // Ranking (not implemented)
      7: user.extID,
      8: creatorPoints,
      9: user.icon,
      10: user.color1,
      11: user.color2,
      12: user.coins,
      13: user.iconType,
      14: '0', // Glow outline
      15: '0', // Account highlight
      16: user.userID,
      17: user.userCoins,
      18: '0', // Message state
      19: '0', // Friend request state
      20: account.youtubeurl || '',
      21: user.accIcon,
      22: user.accShip,
      23: user.accBall,
      24: user.accBird,
      25: user.accDart,
      26: user.accRobot,
      27: user.accGlow,
      28: '0', // Registered
      29: '0', // Global rank
      30: user.diamonds,
      31: '0', // Death effect
      38: '0', // Messages
      39: '0', // Friend requests
      40: '0', // Friends count
      41: '0', // New friends
      42: '0', // New friend requests
      43: '0', // New messages
      44: account.twitter || '',
      45: account.twitch || '',
      46: user.diamonds,
      48: user.accSpider || 0,
      49: account.twitter || '',
      50: account.twitch || '',
      51: user.accExplosion || 0,
      52: account.frS,
      53: account.mS,
      54: account.cS,
    });

    return res.send(response);
  } catch (error) {
    console.error('Error in getGJUserInfo20:', error);
    return res.send(ERROR_GENERIC);
  }
}
