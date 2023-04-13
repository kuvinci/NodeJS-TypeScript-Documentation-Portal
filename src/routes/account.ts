import { Router, Request, Response } from 'express';
import BestPractices from '../models/BestPractices';
import User from '../models/User';
import auth from '../middleware/auth';

const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
    const bestPractices = await BestPractices.find()
    .populate('userID', 'email username name');

    res.render('account', {
        title: 'Profile page',
        isAccount: true,
        bestPractices: bestPractices,
        user: {
            email: req.user.email,
            username: req.user.username,
            name: req.user.name,
        }
    });
});

router.post('/edit', auth, async (req: Request, res: Response) => {
    try {
        const id = req.user._id;
        const user = {
            email: req.body.email,
            username: req.body.username,
            name: req.body.name,
        }
        await User.findByIdAndUpdate(id, user);
        res.redirect('/account');
    } catch (error) {
        console.log(error);
    }
});

export default router;
