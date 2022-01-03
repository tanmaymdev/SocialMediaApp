import React from "react";
import {MDBRow, MDBCol, MDBIcon,MDBInput, MDBCard, MDBCardBody, MDBCardText} from "mdbreact";
import {Link} from "react-router-dom";
import axios from 'axios';
import {Redirect} from "react-router-dom";

export class ProfilePage extends React.Component {
    state = {
        persons: [],
        ready:false,
        isLoggedIn:false,
        isLinked:false,
        unlinkedSuccessfully:false
    }
    constructor(props) {
        super(props);
        this.state = {value: ''};

    }
    componentDidMount() {
        axios.get('https://parliament-backend.herokuapp.com/linking',{withCredentials:true})
            .then((res) => {
                console.log(res.data)
                if(res.data.result===false) {
                    this.setState({
                        isLinked: false
                    })
                }
                else{
                    this.setState({
                        isLinked: true
                    })
                }
            },(error) =>{
            console.log(error)
        });
        axios.get('https://parliament-backend.herokuapp.com/email',{withCredentials:true})
            .then((res) => {
                this.setState({ username:res.data.username,
                    curremail:res.data.email});
                axios.get('https://parliament-backend.herokuapp.com/zipcode',{withCredentials:true})
                    .then((res) => {
                        this.setState({currzipcode:res.data.zipcode,currpassword:"********"});
                        axios.get('https://parliament-backend.herokuapp.com/avatar',{withCredentials:true})
                            .then((res) => {
                                console.log(res.data)
                                console.log(res.data.avatar)
                                var myName = res.data.avatar;
                                console.log('"' + myName + '"');
                                this.setState({picture:res.data.avatar,currpassword:"********",ready:true });
                            }, (error) => {
                                console.log(error);
                            });
                    }, (error) => {
                        console.log(error);
                    });
            }, (error) => {
                console.log(error);
            });
    }

    submitHandler = event => {
        //Done for testing purpose
        event.preventDefault();
        // event.target.className += " was-validated";
        this.checkIfUpdate();
    };

    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    changeHandlerLinking = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    submitHandlerLinking = event => {
        //Done for testing purpose
        event.preventDefault();
        // event.target.className += " was-validated";
        axios.post('https://parliament-backend.herokuapp.com/linking', {
            username:this.state.userName,
            password:this.state.password,
            linkusername:this.state.username
        }, {withCredentials: true}).then((res)=>{

            console.log(res.data);
            if(res.data.result==='success'){

                console.log("accounts linked")
                axios.post('https://parliament-backend.herokuapp.com/login', {
                    username:this.state.userName,
                    password:this.state.password
                }, {withCredentials: true}).then((res)=>{
                    console.log("redirecting to main page")
                    if(res.data.result==='success'){
                        localStorage.setItem("token","loggedIn")
                        this.setState({ isLoggedIn:true})
                        console.log(document.cookie)
                    }
                })
                //localStorage.setItem("token","loggedIn")
                //this.setState({ isLoggedIn:true})
                //console.log(document.cookie)
            }
        })
    };

  passwordCoder = (pass) =>{
        var s="";
        for (let k=0;k<pass.length;k++)
        {
            s+='*';
        }
        return s;
    }
    checkIfUpdate = () => {
        console.log(this.state)
        console.log("Inside Update Function");
        if (this.state.curremail !== this.state.email && this.state.email !== undefined && /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(this.state.email))
        {
            //document.getElementById("email").innerHTML = "Email : " + this.state.email
            axios.put('https://parliament-backend.herokuapp.com/email',{email:this.state.email},{withCredentials:true})
                .then((res) => {
                    this.setState({curremail:res.data.email});
                }, (error) => {
                    console.log(error);
                });

        }
        if (this.state.currzipcode !== this.state.zipCode && this.state.zipCode !== undefined && /^[0-9]{5}$/.test(this.state.zipCode) && this.state.zipCode.length===5 )
        {
            //document.getElementById("zipcode").innerHTML = "Zip Code : " + this.state.zipCode
            axios.put('https://parliament-backend.herokuapp.com/zipcode',{zipcode:this.state.zipCode},{withCredentials:true})
                .then((res) => {
                    this.setState({ currzipcode:res.data.zipcode});
                }, (error) => {
                    console.log(error);
                });
        }
        if (this.state.currpassword !== this.state.password && this.state.password !== undefined && this.checkpassword())
        {
            //document.getElementById("password").innerHTML = "Password is : " + this.passwordCoder(this.state.password)
            axios.put('https://parliament-backend.herokuapp.com/password',{password:this.state.password},{withCredentials:true})
                .then((res) => {
                    // this.setState({ currzipcode:res.data.zipcode});
                    console.log("password updated")
                }, (error) => {
                    console.log(error);
                });
        }
    }
    logoutUser = () =>{
      localStorage.setItem("token","");
      axios.put('https://parliament-backend.herokuapp.com/logout',{user:this.state.userName},{withCredentials:true})
            .then((res) => {
                console.log(res)
            }, (error) => {
                console.log(error);
            });
    }

