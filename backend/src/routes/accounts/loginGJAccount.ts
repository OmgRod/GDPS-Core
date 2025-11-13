import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, generateGJP2 } from '../../utils/crypto';
import { ERROR_GENERIC, validateRequiredParams } from '../../utils/response';

const prisma = new PrismaClient();

/**
 * Login to an account
 * POST /accounts/loginGJAccount.php
 * 
 * Parameters:
 * - userName: Username
 * - password: Password (plain text)
 * - secret: Game secret (should be "Wmfv3899gc9")
 */
export async function loginGJAccount(req: Request, res: Response) {
  try {
    const { userName, password, secret } = req.body;

    // Validate secret
    if (secret !== 'Wmfv3899gc9') {
      return res.send(ERROR_GENERIC);
    }

    // Validate required parameters
    if (!validateRequiredParams(req.body, ['userName', 'password'])) {
      return res.send(ERROR_GENERIC);
    }

    // Find account by username
    const account = await prisma.account.findFirst({
      where: { userName },
    });

    if (!account) {
      return res.send(ERROR_GENERIC); // Account not found
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, account.password);
    if (!isValidPassword) {
      return res.send(ERROR_GENERIC); // Invalid password
    }

    // Return account ID and user ID
    // Format: accountID,userID
    const user = await prisma.users.findFirst({
      where: { extID: account.accountID.toString() },
    });

    if (!user) {
      return res.send(ERROR_GENERIC);
    }

    return res.send(`${account.accountID},${user.userID}`);
  } catch (error) {
    console.error('Error in loginGJAccount:', error);
    return res.send(ERROR_GENERIC);
  }
}
