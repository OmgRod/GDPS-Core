import { Router } from 'express';
import { registerGJAccount } from './accounts/registerGJAccount';
import { loginGJAccount } from './accounts/loginGJAccount';
import { updateGJUserScore22 } from './users/updateGJUserScore22';
import { getGJUserInfo20 } from './users/getGJUserInfo20';
import { uploadGJLevel21 } from './levels/uploadGJLevel21';
import { downloadGJLevel22 } from './levels/downloadGJLevel22';
import { getGJLevels21 } from './levels/getGJLevels21';

const router = Router();

// Account endpoints
router.post('/accounts/registerGJAccount.php', registerGJAccount);
router.post('/accounts/loginGJAccount.php', loginGJAccount);

// User endpoints
router.post('/updateGJUserScore22.php', updateGJUserScore22);
router.post('/getGJUserInfo20.php', getGJUserInfo20);

// Level endpoints
router.post('/uploadGJLevel21.php', uploadGJLevel21);
router.post('/downloadGJLevel22.php', downloadGJLevel22);
router.post('/getGJLevels21.php', getGJLevels21);

export default router;
