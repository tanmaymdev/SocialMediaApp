const md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema.js');
const userLoginSchema = require('./userLoginSchema')
const User = mongoose.model('user', userSchema,'user');
const UserLogin = mongoose.model('userLogin',userLoginSchema,'userLogin');
const connectionString = "mongodb+srv://tm67:Tm.2707216@cluster0.vlqxt.mongodb.net/parliament?retryWrites=true&w=majority"

let userObjs = {};
let sessionUser = {};
let cookieKey ='sid';
async function createUser(username,email,dob,zipcode) {
    return new User({
        username:username,
        email:email,
        dob:dob,
        zipcode:zipcode,
        created: Date.now()
    }).save()
}
function register(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let dob = req.body.dob;
    let zipcode = req.body.zipcode;
    // supply username and password
    if (!username || !password || !email || !dob || !zipcode) {
        return res.sendStatus(400);
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt + password) // TODO: Change this to use md5 to create a hash

    userObjs[username] =  {"salt": salt, "hash": hash} // TODO: Change this to store object with username, salt, hash

    let msg = {username: username, result: 'success'};
    (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        // TODO: add a user to the database
        await (connector.then(async () => {
            user = await createUser(username,email,dob,zipcode)
        }));
    })();
    (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        // TODO: add a user to the database
        await (connector.then(async () => {
            userLogin = await new UserLogin({
                username:username,
                salt:salt,
                hash:hash,
                created: Date.now()
            }).save()
        }));
    })();
    res.send(msg);
}


async function findUser(username) {
    return UserLogin.findOne({username:username});
}

async function getUser(username) {
    const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    // TODO: add a user to the database
    return await connector.then(async () => {
        return findUser(username);
    });
}

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let user = await getUser(username)
    //console.log(username)
    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }
    //const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    // get the record from the database by username

    let msg;
    //console.log(user);
    if(user.hash === md5(user.salt + password))
    {
    //"security by obscurity" we don't want people guessing a sessionkey
    const sessionKey = md5('mySecretMessage' + new Date().getTime() + user.username)
    sessionUser[sessionKey] = user

    //this sets a cookie
    res.cookie(cookieKey, sessionKey, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'None', secure: true})
    msg = {username: username, result: 'success'};
    }
    else{
        msg = {username: username , result : 'Incorrect Password'}
    }
    res.send(msg)

}
function isLoggedIn(req,res,next) {


    let sid = req.cookies[cookieKey];
    if(!sid) {
        return res.sendStatus(401);
    }

    var username = sessionUser[sid]
    if(username) {

        req.username = username
        next()
    } else {
        res.sendStatus(401)
    }
}

function logout(req,res) {
    var sid = req.cookies[cookieKey]
    if(!sid) {
        return res.sendStatus(401);
    }
    sessionUser[sid] = null;
    delete sessionUser[sid]
    res.clearCookie('sid');
    res.send('OK')
}

function updateUserPassword(req,res) {
    //get the new password from the request body.

    let newPassword = req.body.password;

    //now use md5 to hash with password with salt.
    //Update the DB with new Hash and salt.

    res.send({ username: 'loggedInUser', result: 'success' })


}

module.exports = (app) => {
    app.post('/register', register);
    app.post('/login',login);
    app.put('/logout',isLoggedIn,logout);
    app.put('/password',isLoggedIn,updateUserPassword);
    app.use(isLoggedIn);
}
