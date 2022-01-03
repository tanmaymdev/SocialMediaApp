/*
 * Test suite for articls.
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;
let numberOfArticles;
describe('Validate Articles Update -->', () => {

    it('login user', (done) => {
        let loginUser = {username: 'testUser', password: '123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            //console.log(cookie);
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });
    it('Get User Articles', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','cookie':cookie },
        }).then(res => {
            //console.log(res)
            numberOfArticles = res.length
            return res.json()
        }).then(res => {
            expect(res.length).toEqual(0);
            //expect(res.headline).toEqual('Happy');
            done();
        });
    });
    it('Add Article to user', (done) => {
        let newArticle = {text:'New Post Test Text'}
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','cookie':cookie },
            body: JSON.stringify(newArticle)
        }).then(res => {
            //console.log(res.json())
            return res.json()
        }).then(res => {
            //console.log(res)
            expect(res[0].text).toEqual('New Post Test Text');
            expect(res.length).toEqual(1);
            done();
        });
    });
    it('get article of particular post id', (done) => {
        fetch(url('/articles/1'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','cookie':cookie },
        }).then(res => {
            //console.log(res)
            return res.json()
        }).then(res => {
            expect(res[0].pid).toEqual(1);
            //expect(res.headline).toEqual('Happy');
            done();
        });
    });
    it('get articles of loggedIn user', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','cookie':cookie },
        }).then(res => {
            return res.json()
        }).then(res => {
            expect(res[0].auth).toEqual('testUser');
            //expect(res.headline).toEqual('');
            done();
        });
    });
    it('Update article of user if article belongs to user', (done) => {
        let newText = {text:'New Post Test Text'}
        fetch(url('/articles/1'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json','cookie':cookie },
            body: JSON.stringify(newText)
        }).then(res => {
            //console.log(res)
            return res.json()
        }).then(res => {
            for(let i=0; i < res.length ; i++)
            {
                if(res[i].pid === 1)
                {
                    expect(res[i].auth).toEqual('testUser');
                    expect(res[i].text).toEqual('New Post Test Text');
                }
            }
            done();
        });
    });
});