import React from "react";
import axios from 'axios';
import {Redirect} from "react-router-dom";


class AuthLandingPage extends React.Component {
    state = {
        userName: "",
        password: "",
    };
    constructor(props) {
        super(props);
        this.state = {value: ''};

    }
    componentDidMount() {
        let userDetails = (this.props.match.params.id).split('@');
        axios.post('https://parliament-backend.herokuapp.com/register', {
            username: userDetails[0],
            auth:'google'
        }, {withCredentials: true})
            .then((res) => {

                if (res.data.type==='linked') {
                    axios.post('https://parliament-backend.herokuapp.com/login', {
                        username: res.data.username,
                        type:'linked'
                    }, {withCredentials: true}).then((res) => {
                        console.log("Inside the exisiting user If:"+res.data)
                        if (res.data.result === 'success') {
                            localStorage.setItem("token", "loggedIn")
                            this.setState({isLoggedIn: true})
                            console.log(document.cookie)
                        }
                    })
                } else {
                    axios.post('https://parliament-backend.herokuapp.com/login', {
                        username: userDetails[0],
                        password: "",
                        type: 'google'
                    }, {withCredentials: true}).then((res) => {
                        console.log("Inside the not exisiting user else:"+res.data.result)
                        if (res.data.result === 'success') {
                            localStorage.setItem("token", "loggedIn")
                            this.setState({isLoggedIn: true})
                            console.log(document.cookie)
                        }
                    })
                }
            }, (error) => {
                console.log(error);
            });
    }

    googleLogin = () => {
        axios.post('https://parliament-backend.herokuapp.com/register', {
            username: this.props.match.params.id
        }, {withCredentials: true})
            .then((res) => {
                console.log(document.cookie)
                console.log(res);
                const result = res.data;
                axios.post('https://parliament-backend.herokuapp.com/login', {
                    username:this.props.match.params.id,
                    password:"",
                    type:'google'
                }, {withCredentials: true}).then((res)=>{

                    if(result.result==='success'){
                        localStorage.setItem("token","loggedIn")
                        this.setState({ isLoggedIn:true})
                        console.log(document.cookie)
                    }
                })
                //this.setState({ persons });
                //console.log(persons)
                console.log(res)
            }, (error) => {
                console.log(error);
            });
    }
    render() {

        return(
            <div className="row">
                <div className="col-md-1">
                Welcome to Parliament
                    {this.state.isLoggedIn ?<Redirect
                        to={{
                            pathname: "/MainPage",
                        }}
                    /> : null}
                </div>
            </div>

        );
    }
}

export default AuthLandingPage;
