const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./src/auth');
const profile = require('./src/profile')
const articles = require('./src/articles')

// let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
//     { id: 1, author: 'Jack', body: 'Post 2' },
//     { id: 2, author: 'Zack', body: 'Post 3' }];

const hello = (req, res) => res.send({ hello: 'world' });

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', hello);
auth(app);
profile(app);
articles(app);

// Get the port from the environment, i.e., Heroku sets it

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});

