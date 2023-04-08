import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import BestPractices from '../models/BestPractices';
import auth from '../middleware/auth';
import { bestPracticeValidators } from '../utils/validators';

const router = Router();

function isOwner(bestPractice: any, req: Request): boolean {
    return bestPractice.userID.toString() === req.user._id.toString();
}

router.get('/', async (req: Request, res: Response) => {
    const bestPractices = await BestPractices.find().populate(
        'userID',
        'email username name'
    );

    res.render('bestPractices', {
        title: 'Best Practices (BP)',
        isBestPractices: true,
        bestPractices: bestPractices,
    });
});

router.get('/:id/edit', auth, async (req: Request, res: Response) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }

    const bestPractice = await BestPractices.findById(req.params.id);

    if (bestPractice) {
        res.render('bestPractice-edit', {
            title: bestPractice.title,
            bestPractice,
        });
    } else {
        res.status(404).render('404', {
            title: `Best Practice with id - ${req.params.id} not found`,
        });
    }
});

router.post('/edit', auth, bestPracticeValidators, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    const { id } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/best_practices/${id}/edit?allow=true`);
    }

    try {
        delete req.body.id;
        const bestPractice = await BestPractices.findById(id);
        if (bestPractice) {
            if (!isOwner(bestPractice, req)) {
                return res.redirect('/best_practices');
            }
            Object.assign(bestPractice, req.body);
            await bestPractice.save();
            res.redirect('/best_practices');
        } else {
            res.status(404).render('404', {
                title: `Best Practice with id - ${id} not found`,
            });
        }
    } catch (e) {
        console.log(e);
    }
});

router.post('/delete', auth, async (req: Request, res: Response) => {
    try {
        await BestPractices.deleteOne({ _id: req.body.id });
    } catch (error) {
        console.log(error);
    }
    res.redirect('/best_practices');
});

router.get('/:id', async (req: Request, res: Response) => {
    const bestPractice = await BestPractices.findById(req.params.id);
    if (bestPractice) {
        res.render('bestPractice', {
            title: bestPractice.title,
            bestPractice,
        });
    } else {
        res.status(404).render('404', {
            title: `Best Practice with id - ${req.params.id} not found`,
        });
    }
});

export default router;
