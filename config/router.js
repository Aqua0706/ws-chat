var User = require('../app/controllers/user');

module.exports = function(app,io){
   //pre handle user   预处理
    // app.use(function(req, res, next) {
    //     var _user = req.session.user || 0;
    //     app.locals.user = _user;
    //     return next();
    // })

   app.get('/signup',User.showSignup);
   app.get('/signin',User.showSignin);
   //app.get('/logout',User.logout);
   app.post('/user/signup',User.signup);
   app.post('/user/signin',User.signin);


   app.get('/chat',User.signinRequired,User.chat);

}
