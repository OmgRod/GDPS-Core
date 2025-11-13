import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams, getIP } from '../../utils/response';
import { generateRandomString } from '../../utils/crypto';

const prisma = new PrismaClient();

/**
 * Upload or update a level
 * POST /uploadGJLevel21.php
 * 
 * Parameters:
 * - accountID: Account ID
 * - gjp: GJP (password hash)
 * - userName: Username
 * - levelID: Level ID (0 for new level, existing ID for update)
 * - levelName: Level name
 * - levelDesc: Level description (base64 encoded)
 * - levelVersion: Level version
 * - levelLength: Level length (0=tiny, 1=short, 2=medium, 3=long, 4=xl)
 * - audioTrack: Audio track ID
 * - auto: Is auto (0 or 1)
 * - password: Level password (0 for no password, 1 for free copy, or numeric password)
 * - original: Original level ID (0 if original)
 * - twoPlayer: Two player mode (0 or 1)
 * - songID: Custom song ID (0 for official track)
 * - objects: Object count
 * - coins: Coin count
 * - requestedStars: Requested star difficulty
 * - extraString: Extra data string
 * - levelString: Level data (gzip compressed and base64 encoded)
 * - levelInfo: Level info string
 * - secret: Game secret (should be "Wmfd2893gb7")
 * - unlisted: Unlisted status (0=listed, 1=friends only, 2=unlisted)
 * - ldm: LDM (Low Detail Mode) available
 * - songIDs: Multiple song IDs (comma separated)
 * - sfxIDs: SFX IDs (comma separated)
 */
export async function uploadGJLevel21(req: Request, res: Response) {
  try {
    const {
      accountID,
      userName,
      levelID,
      levelName,
      levelDesc,
      levelVersion,
      levelLength,
      audioTrack,
      auto,
      password,
      original,
      twoPlayer,
      songID,
      objects,
      coins,
      requestedStars,
      extraString,
      levelString,
      levelInfo,
      secret,
      unlisted,
      ldm,
      songIDs,
      sfxIDs,
      gameVersion,
      binaryVersion,
    } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['accountID', 'levelName'])) {
      return res.send(ERROR_GENERIC);
    }

    // Get user
    const user = await prisma.users.findFirst({
      where: { extID: accountID.toString() },
    });

    if (!user) {
      return res.send(ERROR_GENERIC);
    }

    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    const levelData = {
      gameVersion: parseInt(gameVersion) || 22,
      binaryVersion: parseInt(binaryVersion) || 0,
      userName: userName || user.userName,
      levelName: levelName || 'Unnamed',
      levelDesc: levelDesc || '',
      levelVersion: parseInt(levelVersion) || 1,
      levelLength: parseInt(levelLength) || 0,
      audioTrack: parseInt(audioTrack) || 0,
      auto: parseInt(auto) || 0,
      password: parseInt(password) || 0,
      original: parseInt(original) || 0,
      twoPlayer: parseInt(twoPlayer) || 0,
      songID: parseInt(songID) || 0,
      songIDs: songIDs || '',
      sfxIDs: sfxIDs || '',
      objects: parseInt(objects) || 0,
      coins: parseInt(coins) || 0,
      requestedStars: parseInt(requestedStars) || 0,
      extraString: extraString || '',
      levelString: levelString || '',
      levelInfo: levelInfo || '',
      secret: generateRandomString(5),
      starDifficulty: 0,
      downloads: 0,
      likes: 0,
      starDemon: 0,
      starAuto: auto === '1',
      starStars: 0,
      uploadDate: timestamp,
      updateDate: timestamp,
      rateDate: BigInt(0),
      starCoins: 0,
      starFeatured: 0,
      starHall: 0,
      starEpic: 0,
      starDemonDiff: 0,
      userID: user.userID,
      extID: accountID.toString(),
      unlisted: parseInt(unlisted) || 0,
      originalReup: 0,
      hostname: getIP(req),
      isCPShared: 0,
      isDeleted: 0,
      isLDM: parseInt(ldm) || 0,
      unlisted2: 0,
      wt: 0,
      wt2: 0,
      ts: 0,
      settingsString: '',
    };

    let savedLevel;

    if (levelID && parseInt(levelID) > 0) {
      // Update existing level
      const existingLevel = await prisma.levels.findFirst({
        where: {
          levelID: parseInt(levelID),
          userID: user.userID,
        },
      });

      if (!existingLevel) {
        return res.send(ERROR_GENERIC);
      }

      savedLevel = await prisma.levels.update({
        where: { levelID: parseInt(levelID) },
        data: {
          ...levelData,
          uploadDate: existingLevel.uploadDate, // Keep original upload date
          updateDate: timestamp,
        },
      });
    } else {
      // Create new level
      savedLevel = await prisma.levels.create({
        data: levelData,
      });
    }

    // Return level ID
    return res.send(savedLevel.levelID.toString());
  } catch (error) {
    console.error('Error in uploadGJLevel21:', error);
    return res.send(ERROR_GENERIC);
  }
}
