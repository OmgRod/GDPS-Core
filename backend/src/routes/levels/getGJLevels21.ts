import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, formatResponse, formatListResponse } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Get list of levels (search, trending, featured, etc.)
 * POST /getGJLevels21.php
 * 
 * Parameters:
 * - type: Search type (0=search, 1=downloads, 2=likes, 3=trending, 4=recent, 5=user levels, 6=featured, 7=magic, 10=map packs, 11=awarded, 12=followed, 13=friends)
 * - str: Search string (level name or user name)
 * - diff: Difficulty filter (comma separated: -1=NA, -2=demon, -3=auto, 1=easy, 2=normal, 3=hard, 4=harder, 5=insane)
 * - len: Length filter (comma separated: 0=tiny, 1=short, 2=medium, 3=long, 4=xl)
 * - page: Page number (0-indexed)
 * - total: Total count (not used in request)
 * - gauntlet: Gauntlet ID (for gauntlet levels)
 * - secret: Game secret (should be "Wmfd2893gb7")
 * - star: Star filter (0=no stars, 1=has stars)
 * - coins: Coins filter (0=no coins, 1=has coins)
 * - epic: Epic filter (0=not epic, 1=epic)
 * - featured: Featured filter (0=not featured, 1=featured)
 * - original: Original filter (0=copies allowed, 1=originals only)
 * - twoPlayer: Two player filter (0=single player, 1=two player)
 * - song: Song ID filter
 * - customSong: Custom song ID filter
 */
export async function getGJLevels21(req: Request, res: Response) {
  try {
    const {
      type = '0',
      str = '',
      diff = '',
      len = '',
      page = '0',
      secret,
      star,
      coins,
      epic,
      featured,
      original,
      twoPlayer,
      song,
      customSong,
    } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    const pageNum = parseInt(page);
    const pageSize = 10;
    const offset = pageNum * pageSize;

    // Build where clause based on filters
    const where: any = {
      isDeleted: 0,
      unlisted: 0,
    };

    // Type-based filtering
    if (type === '6' || featured === '1') {
      // Featured levels
      where.starFeatured = { gt: 0 };
    } else if (type === '11') {
      // Awarded (rated) levels
      where.starStars = { gt: 0 };
    } else if (type === '5') {
      // User levels - requires str to be set to user ID
      if (str) {
        where.userID = parseInt(str);
      }
    }

    // Search by name
    if (str && type === '0') {
      where.levelName = { contains: str };
    }

    // Difficulty filter
    if (diff) {
      const difficulties = diff.split(',').map((d: string) => parseInt(d));
      if (difficulties.includes(-2)) {
        where.starDemon = 1;
      } else if (difficulties.includes(-3)) {
        where.starAuto = true;
      } else if (difficulties.length > 0) {
        where.starDifficulty = { in: difficulties.map((d: number) => d * 10) };
      }
    }

    // Length filter
    if (len) {
      const lengths = len.split(',').map((l: string) => parseInt(l));
      if (lengths.length > 0) {
        where.levelLength = { in: lengths };
      }
    }

    // Star filter
    if (star === '1') {
      where.starStars = { gt: 0 };
    }

    // Coins filter
    if (coins === '1') {
      where.coins = { gt: 0 };
    }

    // Epic filter
    if (epic === '1') {
      where.starEpic = { gt: 0 };
    }

    // Two player filter
    if (twoPlayer === '1') {
      where.twoPlayer = 1;
    }

    // Song filter
    if (customSong) {
      where.songID = parseInt(customSong);
    } else if (song) {
      where.audioTrack = parseInt(song);
    }

    // Order by clause
    let orderBy: any = {};
    if (type === '1') {
      orderBy = { downloads: 'desc' };
    } else if (type === '2') {
      orderBy = { likes: 'desc' };
    } else if (type === '3') {
      // Trending - likes in recent time
      orderBy = { likes: 'desc' };
    } else if (type === '4' || type === '0') {
      orderBy = { uploadDate: 'desc' };
    } else if (type === '6') {
      orderBy = { starFeatured: 'desc' };
    } else {
      orderBy = { uploadDate: 'desc' };
    }

    // Get levels
    const levels = await prisma.levels.findMany({
      where,
      orderBy,
      skip: offset,
      take: pageSize,
    });

    // Get total count
    const totalCount = await prisma.levels.count({ where });

    if (levels.length === 0) {
      return res.send(ERROR_GENERIC);
    }

    // Format level responses
    const levelStrings = levels.map((level) => {
      return formatResponse({
        1: level.levelID,
        2: level.levelName,
        3: level.levelDesc,
        5: level.levelVersion,
        6: level.userID,
        8: '10',
        9: level.starDifficulty,
        10: level.downloads,
        12: level.audioTrack,
        13: level.gameVersion,
        14: level.likes,
        15: level.levelLength,
        17: level.starDemon,
        18: level.starStars,
        19: level.starFeatured,
        25: level.starAuto ? 1 : 0,
        27: level.password === 0 ? '0' : '1',
        28: level.uploadDate.toString(),
        29: level.updateDate.toString(),
        30: level.original,
        31: level.twoPlayer,
        35: level.songID,
        37: level.coins,
        38: level.starCoins,
        39: level.requestedStars,
        42: level.starEpic,
        43: level.starDemonDiff,
        45: level.objects,
        46: '1',
        47: '2',
      });
    });

    // Get unique user IDs
    const userIDs = [...new Set(levels.map((l) => l.userID))];
    const users = await prisma.users.findMany({
      where: { userID: { in: userIDs } },
    });

    // Format user responses
    const userStrings = users.map((user) => {
      return formatResponse({
        1: user.userName,
        2: user.userID,
        9: user.icon,
        10: user.color1,
        11: user.color2,
        14: user.iconType,
        15: '0',
        16: user.userID,
      });
    });

    // Get unique song IDs
    const songIDs = levels
      .map((l) => l.songID)
      .filter((id) => id > 0)
      .filter((id, idx, arr) => arr.indexOf(id) === idx);
    
    let songStrings: string[] = [];
    if (songIDs.length > 0) {
      const songs = await prisma.songs.findMany({
        where: { ID: { in: songIDs } },
      });

      songStrings = songs.map((song) => {
        return formatResponse(
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
      });
    }

    // Combine all data
    const levelData = formatListResponse(levelStrings, '', '|', '#');
    const userData = formatListResponse(userStrings, '', '|', '#');
    const songData = songStrings.length > 0 ? formatListResponse(songStrings, '', '', '~:~') : '';
    
    const response = `${levelData}#${userData}#${songData}#${totalCount}:${offset}:${pageSize}`;

    return res.send(response);
  } catch (error) {
    console.error('Error in getGJLevels21:', error);
    return res.send(ERROR_GENERIC);
  }
}
