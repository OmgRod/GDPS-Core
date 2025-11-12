import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams, formatResponse, getIP } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Download a level
 * POST /downloadGJLevel22.php
 * 
 * Parameters:
 * - levelID: Level ID to download
 * - secret: Game secret (should be "Wmfd2893gb7")
 * - inc: Increment download count (1 or 0)
 */
export async function downloadGJLevel22(req: Request, res: Response) {
  try {
    const { levelID, secret, inc } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['levelID'])) {
      return res.send(ERROR_GENERIC);
    }

    // Find level
    const level = await prisma.levels.findFirst({
      where: {
        levelID: parseInt(levelID),
        isDeleted: 0,
      },
    });

    if (!level) {
      return res.send(ERROR_GENERIC);
    }

    // Increment download count if requested
    if (inc === '1') {
      await prisma.levels.update({
        where: { levelID: level.levelID },
        data: { downloads: level.downloads + 1 },
      });

      // Log download action
      await prisma.actionsDownloads.create({
        data: {
          levelID: level.levelID,
          ip: Buffer.from(getIP(req)),
          uploadDate: new Date(),
        },
      });
    }

    // Format response
    const response = formatResponse({
      1: level.levelID,
      2: level.levelName,
      3: level.levelDesc,
      4: level.levelString || '',
      5: level.levelVersion,
      6: level.userID,
      8: '10', // Difficulty denominator
      9: level.starDifficulty,
      10: inc === '1' ? level.downloads + 1 : level.downloads,
      11: '1', // Set completes (not tracked)
      12: level.audioTrack,
      13: level.gameVersion,
      14: level.likes,
      15: level.levelLength,
      17: level.starDemon,
      18: level.starStars,
      19: level.starFeatured,
      25: level.starAuto ? 1 : 0,
      27: level.password === 0 ? '0' : level.password === 1 ? '1' : `1${level.password}`,
      28: level.uploadDate.toString(),
      29: level.updateDate.toString(),
      30: level.original,
      31: level.twoPlayer,
      35: level.songID,
      36: level.extraString,
      37: level.coins,
      38: level.starCoins,
      39: level.requestedStars,
      40: level.isLDM,
      41: '0', // Daily number
      42: level.starEpic,
      43: level.starDemonDiff,
      45: level.objects,
      46: '1', // Editor time (not tracked)
      47: '2', // Total editor time (not tracked)
      52: level.songIDs,
      53: level.sfxIDs,
      57: level.settingsString,
    });

    return res.send(`${response}#${level.levelInfo}#${level.secret}`);
  } catch (error) {
    console.error('Error in downloadGJLevel22:', error);
    return res.send(ERROR_GENERIC);
  }
}
