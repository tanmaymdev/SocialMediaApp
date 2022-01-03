/*
 * Test suite for profile.
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;
describe('Validate Headline Update -->', () => {

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
    it('headline of logged in user', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','cookie':cookie },
        }).then(res => {
            //console.log(res)
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.headline).toEqual('');
            done();
        });
    });
    it('headline of some other user', (done) => {
        fetch(url('/headline/test2'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','cookie':cookie },
        }).then(res => {
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('test2');
            expect(res.headline).toEqual('Hello');
            done();
        });
    });
    it('Update headline of logged in user', (done) => {
        let newHeadline = {headline:'Happy'}
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json','cookie':cookie },
            body: JSON.stringify(newHeadline)
        }).then(res => {
            console.log(res)
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.headline).toEqual('Happy');
            done();
        });
    });
});