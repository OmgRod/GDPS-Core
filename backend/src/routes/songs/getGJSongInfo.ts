import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams, formatResponse } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Get song info
 * POST /getGJSongInfo.php
 * 
 * Parameters:
 * - songID: Song ID to get info for
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function getGJSongInfo(req: Request, res: Response) {
  try {
    const { songID, secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['songID'])) {
      return res.send(ERROR_GENERIC);
    }

    // Find song
    const song = await prisma.songs.findFirst({
      where: {
        ID: parseInt(songID),
        isDisabled: 0,
      },
    });

    if (!song) {
      return res.send(ERROR_GENERIC);
    }

    // Format response
    const response = formatResponse(
      {
        1: song.ID,
        2: song.name,
        3: song.authorID,
        4: song.authorName,
        5: song.size,
        6: '',
        7: '',
        8: '0',
        10: song.download,
      },
      '~|~',
      '~'
    );

    return res.send(response);
  } catch (error) {
    console.error('Error in getGJSongInfo:', error);
    return res.send(ERROR_GENERIC);
  }
}
