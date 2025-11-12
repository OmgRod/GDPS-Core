import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Upload level score (level completion)
 * POST /uploadGJLevelScore211.php
 * 
 * Parameters:
 * - accountID: Account ID
 * - gjp: GJP (password hash)
 * - levelID: Level ID
 * - percent: Completion percentage (0-100)
 * - attempts: Number of attempts
 * - coins: Coins collected (0-3)
 * - clicks: Number of clicks
 * - time: Time taken in seconds
 * - progresses: Progress string (comma-separated percentages)
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function uploadGJLevelScore(req: Request, res: Response) {
  try {
    const {
      accountID,
      levelID,
      percent,
      attempts,
      coins,
      clicks,
      time,
      progresses,
      secret,
    } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['accountID', 'levelID', 'percent'])) {
      return res.send(ERROR_GENERIC);
    }

    const accountIDNum = parseInt(accountID);
    const levelIDNum = parseInt(levelID);
    const percentNum = parseInt(percent);

    // Find or create level score
    const existingScore = await prisma.levelScores.findFirst({
      where: {
        accountID: accountIDNum,
        levelID: levelIDNum,
      },
    });

    const scoreData = {
      accountID: accountIDNum,
      levelID: levelIDNum,
      percent: percentNum,
      uploadDate: Math.floor(Date.now() / 1000),
      attempts: parseInt(attempts) || 0,
      coins: parseInt(coins) || 0,
      clicks: parseInt(clicks) || 0,
      time: parseInt(time) || 0,
      progresses: progresses || '',
      dailyID: 0,
    };

    if (existingScore) {
      // Only update if new percent is higher
      if (percentNum > existingScore.percent) {
        await prisma.levelScores.update({
          where: { scoreID: existingScore.scoreID },
          data: scoreData,
        });
      }
    } else {
      // Create new score
      await prisma.levelScores.create({
        data: scoreData,
      });
    }

    // If level completed (100%), update user stats
    if (percentNum === 100) {
      const level = await prisma.levels.findFirst({
        where: { levelID: levelIDNum },
      });

      if (level) {
        const user = await prisma.users.findFirst({
          where: { extID: accountID.toString() },
        });

        if (user) {
          const updates: any = {
            completedLvls: user.completedLvls + 1,
          };

          // Award stars if level is rated
          if (level.starStars > 0) {
            updates.stars = user.stars + level.starStars;
            
            // Award demons
            if (level.starDemon === 1) {
              updates.demons = user.demons + 1;
            }
          }

          // Award user coins if verified
          if (level.starCoins > 0 && parseInt(coins) === level.coins) {
            updates.userCoins = user.userCoins + level.coins;
          }

          await prisma.users.update({
            where: { userID: user.userID },
            data: updates,
          });
        }
      }
    }

    return res.send(levelIDNum.toString());
  } catch (error) {
    console.error('Error in uploadGJLevelScore:', error);
    return res.send(ERROR_GENERIC);
  }
}
