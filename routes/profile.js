const express = require('express');
const router = express.Router();

// Middleware to ensure user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Profile route - protected
router.get('/profile', isAuthenticated, (req, res) => {
    const user = req.session.user;
    res.render('profile', {
        name: user.name,
        email: user.email,
        address: user.address,
        password: user.password,
    });
});

module.exports = router;
