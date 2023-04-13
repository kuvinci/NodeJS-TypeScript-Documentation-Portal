import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import BestPractices from '../models/BestPractices';
import auth from '../middleware/auth';
import { bestPracticeValidators } from '../utils/validators';

const router = Router();

router.get('/', auth, (req: Request, res: Response) => {
    res.render('addBP', {
        title: 'Add Best Practice',
        isBP: true,
    });
});

router.post('/', auth, bestPracticeValidators, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('addBP', {
            title: 'Add Best Practice',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                type_dahboard: req.body.type_dahboard,
                type_wp: req.body.type_wp,
                type_php: req.body.type_php,
                type_css: req.body.type_css,
                content: req.body.content,
                userID: req.user._id,
            },
        });
    }

    const bestPractice = new BestPractices({
        title: req.body.title,
        type_dahboard: req.body.type_dahboard,
        type_wp: req.body.type_wp,
        type_php: req.body.type_php,
        type_css: req.body.type_css,
        content: req.body.content,
        userID: req.user._id,
    });

    try {
        await req.user.addBP(bestPractice);
        await bestPractice.save();
        res.redirect('/best_practices');
    } catch (error) {
        console.log(error);
    }
});

export default router;