    checkpassword = () => {
        let password = document.getElementById("newpassword");
        let conpassword = document.getElementById("connewpassword");
        if (password.value === conpassword.value) {
            console.log("Password matches");
            return true;
        }
        else {
            conpassword.setCustomValidity("Passwords Don't Match");
            password.setCustomValidity("Passwords Don't Match");
            return false
        }

    }
    unLinkAccount =()=>{
        axios.post("https://parliament-backend.herokuapp.com/unlink",{username:this.state.username},{withCredentials:true})
            .then((res) => {
                this.setState({
                    unlinkedSuccessfully:true
                })
                //console.log(res.data);
            })
  }
    handleImageChange =(event)=>{
        event.preventDefault();
      console.log(event.target.files[0]);
        const fd = new FormData()
        //fd.append('text', message)
        fd.append("image", event.target.files[0])
        axios.put("https://parliament-backend.herokuapp.com/avatar",fd,{withCredentials:true})
            .then((res) => {
                console.log(res)
                axios.get('https://parliament-backend.herokuapp.com/avatar',{withCredentials:true})
                    .then((res) => {
                        console.log(res.data)
                        console.log(res.data.avatar)
                        var myName = res.data.avatar;
                        console.log('"' + myName + '"');
                        this.setState({picture:res.data.avatar});
                    }, (error) => {
                        console.log(error);
                    });
            }, (error) => {
                console.log(error);
            });
    }

