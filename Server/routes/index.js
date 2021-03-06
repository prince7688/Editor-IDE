const express = require("express");
const router = express.Router();
const passport = require("passport");
const redis = require('redis');
const jwt = require('jsonwebtoken')

/* GET home page. */


var client = redis.createClient(process.env.REDIS_URL);

 client.on('connect',()=>{
   console.log('Redis client connected');
 })
 client.on('error',(error)=>{
    console.log('Redis not connected')
 })


router.get("/", function(req, res, next) {
	res.render("index", { title: "Express" });
});

/* GET Google Authentication API. */
router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/", session: false }),
	function(req, res) {
        var token = req.user.token;
        console.log(token);

        const jwt_secret = "secret";
        const jwt_expiration = 60*10;
        const jwt_refresh_expiration = 60*60*20;
      
        //let refresh_token = generate_refresh_token(64);
       // let refresh_token_maxage = new Date() + jwt_refresh_expiration;
      
        let token1 = jwt.sign({ uid: token }, jwt_secret, {
              expiresIn: jwt_expiration
          });
        console.log(token1);
      
        client.set(token1, JSON.stringify({
          expires: jwt_expiration
        }),
        redis.print
        );

		res.redirect("http://client.rajat.local/admin?token=" + token);
	}
);

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('http://client.rajat.local');
  });


  
module.exports = router;