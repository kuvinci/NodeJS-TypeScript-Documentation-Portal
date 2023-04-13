import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
    res.status(404).render('404', {
        title: 'Page not found',
    });
};
