var express 	= require('express'),
	router 		= express.Router();

router.get('/', function(req, res, next) {
	res.render('login', { title: 'faceGUI' });
});

router.post('/', function(req, res) {
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
});

module.exports = router;
