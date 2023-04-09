function sessionMiddleware(req, res, next) {
    if (req.session.userid) {
        next();
    } else {
        res.status(401).send({ error: 'Auth Error' });
    }
}
function sessionMiddlewareTemplate(req, res, next) {
    if (req.session.userid) {
        next();
    } else {
        res.redirect('/auth');
    }
}

module.exports = { sessionMiddleware, sessionMiddlewareTemplate };
