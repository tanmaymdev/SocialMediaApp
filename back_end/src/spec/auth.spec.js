/*
 * Test suite for auth.
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;
describe('Validate auth.js', () => {

    it('register new user', (done) => {
        let regUser = { username:'testUser', email:'abc@123', dob:12-12-1998, zipcode:77005, password:'123'};
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            return res.json()}
        ).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('login user', (done) => {
        let loginUser = {username: 'testUser', password: '123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            console.log(cookie);
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });
    it('logout user', (done) => {
        //let loginUser = {username: 'test4', password: '123'};
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json','cookie':cookie },
            //body: JSON.stringify(loginUser)
        }).then(res => {

            return res
        }).then(res => {
            expect(res.statusText).toEqual('OK');
            //expect(res.result).toEqual('success');
            done();
        });
    });

});