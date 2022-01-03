import React from "react";
import {MDBRow, MDBCol,MDBInput,MDBIcon} from "mdbreact";
import {Redirect} from "react-router-dom";
import axios from 'axios';
export class SignIn extends React.Component {

    state = {
        userName: "",
        password: "",
        isLoggedIn: false
    };
    constructor(props) {
        super(props);
        this.state = {value: ''};

    }
    submitHandler = event => {
        //Done for Testing Purpose
        event.preventDefault();
        event.target.className += " was-validated";
        console.log(this.state);
        this.checkPassword();
    };
    componentDidMount() {
        this.setState({
            isLoggedIn:false
        })
    }

    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    checkPassword = () => {
        let usernameComponent = document.getElementById("signInUserName")
        let passwordComponent = document.getElementById("signInPassword")
        let signInButton = document.getElementById("signInButton")
        // // console.log("These are the userDetails"+ this.props.userDetails);
        // // console.log("This is value of show" + this.state.show)
        // console.log(this.state.userName)
        // console.log(this.props.userDetails)
        axios.post('https://parliament-backend.herokuapp.com/login', {
            username: this.state.userName,
            password: this.state.password
        },{withCredentials:true})
            .then((res) => {
                console.log(document.cookie)
                console.log(res);
                const result = res.data;
                //this.setState({ persons });
                //console.log(persons)
                console.log(res)
                if(result.result==='success'){
                    localStorage.setItem("token","loggedIn")
                    this.setState({ isLoggedIn:true})
                    console.log(document.cookie)
                }
                else{
                    usernameComponent.setCustomValidity("User not Found");
                    passwordComponent.setCustomValidity("Incorrect Username or Password");
                    signInButton.setCustomValidity("Try Again");
                    console.log("Incorrect username or password")
                }
            }, (error) => {
                console.log(error);
            });
        // axios.post('http://127.0.0.1:3000/login',{username:'avss',password:'asdfas'})
        //     .then(res => {
        //         const result = res.data;
        //         //this.setState({ persons });
        //         //console.log(persons)
        //         console.log(res.data)
        //         if(result.result=='success'){
        //             localStorage.setItem("token","loggedIn")
        //             this.setState({ isLoggedIn:true})
        //         }
        //         else{
        //             passwordComponent.setCustomValidity("Incorrect Username or Password");
        //             signInButton.setCustomValidity("Try Again")
        //
        //         }
        //     })
        //if(re)
        // this.props.userDetails.some(person => {
        //     console.log(person.username)
        //     if(person.username===this.state.userName)
        //     {
        //         if(person.address.street===this.state.password)
        //         {
        //             console.log("Login Successful");
        //             localStorage.setItem("token","loggedIn")
        //             this.setState({
        //                 isLoggedIn:true,
        //                 userName:person.username,
        //                 user:person.name,
        //                 id:person.id,
        //                 head:person.company.catchPhrase,
        //
        //             })
        //             return true
        //         } else {
        //             passwordComponent.setCustomValidity("Incorrect Password");
        //             signInButton.setCustomValidity("Try Again")
        //             //return true
        //         }
        //
        //     }
        //     else {
        //         usernameComponent.setCustomValidity("User not Found");
        //        passwordComponent.setCustomValidity("Incorrect Password");
        //        signInButton.setCustomValidity("Try Again")
        //         //return true
        //     }
        //
        //  }
        // )

    }

    render() {

        return(

            <div>
                {this.state.isLoggedIn ?<Redirect
                    to={{
                        pathname: "/MainPage",
                        state: { property_id: this.state.userName, property_id1 : this.state.user , property_id2:this.state.id, property_id3:this.state.head , property_id4:this.props.userDetails , property_id5:this.props.posts,property_id7:this.state.isLoggedIn }
                    }}
                /> : null}
                <div id="SignInHeading">
                    <h3 className="white-text">Sign In</h3>
                </div>
                <form
                    id="SignInForm"
                    className="needs-validation"
                    onSubmit={this.submitHandler}
                    noValidate>

                    <MDBRow>
                        <MDBCol md="6">

                            <label htmlFor="signInUserName" className="white-text">
                                User Name :
                            </label>
                            <input value={this.state.userName} name="userName" onChange={this.changeHandler} type="text" id="signInUserName" className="form-control" placeholder="User name" required width={40}/>
                            <div className="invalid-feedback">
                                User Not Found, Wanna Register?
                            </div>
                            <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                        <MDBCol md="6">
                            <label htmlFor="signInPassword" className="white-text">
                              Password
                            </label>
                            <input value={this.state.password} name="password" onChange={this.changeHandler} type="password" id="signInPassword" className="form-control" placeholder="Password" required width={40}/>
                            <div className="invalid-feedback">
                                Incorrect Password (Check if Caps On!)
                            </div>
                            <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                    <MDBCol md="3"/>
                        <MDBCol md="6">
                    <MDBInput id="signInButton" color="primary" type="submit" value="Sign In" className="white-text">
                        <div className="invalid-feedback">
                            Try Again
                        </div>
                        <div className="valid-feedback">Looks good!</div>
                    </MDBInput>
                    </MDBCol>
                    </MDBRow>
                </form>
                <h3 className="white-text">or</h3>
                <MDBRow>
                    <MDBCol md="3"></MDBCol>
                    <MDBCol md="6">
                   <h1><a href="https://parliament-backend.herokuapp.com/auth/google"><MDBIcon fab icon="google" /></a></h1>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol md="3"></MDBCol>
                    <MDBCol md="6">
                <h6 className="white-text">Sign In with Your Google Account</h6>
                    </MDBCol>
                </MDBRow>
            </div>
        );
    }
}
