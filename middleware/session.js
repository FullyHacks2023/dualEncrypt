function sessionMiddleware(req, res, next) {
    if (req.session.userid) {
        next();
    } else {
        res.status(401).send({ error: 'Auth Error' });
    }
}

module.exports = sessionMiddleware;
