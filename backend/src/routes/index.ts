import { Router } from 'express';
import { registerGJAccount } from './accounts/registerGJAccount';
import { loginGJAccount } from './accounts/loginGJAccount';
import { updateGJUserScore22 } from './users/updateGJUserScore22';
import { getGJUserInfo20 } from './users/getGJUserInfo20';
import { uploadGJLevel21 } from './levels/uploadGJLevel21';
import { downloadGJLevel22 } from './levels/downloadGJLevel22';
import { getGJLevels21 } from './levels/getGJLevels21';
import { deleteGJLevel20 } from './levels/deleteGJLevel20';
import { likeGJItem211 } from './levels/likeGJItem211';
import { uploadGJComment21 } from './comments/uploadGJComment21';
import { getGJComments21 } from './comments/getGJComments21';
import { getGJScores20 } from './leaderboards/getGJScores20';

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
router.post('/deleteGJLevel20.php', deleteGJLevel20);

// Interaction endpoints
router.post('/likeGJItem211.php', likeGJItem211);

// Comment endpoints
router.post('/uploadGJComment21.php', uploadGJComment21);
router.post('/getGJComments21.php', getGJComments21);

// Leaderboard endpoints
router.post('/getGJScores20.php', getGJScores20);

export default router;
