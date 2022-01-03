const md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema.js');
const userLoginSchema = require('./userLoginSchema')
const User = mongoose.model('user', userSchema,'user');
const UserLogin = mongoose.model('userLogin',userLoginSchema,'userLogin');
const connectionString = "mongodb+srv://tm67:Tm.2707216@cluster0.vlqxt.mongodb.net/parliament?retryWrites=true&w=majority"
const auth = require('./auth');
const profile = {
    username: 'DLeebron',
    headline: 'This is my headline!',
    email: 'foo@bar.com',
    zipcode: 12345,
    dob: '128999122000',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg',
    following : ['rat','bat','cat','mat']
}
async function findUser(username) {
    return User.findOne({username:username});
}

async function updateHeadline(username,newMessage) {
    return User.updateOne({username:username},{message:newMessage},{new:true})
}
async function getUser(username) {
    const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    // TODO: add a user to the database
    return await connector.then(async () => {
        return findUser(username);
    });
}

async function updateUser(username,newMessage) {
    const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    // TODO: add a user to the database
    return await connector.then(async () => {
        return updateHeadline(username,newMessage);
    });
}


async function getUserHeadline(req, res) {
    let username = req.params.user
    let msg;
    if(username!=null) {
        let user = await getUser(username);
        msg = {username: username, headline: user.message}
    }
    else{
        let user = await getUser(req.username.username);
        msg = {username: req.username.username, headline: user.message}
    }
    res.send(msg)
}

async function addHeadline(req, res) {
    let username = req.username.username;
    let newMessage = req.body.headline;
    let updateHeadline = await updateUser(username,newMessage);
    let updatedUser = await getUser(username);
    let msg = {username: username, headline: updatedUser.message}
    res.send(msg)

}

function getUserEmail(req,res) {

    let username = req.params.user;

    let user = profile;

    //returns the email id of the user
    res.send({username: user.username,email:user.email})
}

function updateUserEmail(req,res) {

    //get the email address from the request body.
    let newEmail = req.body.email;

    //Suppose newEmail = abc@123.

    newEmail = 'abc@123';

    //Get the current loggedIn user.
    let username = req.username.username;

    //Suppose current user is profile as specified above.

    let user = profile;

    user.email = newEmail

    //Update the newEmail id for the user.

    res.send({ username: user.username, email: user.email })

}

function getUserZipCode(req,res) {

    let username = req.params.user;

    let user = profile;

    //returns the zipcode of the user
    res.send({username: user.username,zipcode:user.zipcode})
}

function updateUserZipCode(req,res) {

    //get the zipcode address from the request body.

    let newZipCode = req.body.zipcode;

    //Suppose newZipCode = 77005.

    newZipCode = 77005;

    //Get the current loggedIn user.
    let username = req.username.username;

    //Suppose current user is profile as specified above.

    let user = profile;

    user.zipcode = newZipCode;

    //Update the ZipCode for the user.

    res.send({ username: user.username, zipcode: user.zipcode })

}

function getUserDob(req,res) {

    let username = req.params.user;

    let user = profile;

    //returns the DOB of the user
    res.send({username: user.username,dob:user.dob})
}

function getUserAvatar(req,res) {

    let username = req.params.user;

    let user = profile;

    //returns the avatar of the user
    res.send({username: user.username,avatar:user.avatar})
}

function updateUserAvatar(req,res) {
    //get the avatar link from the request body.

    let newAvatar = req.body.avatar;

    //Suppose we have new avatar link.

    newAvatar = 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F565082841%2F960x0.jpg%3Ffit%3Dscale';

    //Get the current loggedIn user.
    let username = req.username.username;

    //Suppose current user is profile as specified above.

    let user = profile;

    user.avatar = newAvatar;

    //Update the avatar for the user.

    res.send({ username: user.username, avatar: user.avatar })
}

function getUserFollowers(req,res) {
    let username = req.params.user;

    let user = profile;

    //returns the avatar of the user
    res.send({username: user.username,following:user.following})
}

function addUserFollowers(req,res) {

    //get the newFollower username from the request parameters.

    let newFollower = req.params.user;

    //Suppose we have new user to follow as below.

    newFollower = 'James';

    //Get the current loggedIn user.
    let username = req.username.username;

    //Suppose current user is profile as specified above.

    let user = profile;

    //Update the list of followers for the user.

    user.following = ['rat','bat','cat','mat',newFollower];



    res.send({ username: user.username, following: user.following })

}

function removeUserFollowers(req,res) {
    //get the follower username from the request parameters.

    let removeFollower = req.params.user;

    //Suppose we have username of follower to remove as below.

    removeFollower = 'cat';

    //Get the current loggedIn user.
    let username = req.username.username;

    //Suppose current user is profile as specified above.

    let user = profile;

    //Update the list of followers for the user.

    user.following = ['rat','bat','mat'];

    res.send({ username: user.username, following: user.following })
}

module.exports = (app) => {
    auth(app);
    app.get('/headline/:user?', getUserHeadline);
    app.put('/headline',addHeadline);
    app.get('/email/:user?',getUserEmail);
    app.put('/email',updateUserEmail);
    app.get('/zipcode/:user?',getUserZipCode);
    app.put('/zipcode',updateUserZipCode);
    app.get('/avatar/:user?',getUserAvatar);
    app.put('/avatar',updateUserAvatar);
    app.get('/dob/:user?',getUserDob);
    app.get('/following/:user?',getUserFollowers);
    app.put('/following/:user',addUserFollowers);
    app.delete('/following/:user',removeUserFollowers);
}