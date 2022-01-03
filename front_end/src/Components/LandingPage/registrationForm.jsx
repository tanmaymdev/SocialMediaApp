import React from "react";
import {MDBRow, MDBCol,MDBInput} from "mdbreact";
import {Redirect} from "react-router-dom";
import axios from 'axios';
class FormsPage extends React.Component {
    state = {
        fname: "",
        username: "",
        email: "",
        zip: "",
        confirmpassword:"",
        isLoggedIn:false
    };
    constructor(props) {
        super(props);
        this.state = {value: ''};

    }
    submitHandler = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        this.signIn()

    };

    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value });

    };
    signIn = () => {
        this.checkAge();
        this.checkpassword();
        console.log(this.state)
        if(this.state.name != null && this.state.username != null && this.state.password != null && this.state.zip != null && this.state.phone != null && this.state.age != null && this.state.email != null) {
            axios.post('https://parliament-backend.herokuapp.com/register', {
                username: this.state.username,
                password: this.state.password,
                email : this.state.email,
                dob : this.state.age,
                zipcode : this.state.zip
            }).then((res) => {
                    console.log(this.state.username)
                    console.log(this.state.password)
                    if (res.data.result === "success") {

                        axios.post('https://parliament-backend.herokuapp.com/login', {
                                username: this.state.username,
                                password: this.state.password
                            },
                            {withCredentials: true})
                            .then((res) => {
                                    const result = res.data;
                                    console.log(result)
                                    if (result.result === 'success') {
                                        localStorage.setItem("token", "loggedIn")
                                        this.setState({isLoggedIn: true})
                                        console.log(document.cookie)
                                    }
                                },
                                (error) => {
                                    console.log(error);
                                });
                    }
                }
               , (error) => {
                console.log(error);
            });


        }

    }
    userLogIn = () => {
        console.log(this.state.username)
        console.log(this.state.password)
        axios.post('https://parliament-backend.herokuapp.com/login', {
            username: this.state.username,
            password: this.state.password },
            {withCredentials: true})
            .then((res) =>{
                const result = res.data;
                console.log(result)
                if (result.result === 'success') {
                    localStorage.setItem("token", "loggedIn")
                    this.setState({isLoggedIn: true})
                    console.log(document.cookie)
                }
                },
                (error) => {
                console.log(error);
            });
    }

   checkAge = () =>
    {
        let currDate = new Date();
        let dob = document.getElementById("defaultFormRegisterDOB");
        //let dob = this.state.age
        let dateOfBirth=new Date(dob.value);
        let difference=currDate-dateOfBirth;
        let age=new Date(difference);
        let ageByYear=age.getFullYear()-1970;
        if(ageByYear<18)
        {
            dob.setCustomValidity("Sorry!! You Need to be 18 years or older to register");
        }
        else{
            dob.setCustomValidity("");
        }
    }
    checkpassword = () => {
        //let password = document.getElementById("defaultFormRegisterPassword");
        let conpassword = document.getElementById("defaultFormRegisterConfirmPassword");
        if (this.state.password === this.state.confirmpassword) {

        } else {
            conpassword.setCustomValidity("Passwords Don't Match");
        }
    }
   checkUsername = () =>
    {
        let user = document.getElementById("username");
        let userf=user.value.toString()[0];
        let userfb=user.value.toString().substring(1,user.value.toString().length)
        if(userf.match('[0-9]')){
            user.setCustomValidity("User Name Cannot begin with number");
        }
        else if (!(userfb.match(/^[a-zA-Z0-9]+$/)))
        {
            user.setCustomValidity("User Name cannot contain Symbols, Only Alphanumerics allowed");
        }
        else
        {
            user.setCustomValidity("");
        }
    }
    render() {

        return(

            <div>
                {this.state.isLoggedIn ? <Redirect
                    to={{
                        pathname: "/MainPage",
                        state: { property_id: this.state.name, property_id1 : this.state.username , property_id2:11 , property_id3:"I'm new here looking for Friends" , property_id4:this.props.userDetails , property_id5:this.props.posts , property_id8: this.state.zipcode,property_id9: this.state.email , property_id10:this.state.password}
                    }}
                /> :null }
                <div id="RegisterHeading">
                    <h3 className="white-text">Register</h3>
                </div>
                <form
                    className="needs-validation"
                    onSubmit={this.submitHandler}
                    noValidate
                    id="registrationForm"
                >
                    <MDBRow>
                        <MDBCol md="6">
                            <label htmlFor="defaultFormRegisterName" className="white-text">
                                Name :
                            </label>
                            <input value={this.state.name} name="name" onChange={this.changeHandler} type="text" id="defaultFormRegisterName" className="form-control" placeholder="Please Enter Your Full Name" required/>
                            <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                        <MDBCol md="5">
                            <label htmlFor="defaultFormRegisterUserName" className="white-text">
                                User Name:
                            </label>
                            <input value={this.state.username} name="username" onChange={this.changeHandler} type="text" id="defaultFormRegisterUserName" className="form-control" placeholder="Enter User Name" required size="sm"/>
                            <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                    </MDBRow>
                <MDBRow>
                        <MDBCol md="6">
                            <label htmlFor="defaultFormRegisterEmail" className="white-text">
                                Email
                            </label>
                            <input value={this.state.email} onChange={this.changeHandler} type="email" id="defaultFormRegisterEmail" className="form-control" name="email" placeholder="Your Email address" required/>
                            <small id="emailHelp" className="form-text white-text">
                                We'll never share your email with anyone else.
                            </small>
                            <div className="invalid-feedback white-text">
                                Please provide a valid email.Ex.abc@gef.ghi
                            </div>
                            <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                        <MDBCol md="5">
                        <label htmlFor="defaultFormRegisterPhone" className="white-text">
                            Phone
                        </label>
                        <input value={this.state.phone} onChange={this.changeHandler} type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"  id="defaultFormRegisterPhone" className="form-control" name="phone" placeholder="123-123-1234" required/>
                        <div className="invalid-feedback">
                            Please provide a valid Phone Number.Format 123-123-1234
                        </div>
                        <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="6">
                            <label htmlFor="defaultFormRegisterZip" className="white-text">
                                Zip Code
                            </label>
                            <input value={this.state.zip} onChange={this.changeHandler} type="text" id="defaultFormRegisterZip" className="form-control" name="zip" placeholder="Zip" pattern="[0-9]{5}" required/>
                            <div className="invalid-feedback">
                                Please provide a valid 5 Digit zip.
                            </div>
                            <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                        <MDBCol md="5">
                            <label htmlFor="defaultFormRegisterDOB" className="white-text">
                                Date of Birth
                            </label>
                            <input value={this.state.age} onChange={this.changeHandler} type="date" id="defaultFormRegisterDOB" className="form-control" name="age" placeholder="Zip" required/>
                            <div className="invalid-feedback">
                                You Need to older than 18 years
                            </div>
                            <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                    </MDBRow>
                <MDBRow>
                        <MDBCol md="6">
                            <label htmlFor="defaultFormRegisterPasswordEx4" className="white-text">
                                Password :
                            </label>
                            <input value={this.state.password} onChange={this.changeHandler} type="password" id="defaultFormRegisterPassword" className="form-control" name="password" placeholder="Please create a Password" required/>
                            <div className="invalid-feedback">
                                Please provide a valid password.
                            </div>
                            <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                        <MDBCol md="5">
                            <label htmlFor="defaultFormRegisterConfirmPassword" className="white-text">
                               Confirm Password :
                            </label>
                            <input value={this.state.confirmpassword} onChange={this.changeHandler} type="password" id="defaultFormRegisterConfirmPassword" className="form-control" name="confirmpassword" placeholder="Please re-enter Password" pattern={this.state.password} required/>
                            <div className="invalid-feedback">
                                Passwords don't match
                            </div>
                            <div className="valid-feedback">Looks good!</div>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                    <MDBCol md="4">
                        <div className="custom-control custom-checkbox white-text" >
                            <input className="custom-control-input" type="checkbox" value="" id="invalidCheck" required/>
                            <label className="custom-control-label" htmlFor="invalidCheck">
                                Agree to terms and conditions
                            </label>
                            <div className="invalid-feedback">
                                You must agree before submitting.
                            </div>
                        </div>
                    </MDBCol>
                        <MDBCol md="7">
                        <MDBInput color="primary" type="submit" value="Register and Sign In" className="white-text" >
                        </MDBInput>
                        </MDBCol>
                    </MDBRow>
                </form>
            </div>
        );
    }
}

export default FormsPage;
