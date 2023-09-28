const assertAuth = (req, res, next) => {
    if(!req.user.admin)
        return res.status(403).send();
    next();
};

module.exports = assertAuth;