    render() {

        return(
           <div id="profilePage">
               <div></div>
               <br/>
               {this.state.ready ?
                   <div className="row">
                       <div className="col-md-1"></div>
                       <div className="col-md-4" id="userCard">
                           <MDBCard style={{ width: "22rem"}}>
                               <img className="img-fluid" src={String(this.state.picture)} alt={"User avatar"}/>
                               <br/>
                               <div className="input-group">
                                   <div className="custom-file">
                                       <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" accept="image/*" onChange={this.handleImageChange}/>
                                       <label className="custom-file-label" htmlFor="inputGroupFile01">
                                        Choose file
                                       </label>
                                   </div>
                               </div>
                               <MDBCardBody>
                                   <MDBCardText id="email">Email : {this.state.curremail}</MDBCardText>
                                   <MDBCardText id="zipcode">ZipCode : {this.state.currzipcode}</MDBCardText>
                                   <MDBCardText id="phone">Phone Number : {this.state.currphone}</MDBCardText>
                                   <MDBCardText id="password">Password:{this.state.currpassword}</MDBCardText>
                                   <h4><MDBIcon fab icon="microsoft" /><Link to={{pathname: "/MainPage"}}><strong> Main Page </strong></Link></h4>
                                   <br/>
                                   <br/>
                                   <h6><MDBIcon icon="sign-out-alt" /><a id="logoutBtn" onClick={this.logoutUser} href={"/"}>Logout</a></h6>
                               </MDBCardBody>
                           </MDBCard>
                       </div>
                       <div className="col-md-4" id="userUpdates">
                           <form id="profileform" className="needs-validation" onSubmit={this.submitHandler} noValidate>
                               <MDBRow>
                                       <label htmlFor="defaultFormRegisterEmailEx2" className="white-text">
                                         Update  Zip Code
                                       </label>
                                       <input value={this.state.zipcode} name="zipCode" onChange={this.changeHandler} type="text" id="defaultFormRegisterEmailEx2" pattern="[0-9]{5}" className="form-control" placeholder="Enter New ZipCode"/>
                                       <div className="invalid-feedback">
                                           Please provide a valid 5 Digit zipCode
                                       </div>
                                       <div className="valid-feedback">Looks good!</div>
                               </MDBRow>
                               <MDBRow>
                                       <label htmlFor="defaultFormRegisterConfirmEx3" className="white-text">
                                         Update  Email
                                       </label>
                                       <input value={this.state.email} onChange={this.changeHandler} type="email" id="defaultFormRegisterConfirmEx3" className="form-control" name="email" placeholder="Enter New Email address"/>
                                       <small id="emailHelp" className="form-text white-text">
                                           We'll never share your email with anyone else.
                                       </small>
                                       <div className="invalid-feedback">
                                           Please provide a valid email address in Format abc@efg.hij
                                       </div>
                                       <div className="valid-feedback">Looks good!</div>
                               </MDBRow>
                               <MDBRow>
                                       <label htmlFor="newpassword" className="white-text">
                                        Update Password
                                       </label>
                                       <input value={this.state.password} onChange={this.changeHandler} type="password" id="newpassword" className="form-control" name="password" placeholder="Enter New Password"/>
                               </MDBRow>
                               <MDBRow>
                                       <label htmlFor="connewpassword" className="white-text">
                                           Confirm Password
                                       </label>
                                       <input value={this.state.conpassword} onChange={this.changeHandler} type="password" id="connewpassword" className="form-control" name="conpassword" placeholder="Enter New Password"/>
                                       <div className="invalid-feedback">
                                           Passwords Don't Match
                                       </div>
                                       <div className="valid-feedback">Looks good!</div>
                               </MDBRow>
                               <MDBInput className="white-text" color="primary" type="submit" value="Update">

                               </MDBInput>
                           </form>
                       </div>
                       {this.state.isLinked ?
                           <div className="col-md-3">
                               <MDBInput className="white-text" icon="unlink" onIconClick={this.unLinkAccount}/>
                               <h3 className="white-text">Un-Link Google Account</h3>
                               <br/>
                               {this.state.unlinkedSuccessfully ? <i className="white-text">Account Unlinked Successfully </i> :null}
                           </div>
                           : 
                           <div className="col-md-3">
                                <h4 className="white-text"><MDBIcon icon="link" /> Link User Account </h4>
                               <form
                           id="SignInForm"
                           className="needs-validation"
                           onSubmit={this.submitHandlerLinking}
                           noValidate>
                               <label htmlFor="signInUserName" className="white-text">
                                   User Name :
                               </label>
                               <input value={this.state.userName} name="userName" onChange={this.changeHandlerLinking} type="text" id="signInUserName" className="form-control" placeholder="User name" required width={40}/>
                               <div className="invalid-feedback">
                                   User Not Found, Wanna Register?
                               </div>
                               <div className="valid-feedback">Looks good!</div>
                               <label htmlFor="signInPassword" className="white-text">
                                   Password
                               </label>
                               <input value={this.state.password} name="password" onChange={this.changeHandlerLinking} type="password" id="signInPassword" className="form-control" placeholder="Password" required width={40}/>
                               <div className="invalid-feedback">
                                   Incorrect Password (Check if Caps On!)
                               </div>
                               <div className="valid-feedback">Looks good!</div>
                       <MDBCol md="3"></MDBCol>
                                   <MDBCol md="7">
                           <MDBInput className="white-text" id="signInButton" color="primary" type="submit" value="Sign In">
                               <div className="invalid-feedback">
                                   Try Again
                               </div>
                               <div className="valid-feedback">Looks good!</div>
                           </MDBInput>
                       </MDBCol>
                   </form>
                   </div>}
                   {this.state.isLoggedIn ?<Redirect
                       to={{
                           pathname: "/MainPage",
                       }}
                   /> : null}
            </div>  : null}
           </div>

        );
    }
}