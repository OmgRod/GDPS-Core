import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Upload a level comment
 * POST /uploadGJComment21.php
 * 
 * Parameters:
 * - accountID: Account ID
 * - gjp: GJP (password hash)
 * - userName: Username
 * - comment: Comment text (base64 encoded)
 * - levelID: Level ID
 * - percent: Completion percentage (0-100)
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function uploadGJComment21(req: Request, res: Response) {
  try {
    const { accountID, userName, comment, levelID, percent, secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['accountID', 'userName', 'comment', 'levelID'])) {
      return res.send(ERROR_GENERIC);
    }

    // Get user
    const user = await prisma.users.findFirst({
      where: { extID: accountID.toString() },
    });

    if (!user) {
      return res.send(ERROR_GENERIC);
    }

    // Create comment
    const newComment = await prisma.comments.create({
      data: {
        userID: user.userID,
        userName: userName || user.userName,
        comment: comment || '',
        levelID: parseInt(levelID),
        percent: parseInt(percent) || 0,
        timestamp: Math.floor(Date.now() / 1000),
        likes: 0,
        isSpam: false,
      },
    });

    return res.send(newComment.commentID.toString());
  } catch (error) {
    console.error('Error in uploadGJComment21:', error);
    return res.send(ERROR_GENERIC);
  }
}
