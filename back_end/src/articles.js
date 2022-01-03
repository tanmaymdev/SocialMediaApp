const md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema.js');
const userLoginSchema = require('./userLoginSchema')
const articleSchema = require('./articleSchema')
const commentSchema = require('./commentSchema')
const User = mongoose.model('user', userSchema,'user');
const UserLogin = mongoose.model('userLogin',userLoginSchema,'userLogin');
const article= mongoose.model('article',articleSchema,'article')
const connectionString = "mongodb+srv://tm67:Tm.2707216@cluster0.vlqxt.mongodb.net/parliament?retryWrites=true&w=majority"
const comment = mongoose.model('comment',commentSchema,'comment');
const auth = require('./auth');

async function createArticle(username,text) {
    return new article({
        auth:username,
        text : text,
        date: Date.now(),
        comments : []
    }).save()
}

async function createComment(username,text) {
    return new comment({
        owner:username,
        text : text
    }).save()
}

async function addArticle(req, res) {
    let article;
    let text = req.body.text;
    let image = req.body.image;
    let username = req.username.username;

    // supply username and password
    if (!text) {
        return res.sendStatus(400);
    }
    await (async () => {
        const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
        // TODO: add a user to the database
        await (connector.then(async () => {
            article = await createArticle(username, text)
        }));
    })();

    let allArticles = await getArticlesByUsername(username);
    res.send(allArticles);
}

async function findArticlesByUsername(username) {
    const query = { auth: username };
    return article.find(query)
}

async function findArticlesById(id) {
    const query = { pid: id };
    return article.find(query)
}

async function findCommentById(id) {
    const query = { commentId: id };
    return comment.find(query)
}
async function getArticlesByUsername(username) {
    const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    // TODO: add a user to the database
    return await connector.then(async () => {
        return findArticlesByUsername(username);
    });
}

async function getArticlesById(id) {
    const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    // TODO: add a user to the database
    return await connector.then(async () => {
        return findArticlesById(id);
    });
}

function findUserFollowers(username) {
    const query = { username: username };
    return User.find(query)
}

async function getUserFollowers(username) {
    const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    // TODO: add a user to the database
    return await connector.then(async () => {
        return findUserFollowers(username);
    });
}

async function updateArticle(id,text) {
    return article.updateOne({pid:id},{text:text},{new:true})
}

async function updateComment(pid,id,text) {
    // let article = findArticlesById(pid);
    // let comments = article.comments;
    // return comment.updateOne({commentId:id},{text:text},{new:true})
    return article.updateOne(
        { pid: pid, "comments.commentId": id },
        {
            $set: {
                "comments.$.text": text,
            }
        }
    )
}
async function updateArticleWithComment(id,comment) {
    //return article.updateOne({pid:id},{comment:comment},{new:true})
    return article.findOneAndUpdate(
        { pid: id },
        { $push: { comments: comment} },
        {new:true});
}

async function getUserArticles(req, res) {
    let username = req.username.username;
    let user = await getUserFollowers(username);
    let userFollowers = user[0].followers;
    let id = req.params.id;
    let articlesToShow = [];
    if(!id)
    {
        console.log("Inside without Id If")
        let articlesByUsername = await getArticlesByUsername(username);
        articlesToShow.push(articlesByUsername)
        for(let i=0 ; i< userFollowers.length;i++)
        {
            let articlesByUserFollower = await getArticlesByUsername(userFollowers[i]);
            articlesToShow.push(articlesByUserFollower);
        }
    }
    else {
        let articlesByUsername = await getArticlesByUsername(id);
        if(articlesByUsername.length!=0) {
            articlesToShow.push(articlesByUsername)
        }
        else {
            let articlesById = await getArticlesById(id);
            if (articlesById.length != 0) {
                articlesToShow = articlesById
            }
        }
    }
    res.send(articlesToShow)
}

async function updateUserArticle(req, res) {
    let id = req.params.id;
    let username = req.username.username;
    let text = req.body.text;
    let commentId = req.body.commentId;
    let user = await getUserFollowers(username);
    //console.log(user)
    let userFollowers = user[0].followers;
    //let userFollowers = req.username.followers;
    console.log(id);
    console.log(text);
    console.log(commentId);
    let article = await getArticlesById(id);
    if (!text) {
        return res.sendStatus(400);
    }
    else {
        if (!commentId) {
            console.log("Updating Article")
            if (article[0].auth === username) {
                let updatedArticle = await updateArticle(id, text);
            } else {
                res.sendStatus(405)
            }
        } else {
            //console.log("Updating Comment")
            if (commentId == -1) {
               // console.log("Updating Comment")
                let addComment = await createComment(username, text);
                let updatedArticle = await updateArticleWithComment(id, addComment);
            }
            else{
                let getComment = await findCommentById(commentId);
                console.log("Below is what we get from getComment")
                console.log(getComment);
                if(getComment[0].owner === username){
                    console.log("Entering update Comment")
                    let getUpdatedComment = await updateComment(id,commentId,text);
                    console.log("Below is what we get from getUpdatedComment")
                    console.log(getUpdatedComment);
                }
            }
        }
        let articlesByUsername = await getArticlesByUsername(username);
        let articlesToShow =[];
        articlesToShow.push(articlesByUsername)
        for(let i=0 ; i< userFollowers.length;i++)
        {
            let articlesByUserFollower = await getArticlesByUsername(userFollowers[i]);
            articlesToShow.push(articlesByUserFollower);
        }
        res.send(articlesToShow);
    }
}

module.exports = (app) => {
    auth(app);
    app.post('/article',addArticle);
    app.get('/articles/:id?',getUserArticles)
    app.put('/articles/:id',updateUserArticle)
}