const express = require('express');

const router = express.Router();
const validationError = require('../helpers/validateUserReq');
const { createUserByPassword, checkUserEmailPass } = require('../dbModels/user');

router.post('/registration', async (req, res) => {
    try {
        const validationerror = validationError.registration(req.body);

        if (validationerror) {
            res.status(401).send(validationerror);
        } else {
            const user = await createUserByPassword(req.body);
            if (user.errorMsg) {
                res.status(500).send(user);
            } else {
                res.send(user);
            }
        }
    } catch (err) {
        console.log('error', err);
        res.send({ errorMsg: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const validationerror = validationError.login(req.body);

        if (validationerror) {
            res.status(401).send(validationerror);
        } else {
            const user = await checkUserEmailPass(req.body);
            console.log(user);
            if (user.errorMsg) {
                res.status(500).send(user);
            } else if (user.invalidMsg) {
                res.send({ validateMsg: user.invalidMsg, id: user.userid });
            } else {
                // data to save in Session
                const sessionUserData = {
                    id: user.id,
                    email: user.email || '',
                    name: user.name || ''
                };
                req.session.userid = sessionUserData.id;
                req.session.email = sessionUserData.email;
                req.session.name = sessionUserData.name;
                res.send({ ...sessionUserData, success: 1 });
            }
        }
    } catch (err) {
        console.log('error', err);
        res.send({ errorMsg: err.message });
    }
});
router.get('/logout', async (req, res) => {
    try {
        req.session.save((err) => {
            if (err) {
                res.send({ errorMsg: 'session not eneded' });
            }
            res.redirect('/auth');
        });
    } catch (err) {
        console.log('error', err);
        res.send({ errorMsg: 'server issue' });
    }
});

module.exports = router;
