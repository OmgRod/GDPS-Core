import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ERROR_GENERIC, validateRequiredParams, getIP } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Update user score and profile data
 * POST /updateGJUserScore22.php
 * 
 * This is called by the game client to sync user profile data
 * 
 * Parameters:
 * - accountID: Account ID
 * - gjp: GJP (password hash)
 * - userName: Username
 * - stars: Star count
 * - demons: Demon count
 * - diamonds: Diamond count
 * - icon: Icon ID
 * - color1: Primary color
 * - color2: Secondary color
 * - iconType: Icon type (cube=0, ship=1, ball=2, ufo=3, wave=4, robot=5, spider=6)
 * - coins: Secret coins
 * - userCoins: User coins
 * - special: Special value
 * - accIcon: Account icon
 * - accShip: Account ship
 * - accBall: Account ball
 * - accBird: Account bird/UFO
 * - accDart: Account dart/wave
 * - accRobot: Account robot
 * - accGlow: Glow enabled (0/1/2)
 * - accSpider: Account spider
 * - accExplosion: Account explosion
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function updateGJUserScore22(req: Request, res: Response) {
  try {
    const { accountID, userName, secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['accountID', 'userName'])) {
      return res.send(ERROR_GENERIC);
    }

    // Find or create user
    let user = await prisma.users.findFirst({
      where: { extID: accountID.toString() },
    });

    const updateData = {
      userName: userName || user?.userName || 'undefined',
      stars: parseInt(req.body.stars) || 0,
      demons: parseInt(req.body.demons) || 0,
      diamonds: parseInt(req.body.diamonds) || 0,
      icon: parseInt(req.body.icon) || 0,
      color1: parseInt(req.body.color1) || 0,
      color2: parseInt(req.body.color2) || 3,
      color3: parseInt(req.body.color3) || 0,
      iconType: parseInt(req.body.iconType) || 0,
      coins: parseInt(req.body.coins) || 0,
      userCoins: parseInt(req.body.userCoins) || 0,
      special: parseInt(req.body.special) || 0,
      accIcon: parseInt(req.body.accIcon) || 0,
      accShip: parseInt(req.body.accShip) || 0,
      accBall: parseInt(req.body.accBall) || 0,
      accBird: parseInt(req.body.accBird) || 0,
      accDart: parseInt(req.body.accDart) || 0,
      accRobot: parseInt(req.body.accRobot) || 0,
      accGlow: parseInt(req.body.accGlow) || 0,
      accSpider: parseInt(req.body.accSpider) || 0,
      accExplosion: parseInt(req.body.accExplosion) || 0,
      accSwing: parseInt(req.body.accSwing) || 0,
      accJetpack: parseInt(req.body.accJetpack) || 0,
      orbs: parseInt(req.body.orbs) || 0,
      moons: parseInt(req.body.moons) || 0,
      completedLvls: parseInt(req.body.completedLvls) || 0,
      IP: getIP(req),
      lastPlayed: Math.floor(Date.now() / 1000),
    };

    if (user) {
      // Update existing user
      await prisma.users.update({
        where: { userID: user.userID },
        data: updateData,
      });
    } else {
      // Create new user
      await prisma.users.create({
        data: {
          ...updateData,
          extID: accountID.toString(),
          isRegistered: 1,
        },
      });
    }

    // Return user ID
    const updatedUser = await prisma.users.findFirst({
      where: { extID: accountID.toString() },
    });

    return res.send(updatedUser?.userID.toString() || ERROR_GENERIC);
  } catch (error) {
    console.error('Error in updateGJUserScore22:', error);
    return res.send(ERROR_GENERIC);
  }
}
