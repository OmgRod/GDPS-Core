import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Delete a level
 * POST /deleteGJLevel20.php
 * 
 * Parameters:
 * - accountID: Account ID
 * - gjp: GJP (password hash)
 * - levelID: Level ID to delete
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function deleteGJLevel20(req: Request, res: Response) {
  try {
    const { accountID, levelID, secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['accountID', 'levelID'])) {
      return res.send(ERROR_GENERIC);
    }

    // Get user
    const user = await prisma.users.findFirst({
      where: { extID: accountID.toString() },
    });

    if (!user) {
      return res.send(ERROR_GENERIC);
    }

    // Find level
    const level = await prisma.levels.findFirst({
      where: {
        levelID: parseInt(levelID),
        userID: user.userID,
      },
    });

    if (!level) {
      return res.send(ERROR_GENERIC);
    }

    // Mark level as deleted (soft delete)
    await prisma.levels.update({
      where: { levelID: level.levelID },
      data: { isDeleted: 1 },
    });

    return res.send('1');
  } catch (error) {
    console.error('Error in deleteGJLevel20:', error);
    return res.send(ERROR_GENERIC);
  }
}
