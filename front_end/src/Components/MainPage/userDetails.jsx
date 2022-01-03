import React from "react";
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCol, MDBInput, MDBListGroupItem, MDBListGroup} from "mdbreact";
import {Link, Redirect} from "react-router-dom";
import {Follower} from "./Follower";
import axios from 'axios';
class UserDetails extends React.Component {
    state = {
        userName: "",
        password: "",
        user:"",
        follower1:[],
        follower2:[],
        follower3:[],
        newHeadline:"",
        ready:false,
        followers:[],
        searchFollower:""
    };
    constructor(props) {
        super(props);
        this.state = {value: ''};
    }
    whoToFollow = (value) => {

        if (value > 9) {

            let newIndex =value - 10
            console.log(newIndex)
            return (newIndex);
        }
        console.log(value)
        return value;
    }
    componentDidMount() {

        axios.get('http://127.0.0.1:3000/following',{withCredentials:true})
            .then((res) => {
                console.log(res.data.following)
                this.setState({ followers:res.data.following,});
            }, (error) => {
                console.log(error);
            });
        axios.get('http://127.0.0.1:3000/headline',{withCredentials:true})
            .then((res) => {
                    this.setState({ username:res.data.username,
                                    headline:res.data.headline,
                                    ready: true});
                }, (error) => {
                console.log(error);
            });
    }
    // removeFollower = (e) =>
    // {
    //    let followers = [...this.state.allFollower];
    //     followers = followers.filter(item => item.id!=(e.target.name))
    //    console.log(followers)
    //    this.setState({
    //        allFollower : followers
    //    })
    // }
    // changeHeadline = () =>{
    //
    //
    //     console.log("Printing state post headline update"+this.state)
    // }
    submitHandler = event => {
        event.preventDefault();
        axios.put('http://127.0.0.1:3000/headline',{ headline: this.state.newHeadline},{withCredentials:true})
            .then((res) => {
                this.setState({ headline:res.data.headline,});
            }, (error) => {
                console.log(error);
            });
    };
    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    logoutUser = () =>{
        axios.put('http://127.0.0.1:3000/logout',{user:this.state.userName},{withCredentials:true})
            .then((res) => {
                console.log(res)
            }, (error) => {
                console.log(error);
            });
       return <Redirect to={"/"}/>
    }
    removeFollower =(evt)=> {
        let followerName = evt.target.id
        console.log(followerName)
        axios.delete('http://127.0.0.1:3000/following/'+followerName,{withCredentials:true})
            .then((res) => {
                console.log(res.data.following)
                this.setState({ followers:res.data.following,});
            }, (error) => {
                console.log(error);
            });
    }
    render() {

        return(
            <div>
                <MDBCol>
                    <MDBCard style={{ width: "21rem"}}>
                        <img alt="Image not found" className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"/>
                        {this.state.ready ? <MDBCardBody>
                            <MDBCardTitle>{this.state.username}</MDBCardTitle>
                            <MDBCardText id="headline">
                               {this.state.headline}
                            </MDBCardText>
                            <div className="sm-form" size="sm">
                                <form className="needs-validation"
                                      onSubmit={this.submitHandler}
                                      noValidate>
                                    <input  value={this.state.newHeadline} name="newHeadline" onChange={this.changeHandler} type="text" id="newHeadline" className="form-control" placeholder="Enter New Headline" />
                                    <div className="text-center mt-4">
                                        <MDBInput color="indigo" type="submit" value="Click Here to confirm Update to Headline"/>
                                    </div>
                                </form>
                            </div>
                            <br/>
                            <Link to={{
                                    pathname: "/ProfilePage",
                                    state: { property_id: this.props.userName, property_id1 : this.props.user , property_id2:this.props.id, property_id3:this.state.newHeadline , property_id4:this.props.userDetails, property_id5:this.props.allUsers, property_id6:this.props.posts,property_id8: this.props.zipcode,property_id9: this.props.email , property_id10:this.props.password}

                                }}
                            ><strong>Profile</strong></Link>
                            <br/>
                            <br/>
                            <a onClick={this.logoutUser} href={"/"}>Logout</a>
                        </MDBCardBody> : null }
                    </MDBCard>
                    <br/>
                    <MDBListGroup style={{ width: "21rem" }}>
                        <MDBListGroupItem active aria-current='true'>
                            Following
                        </MDBListGroupItem>
                        {this.state.ready ?
                            <div className="Container">
                                {this.state.followers.map(item => (
                                    item ? <div>
                                    <MDBListGroupItem>
                                    <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-8.jpg" className="rounded mx-auto d-block" alt="aligment" />
                                    <br/>
                                    <p id = {item} onClick={this.removeFollower}>{item}</p>
                                    </MDBListGroupItem>
                                    </div> : null
                                    )
                                )
                                }
                                {/*{this.state.followers}*/}
                            </div> : null
                        }
                    </MDBListGroup>
                </MDBCol>

            </div>
        );
    }
}

export default UserDetails;
