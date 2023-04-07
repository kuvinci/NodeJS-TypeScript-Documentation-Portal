import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.render('index', {
        title: 'Ready Solutions',
        isHome: true,
    });
});

export default router;