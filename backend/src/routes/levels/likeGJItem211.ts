import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams, getIP } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Like or dislike an item (level, comment, or list)
 * POST /likeGJItem211.php
 * 
 * Parameters:
 * - accountID: Account ID
 * - gjp: GJP (password hash)
 * - itemID: ID of the item to like
 * - type: Type of item (1=level, 2=level comment, 3=account comment, 4=list)
 * - like: Like (1) or dislike (0)
 * - special: Special value (usually 0)
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function likeGJItem211(req: Request, res: Response) {
  try {
    const { accountID, itemID, type, like, secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['accountID', 'itemID', 'type', 'like'])) {
      return res.send(ERROR_GENERIC);
    }

    const itemIDNum = parseInt(itemID);
    const typeNum = parseInt(type);
    const isLike = like === '1';
    const ip = getIP(req);

    // Check if already liked/disliked
    const existingLike = await prisma.actionsLikes.findFirst({
      where: {
        itemID: itemIDNum,
        type: typeNum,
        ip: Buffer.from(ip),
      },
    });

    if (existingLike) {
      // Already liked/disliked
      return res.send(ERROR_GENERIC);
    }

    // Record the like/dislike action
    await prisma.actionsLikes.create({
      data: {
        itemID: itemIDNum,
        type: typeNum,
        isLike,
        ip: Buffer.from(ip),
        uploadDate: new Date(),
      },
    });

    // Update the item's like count
    if (typeNum === 1) {
      // Level
      const level = await prisma.levels.findFirst({
        where: { levelID: itemIDNum },
      });

      if (level) {
        await prisma.levels.update({
          where: { levelID: itemIDNum },
          data: { likes: isLike ? level.likes + 1 : level.likes - 1 },
        });
      }
    } else if (typeNum === 2) {
      // Level comment
      const comment = await prisma.comments.findFirst({
        where: { commentID: itemIDNum },
      });

      if (comment) {
        await prisma.comments.update({
          where: { commentID: itemIDNum },
          data: { likes: isLike ? comment.likes + 1 : comment.likes - 1 },
        });
      }
    } else if (typeNum === 3) {
      // Account comment
      const accComment = await prisma.accComments.findFirst({
        where: { commentID: itemIDNum },
      });

      if (accComment) {
        await prisma.accComments.update({
          where: { commentID: itemIDNum },
          data: { likes: isLike ? accComment.likes + 1 : accComment.likes - 1 },
        });
      }
    } else if (typeNum === 4) {
      // List
      const list = await prisma.lists.findFirst({
        where: { listID: itemIDNum },
      });

      if (list) {
        await prisma.lists.update({
          where: { listID: itemIDNum },
          data: { likes: isLike ? list.likes + 1 : list.likes - 1 },
        });
      }
    }

    return res.send('1');
  } catch (error) {
    console.error('Error in likeGJItem211:', error);
    return res.send(ERROR_GENERIC);
  }
}
