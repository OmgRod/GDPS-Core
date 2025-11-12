import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, generateGJP2 } from '../../utils/crypto';
import { ERROR_GENERIC, validateRequiredParams, getIP } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Register a new account
 * POST /accounts/registerGJAccount.php
 * 
 * Parameters:
 * - userName: Username
 * - password: Password (plain text)
 * - email: Email address
 * - secret: Game secret (should be "Wmfd2893gb7")
 */
export async function registerGJAccount(req: Request, res: Response) {
  try {
    const { userName, password, email, secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfd2893gb7') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['userName', 'password', 'email'])) {
      return res.send(ERROR_GENERIC);
    }

    // Check if username already exists
    const existingUser = await prisma.account.findFirst({
      where: { userName },
    });

    if (existingUser) {
      return res.send('-2'); // Username already taken
    }

    // Check if email already exists
    const existingEmail = await prisma.account.findFirst({
      where: { email },
    });

    if (existingEmail) {
      return res.send('-3'); // Email already used
    }

    // Hash password and generate GJP2
    const hashedPassword = await hashPassword(password);
    const gjp2 = generateGJP2(password);

    // Create account
    const account = await prisma.account.create({
      data: {
        userName,
        password: hashedPassword,
        gjp2,
        email,
        registerDate: Math.floor(Date.now() / 1000),
        isActive: true,
      },
    });

    // Create corresponding user profile
    await prisma.users.create({
      data: {
        userName,
        extID: account.accountID.toString(),
        isRegistered: 1,
        IP: getIP(req),
      },
    });

    // Return success with account ID
    return res.send('1');
  } catch (error) {
    console.error('Error in registerGJAccount:', error);
    return res.send(ERROR_GENERIC);
  }
}
