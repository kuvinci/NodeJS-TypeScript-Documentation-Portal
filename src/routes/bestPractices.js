const { Router } = require('express');
const { validationResult } = require('express-validator');
const BestPractices = require('../models/BestPractices');
const auth = require('../middleware/auth');
const { bestPracticeValidators } = require('../utils/validators');
const router = Router();

router.get('/', async (req, res) => {
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

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return redirect('/');
    }

    const bestPractice = await BestPractices.findById(req.params.id);

    res.render('bestPractice-edit', {
        title: bestPractice.title,
        bestPractice,
    });
});

router.post('/edit', auth, bestPracticeValidators, async (req, res) => {
    const errors = validationResult(req);
    const { id } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/best_practices/${id}/edit?allow=true`);
    }

    try {
        delete req.body.id;
        const bestPractice = await BestPractices.findById(id);
        if (!isOwner(bestPractice, req)) {
            return res.redirect('/best_practices');
        }
        Object.assign(bestPractice, req.body);
        await bestPractice.save();
        res.redirect('/best_practices');
    } catch (e) {
        console.log(e);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        await BestPractices.deleteOne({ _id: req.body.id });
    } catch (error) {
        console.log(error);
    }
    res.redirect('/best_practices');
});

router.get('/:id', async (req, res) => {
    const bestPractice = await BestPractices.findById(req.params.id);
    res.render('bestPractice', {
        title: bestPractice.title,
        bestPractice: bestPractice,
    });
});

module.exports = router;
