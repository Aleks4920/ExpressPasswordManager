
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
//var Password = require('../models/password');
var router = express.Router();
var randomBytes = require("crypto").randomBytes;
var createCipheriv = require("crypto").createCipheriv;
var createDecipheriv = require("crypto").createDecipheriv;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');





// passwordSchema.plugin(passportLocalMongoose);



process.env.ENCRYPTION_KEY = "01234567890123456789012345678901"; // 32 bytes

// var password = require('./models/password');
// passport.use(new LocalStrategy(password.authenticate()));
// passport.serializeUser(password.serializeUser());
// passport.deserializeUser(password.deserializeUser());





// encryption and decryption functions
function encrypt(text) {
    var iv = randomBytes(16);
    var cipher = createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY), iv);
    var encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    var textParts = text.split(':');
    var iv = Buffer.from(textParts.shift(), 'hex');
    var encryptedText = Buffer.from(textParts.join(':'), 'hex');
    var decipher = createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY), iv);
    var decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


router.get('/new', function (req, res) {
    // if not logged in, redirect to /
    if (!req.user) {
        res.redirect('/');
    }
    //process.env.ENCRYPTION_KEY = String(req.user.password).substring(0, 31);


    res.render('newPassword', { user : req.user });
});

const passwordSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    email: {
      type: String,
      required: false
    },
    website: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  });
  
const Password = mongoose.model('Password', passwordSchema);

router.post('/new', function (req, res) {   
     

    // if not logged in, redirect to /
    if (!req.user) {
        res.redirect('/');
    }

    //process.env.ENCRYPTION_KEY = String(req.user.password).substring(0, 31);


    const collection = req.user.username + "_passwords";
    const UserPassword = mongoose.model(collection, passwordSchema);

    // check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        res.status(500).send("Passwords do not match");
        return;
    }

    // check that no fields are empty
    if (req.body.website === "" || req.body.password === "") {
        res.status(500).send("Please fill out all fields");
        return;
    }

    const newPassword = new UserPassword({
        username: req.body.username,
        email: req.body.email,
        website: req.body.website,
        password: encrypt(req.body.password)
    });

    newPassword.save()
    .then(result => {
        //console.log("Password saved");
        //console.log(decrypt(result.password));
        res.redirect('/home');
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Error saving password");
    });
    


});





router.get('/home', function (req, res) {

    
    // if not logged in, redirect to /
    if (!req.user) {
        res.redirect('/');
    }
    //process.env.ENCRYPTION_KEY = String(req.user.password).substring(0, 31);

    // print users password hash
    //console.log(req.user.hash);

    // get all saveUsername from database
    Account.find({ savedUsername: req.user.username }, function (err, passwords) {
        if (err) {
            console.log(err);
        } else {
            // render passwords from collection called 'username' + '_passwords'
            const collection = req.user.username + "_passwords";
            const UserPassword = mongoose.model(collection, passwordSchema);
            UserPassword.find({}, function (err, passwords) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('home', { user : req.user, passwords: passwords });
                }
            });
        }
    });
});

router.get('/getPassword/:id', function (req, res) {

    // if not logged in, redirect to /
    if (!req.user) {
        res.redirect('/');
    }

    ////process.env.ENCRYPTION_KEY = String(req.user.password).substring(0, 31);

    //decrypt password and send it back to client
    const collection = req.user.username + "_passwords";
    const UserPassword = mongoose.model(collection, passwordSchema);
    UserPassword.findById(req.params.id, function (err, password) {
        if (err) {
            console.log(err);
        } else {
            try {
            //console.log(decrypt(password.password));
            res.send(decrypt(password.password));
            } catch (err) {
                res.send(password.password);
            }
        }
        
    });
});


router.get('/delete/:id', function (req, res) {
    // if not logged in, redirect to /
    if (!req.user) {
        res.redirect('/');
    }
    //process.env.ENCRYPTION_KEY = String(req.user.password).substring(0, 31);


    // delete password from database
    const collection = req.user.username + "_passwords";
    const UserPassword = mongoose.model(collection, passwordSchema);
    UserPassword.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/home');
        }
    });
});

router.get('/edit/:id', function (req, res) {
    // if not logged in, redirect to /
    if (!req.user) {
        res.redirect('/');
    }
    //process.env.ENCRYPTION_KEY = String(req.user.password).substring(0, 31);


    // get password from database
    const collection = req.user.username + "_passwords";
    const UserPassword = mongoose.model(collection, passwordSchema);
    UserPassword.findById(req.params.id, function (err, password) {
        if (err) {
            console.log(err);
        } else {
            res.render('editPassword', { user : req.user, password: password });
        }

    });

});

router.post('/edit/:id', function (req, res) {
    // if not logged in, redirect to /
    if (!req.user) {
        res.redirect('/');
    }
    //process.env.ENCRYPTION_KEY = String(req.user.password).substring(0, 31);


    // check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        res.status(500).send("Passwords do not match");
        return;
    }

    // check that no fields are empty
    if (req.body.website === "" || req.body.password === "") {
        res.status(500).send("Please fill out all fields");
        return;
    }

    // update password in database
    const collection = req.user.username + "_passwords";
    const UserPassword = mongoose.model(collection, passwordSchema);

    UserPassword.findByIdAndUpdate(req.params.id, { $set: { username: req.body.username, email: req.body.email, website: req.body.website, password: encrypt(req.body.password) }}, function (err, password) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/home');
        }
    });
});





module.exports = router;
