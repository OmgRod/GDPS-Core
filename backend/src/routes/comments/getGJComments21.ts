import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams, formatResponse, formatListResponse } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Get comments for a level
 * POST /getGJComments21.php
 * 
 * Parameters:
 * - levelID: Level ID
 * - page: Page number (0-indexed)
 * - mode: Sort mode (0=recent, 1=most liked)
 * - count: Number of comments per page (default 20)
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function getGJComments21(req: Request, res: Response) {
  try {
    const { levelID, page = '0', mode = '0', count = '20', secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['levelID'])) {
      return res.send(ERROR_GENERIC);
    }

    const pageNum = parseInt(page);
    const pageSize = parseInt(count);
    const offset = pageNum * pageSize;

    // Determine sort order
    const orderBy = mode === '1' ? { likes: 'desc' as const } : { timestamp: 'desc' as const };

    // Get comments
    const comments = await prisma.comments.findMany({
      where: {
        levelID: parseInt(levelID),
        isSpam: false,
      },
      orderBy,
      skip: offset,
      take: pageSize,
    });

    if (comments.length === 0) {
      return res.send(ERROR_GENERIC);
    }

    // Get total count
    const totalCount = await prisma.comments.count({
      where: {
        levelID: parseInt(levelID),
        isSpam: false,
      },
    });

    // Get user info for all comments
    const userIDs = [...new Set(comments.map((c) => c.userID))];
    const users = await prisma.users.findMany({
      where: { userID: { in: userIDs } },
    });

    const userMap = new Map(users.map((u) => [u.userID, u]));

    // Format comment responses
    const commentStrings = comments.map((comment) => {
      const user = userMap.get(comment.userID);
      return formatResponse({
        1: '0', // Level ID (not used in response)
        2: comment.comment,
        3: comment.userID,
        4: comment.likes,
        6: comment.commentID,
        7: '0', // Is spam
        9: comment.timestamp,
        10: comment.percent,
        11: '0', // Mod badge level
        12: user?.color1 || 0,
      });
    });

    const response = formatListResponse(commentStrings, `${totalCount}:${offset}:${pageSize}`, '|', '#');

    return res.send(response);
  } catch (error) {
    console.error('Error in getGJComments21:', error);
    return res.send(ERROR_GENERIC);
  }
}
