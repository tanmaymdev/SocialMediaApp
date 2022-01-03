import React from "react";
import {MDBRow,MDBInput,MDBIcon,MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCol,MDBListGroupItem, MDBListGroup,MDBMedia} from "mdbreact";
import {Link, Redirect} from "react-router-dom";
//import UserDetails from "./userDetails";
//import Posts from "./Posts";
import axios from 'axios';
var newComment;
var postToUpdate;
class MainPage extends React.Component {
    state = {
        //ready:false,
        loggedIn:false,
        newHeadline:"",
        followers:[],
        searchFollower:"",
        postsToShow:[],
        ready:false,
        ready1:false,
        editPost:"",
        editPostId:"",
        editComment:"",
        editCommentId:"",
        followerReady:false,
        searchArticleByAuthor:""
    }
    constructor(props) {
        super(props);
        this.state = {value: ''};

    }
    componentDidMount() {
        //axios call to get all the followers.
        axios.get('https://parliament-backend.herokuapp.com/following',{withCredentials:true})
            .then((res) => {
                console.log(res.data)
                this.setState({ followers:res.data.following, ready: true});
            }, (error) => {
                console.log(error);
            });
        //axios call to get the user headline.
        axios.get('https://parliament-backend.herokuapp.com/avatar',{withCredentials:true})
            .then((res) => {
                this.setState({ picture:res.data.avatar});
            }, (error) => {
                console.log(error);
            });
        axios.get('https://parliament-backend.herokuapp.com/headline',{withCredentials:true})
            .then((res) => {
                this.setState({ username:res.data.username,
                    headline:res.data.headline});
            }, (error) => {
                console.log(error);
            });
        //axios call to get user posts.
        axios.get('https://parliament-backend.herokuapp.com/articles',{withCredentials:true})
            .then((res) => {
                console.log(res)
                this.setState({ postsToShow:res.data.articles,ready1: true});
            }, (error) => {
                console.log(error);
            });
    }

    //Submit handler to user headline.
    submitHandler = event => {
        event.preventDefault();
        axios.put('https://parliament-backend.herokuapp.com/headline',{ headline: this.state.newHeadline},{withCredentials:true})
            .then((res) => {
                this.setState({ headline:res.data.headline,});
            }, (error) => {
                console.log(error);
            });
    };

    //Change handler to user headline.
    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    //function to logout User.
    logoutUser = () =>{
        axios.put('https://parliament-backend.herokuapp.com/logout',{user:this.state.userName},{withCredentials:true})
            .then((res) => {
                console.log(res)
            }, (error) => {
                console.log(error);
            });
        return <Redirect to={"/"}/>
    }

    //function to remove follower.
    removeFollower =(evt)=> {
        let followerName = evt.target.id
        console.log(followerName)
        axios.delete('https://parliament-backend.herokuapp.com/following/'+followerName,{withCredentials:true})
            .then((res) => {
                console.log(res.data.following)
                //this.setState({ followers:res.data.following,});
                axios.get('https://parliament-backend.herokuapp.com/articles',{withCredentials:true})
                    .then((res) => {
                        console.log(res)
                        this.setState({ postsToShow:res.data.articles,ready1: true});
                        axios.get('https://parliament-backend.herokuapp.com/following',{withCredentials:true})
                            .then((res) => {
                                console.log(res.data)
                                this.setState({ followers:res.data.following, ready: true});
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

    //function to sort the posts according date.
    sortByDate = arr => {
        console.log("Sorting")
        const sorter = (a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        //console.log(arr.sort(sorter))
        arr.sort(sorter);
    }

    //reversing to get latest first.
    correctOrder = arr =>{
        arr.reverse();
    }

    //function to handle new Post.
    onNewPost = () => {
        axios.post('https://parliament-backend.herokuapp.com/article',{text:this.state.newPost},{withCredentials:true})
            .then((res) => {
                let newposts  = res.data.articles;
                console.log("Below  is new posts after New Post")
                console.log(newposts)
                this.setState({ postsToShow:newposts});
                console.log("Below is new state of postsToShow")
                console.log(this.state.postsToShow)
            }, (error) => {
                console.log(error);
            });
        
    }
    
    newChangePost =(event)=>{

        event.preventDefault();
        console.log(event.target.files[0]);
        console.log()
        const fd = new FormData()
        fd.append('text', this.state.newPost)
        fd.append("image", event.target.files[0])
        axios.post("https://parliament-backend.herokuapp.com/article/image",fd,{withCredentials:true})
            .then((res) => {
                let newposts  = res.data.articles;
                console.log("Below  is new posts after New Post")
                console.log(newposts)
                this.setState({ postsToShow:newposts});
                console.log("Below is new state of postsToShow")
                console.log(this.state.postsToShow)
            }, (error) => {
                console.log(error);
            });


    }

    //Clearing the new post area.
    onClear = () => {
        document.getElementById("newPost").value="";
    }

    //New Post text changing state.
    addNewPost = (evt) => {

        evt.preventDefault();
        this.setState({ [evt.target.name]: evt.target.value });

    }

    //Submit handler for adding new comment.
    submitHandlerComment = (event) => {
        event.preventDefault();
        postToUpdate = postToUpdate.substring(10,postToUpdate.length)
        axios.put('https://parliament-backend.herokuapp.com/articles/'+postToUpdate,{ text: newComment, commentId : -1},{withCredentials:true})
            .then((res) => {
                let newposts  = res.data.articles;
                this.setState({ postsToShow:newposts});
            }, (error) => {
                console.log(error);
            });
    };

    //Submit handler for editing existing post.
    submitHandlerPostEdit = (event) => {
        event.preventDefault();
        postToUpdate = this.state.editPostId.substring(8,this.state.editPostId.length)
        axios.put('https://parliament-backend.herokuapp.com/articles/'+postToUpdate,{ text: this.state.editPost},{withCredentials:true})
            .then((res) => {
                let newposts  = res.data.articles;
                this.setState({ postsToShow:newposts});
            }, (error) => {
                console.log(error);
            });
    };

    //Submit handler for editing existing comment.
    submitHandlerPostCommentEdit = (event) => {
        event.preventDefault();
        let commentToUpdate = this.state.editCommentId.substring(11,this.state.editCommentId.length)
        let postToUpdate = this.state.editPostId.substring(11,this.state.editPostId.length)
        axios.put('https://parliament-backend.herokuapp.com/articles/'+postToUpdate,{ text: this.state.editComment, commentId:commentToUpdate},{withCredentials:true})
            .then((res) => {
                let newposts  = res.data.articles;
                this.setState({ postsToShow:newposts});
            }, (error) => {
                console.log(error);
            });
    };

    //Change handler for adding new comment.
    handleChange = (evt) => {
        evt.preventDefault();
        newComment = evt.target.value;
        postToUpdate = evt.target.id;
    }

    //Submit handler for editing existing post.
    handlePostEdit = (evt) => {
        evt.preventDefault();
        this.setState({
            editPost: evt.target.value,
            editPostId: evt.target.id
        })
    }

    //Submit handler for editing existing comment.
    handlePostCommentEdit = (evt) => {
        evt.preventDefault();
        this.setState({
            editComment: evt.target.value,
            editCommentId: evt.target.id,
            editPostId: evt.target.name
        })
    }

    //handler for finding user to follower.
    changeHandlerFind = (evt) => {
        evt.preventDefault();
        this.setState({
            searchFollower: evt.target.value,
        })
    }

    //submit handler to add the follower
    submitSearch = (evt) => {
        evt.preventDefault();
        axios.put('https://parliament-backend.herokuapp.com/following/'+this.state.searchFollower,{ text: this.state.editComment},{withCredentials:true})
            .then((res) => {
                //this.setState({ followers:res.data.following,});
                axios.get('https://parliament-backend.herokuapp.com/articles',{withCredentials:true})
                    .then((res) => {
                        console.log(res)
                        this.setState({ postsToShow:res.data.articles,ready1: true});
                        axios.get('https://parliament-backend.herokuapp.com/following',{withCredentials:true})
                            .then((res) => {
                                console.log(res.data)
                                this.setState({ followers:res.data.following, ready: true});
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

    changeHandlerFindArtcile = (evt) => {
        evt.preventDefault();
        this.setState({
            searchArticleByAuthor: evt.target.value,
        })
    }

    //submit handler to add the follower
    submitSearchArticle = (evt) => {
        evt.preventDefault();
        axios.get('https://parliament-backend.herokuapp.com/articles/'+this.state.searchArticleByAuthor,{withCredentials:true})
            .then((res) => {
                this.setState({ postsToShow:res.data.articles,ready1: true})
            }, (error) => {
                console.log(error);
            });
    }
    handleImageChange =(event)=>{
        event.preventDefault();
        console.log(event.target.files[0]);
        console.log()
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
    toggleComments = (evt) =>{
        console.log(evt.target.value)
        let postnumber = evt.target.name
        console.log(postnumber)
        let buttonname = "toggelCommentSection"+postnumber
        console.log(buttonname)
        let sectionname = "comment_section" + postnumber
        console.log(sectionname)
        if(evt.target.value === 'Show Comments'){
            document.getElementById(sectionname).style.display='block'
            document.getElementById(buttonname).value = 'Hide'
        }
        else{
            console.log("Inside Show if")
            document.getElementById(sectionname).style.display='none'
            document.getElementById(buttonname).value = 'Show Comments'
        }

    }
    getFollowerHeadline =(username)=> {
        console.log("getting follower headline")
        axios.get('https://parliament-backend.herokuapp.com/headline/'+username,{withCredentials:true})
            .then((res) => {
                console.log(res.data.headline)
                let followerHeadline=res.data.headline
                this.setState({
                    followerReady:true
                })
                return followerHeadline;
            }, (error) => {
                console.log(error);
            });
    }
    render() {

        return(

           <div className="row">
                <div className="col-md-3" id="userDetails">
                    <div>
                        <MDBCol>
                            <MDBCard style={{ width: "21rem"}}>
                                <img className="img-fluid" src={String(this.state.picture)} alt={"User avatar"}/>
                                {this.state.ready ? <MDBCardBody>
                                    <MDBCardTitle>{this.state.username}</MDBCardTitle>
                                    <MDBCardText id="headline">
                                        <h5>{this.state.headline}</h5>
                                    </MDBCardText>
                                    <div className="sm-form" size="sm">
                                        <form className="needs-validation"
                                              onSubmit={this.submitHandler}
                                              noValidate>
                                            <MDBIcon icon="edit" />
                                            <input  value={this.state.newHeadline} name="newHeadline" onChange={this.changeHandler} type="text" id="newHeadline" className="form-control" placeholder="Enter New Headline" />
                                            <div className="text-center mt-4">
                                                <MDBInput color="indigo" type="submit" value="Update Headline"/>
                                            </div>
                                        </form>
                                    </div>
                                    <br/>
                                    <h4>
                                        <MDBIcon icon="book-reader" />
                                    <Link to={{
                                        pathname: "/ProfilePage",
                                    }}
                                    ><strong>Profile</strong></Link></h4>
                                    <br/>
                                    <br/>
                                    <h6><MDBIcon icon="sign-out-alt" />
                                    <a onClick={this.logoutUser} href={"/"}>Logout</a></h6>
                                </MDBCardBody> : null }
                            </MDBCard>
                            <br/>
                            <MDBListGroup style={{ width: "21rem" }}>
                                <MDBListGroupItem active aria-current='true'>
                                    Following
                                </MDBListGroupItem>
                                {this.state.ready ?

                                    <div className="Container">
                                        <h2><MDBIcon icon="user-friends" /></h2>
                                        {this.state.followers.map(item => (
                                              item ?  <div>
                                                    <MDBListGroupItem>
                                                        <img src={String(item.picture)} width={400} alt={"Follower avatar"} className="img-thumbnail"/>
                                                        <br/>
                                                        <br/>
                                                        <h5><p>{item.username}</p>
                                                        <p>{item.message}</p>
                                                            <MDBIcon icon="user-minus" id = {item} onClick={this.removeFollower} />
                                                        </h5>
                                                    </MDBListGroupItem>
                                                </div> : null
                                            )
                                        )
                                        }
                                    </div> : null
                                }
                            </MDBListGroup>
                            <br/>
                            <br/>
                            <MDBCol md = "10">
                                <h1><MDBIcon far icon="address-book" /></h1>
                            Search Friends to Follow
                                <br/>
                            <form id="searchUserform" className="needs-validation" onSubmit={this.submitSearch} noValidate>
                                <input value={this.state.searchFollower} name="searchFollower" onChange={this.changeHandlerFind} type="text" id="inputForUserFind" className="form-control" placeholder="Please Enter Full username" width={20}/>
                                <h7><i>Click Below icon to Search</i></h7>
                                <h5><MDBIcon onClick={this.submitSearch} icon="search"/></h5>
                            </form>
                        </MDBCol>
                        </MDBCol>
                    </div>

                </div>
               <div className="col-md-1"></div>
                    <div className="col-md-18" id="userPosts">
                    {/*<Posts/>*/}
                        <div className="row">
                            <div className="Container">
                                <MDBCard>
                                    <MDBCardBody>
                                        <MDBRow>
                                            <MDBCol md="6">
                                                <div className="input-group">
                                                    <div className="custom-file">
                                                        <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" accept="image/*" onChange={this.newChangePost}/>
                                                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                                                            Choose file
                                                        </label>
                                                    </div>
                                                </div>
                                            </MDBCol>
                                            <MDBCol md="6" className="mb-6">
                                                <textarea id="newPost" className="md-textarea form-control" name="newPost" value={this.state.newPost} placeholder="Enter New Post" onChange={this.addNewPost}></textarea>
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow>
                                            <MDBCol md="3" className="mb-2">
                                                <h2><MDBIcon icon="envelope" onClick={this.onNewPost} /></h2>
                                                <small><i>Click this icon to Post</i></small>
                                                {/*<MDBInput type="submit" onClick={this.onNewPost} value="Post" size="sm"/>*/}
                                            </MDBCol>
                                            <MDBCol md="3" className="mb-2">
                                                <h2><MDBIcon  onClick={this.onClear} icon="eraser" /></h2>
                                                <small><i>Click this icon to erase post text</i></small>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCardBody>
                                </MDBCard>
                                <br/>
                                <br/>
                                <MDBCol md="6">

                                    <form id="searchform" className="needs-validation" onSubmit={this.submitSearchArticle} noValidate>
                                        <input value={this.state.searchArticleByAuthor} name="find" onChange={this.changeHandlerFindArtcile} type="text" id="defaultFormRegisterNameEx" className="form-control" placeholder="Enter Title or Author" width={40}/>
                                        <small><i>Click Below icon to Search</i></small>
                                        <h5><MDBIcon onClick={this.submitSearchArticle} type="submit" icon="search"/></h5>
                                        <div className="valid-feedback">Looks good!</div>
                                            {/*<MDBInput color="primary" icon="search" type="submit" size="sm"><MDBIcon type="submit" icon="search"/></MDBInput>*/}
                                    </form>
                                </MDBCol>
                                {this.state.ready1 ?
                                    <div id="userposts">
                                        {(this.sortByDate(this.state.postsToShow))}
                                        {this.correctOrder(this.state.postsToShow)}
                                        { this.state.postsToShow.slice(0,10).map(item =>
                                            <div>
                                                <MDBCol md="6" >
                                                    {/*{console.log(item)}*/}
                                                    <MDBCard style={{ width: "40rem"}}>
                                                        {item.image ? <img src={String(item.image)} alt={"Post avatar"}/> : null}
                                                        <MDBCardBody>
                                                            <h5><p className="text-left">{item.text}</p></h5>
                                                                <p className="text-right">From : {item.auth}</p>
                                                                <p className="text-right" >@ {item.date}</p>

                                                            <br/>
                                                            <MDBRow>
                                                                <MDBCol md="4">
                                                                    <h3><MDBIcon far icon="comment" /></h3>
                                                                    <form className="needs-validation"
                                                                          onSubmit={this.submitHandlerComment}
                                                                          noValidate>
                                                                        <input  value={item.id} onChange={this.handleChange} name={"newComment"+item.pid}  type="text" id={"newComment"+item.pid} className="form-control" placeholder="Enter New Comment" />
                                                                        <div className="text-center mt-4">
                                                                            <MDBInput color="indigo" type="submit" value="Comment"/>
                                                                        </div>
                                                                    </form>
                                                                </MDBCol>
                                                                <MDBCol md="4">
                                                                    <h3><MDBIcon icon="edit" /></h3>
                                                                        <form className="needs-validation"
                                                                              onSubmit={this.submitHandlerPostEdit}
                                                                              noValidate>
                                                                            <input  value={item.id} onChange={this.handlePostEdit} name={"editText"+item.pid}  type="text" id={"editText"+item.pid} className="form-control" placeholder="Edit Post Text" />
                                                                            <div className="text-center mt-4">
                                                                                <MDBInput color="indigo" type="submit" value="Edit"/>
                                                                            </div>
                                                                        </form>
                                                                </MDBCol>
                                                                <MDBCol md="8">
                                                                    <h3><MDBIcon far icon="comments" /></h3>
                                                                    <MDBInput id={"toggelCommentSection"+item.pid} name={item.pid} value="Show Comments" type="submit" onClick={this.toggleComments}></MDBInput>
                                                                    <MDBMedia body id={"comment_section"+item.pid} style={{display:'none'}}>
                                                                        {item.comments.map(item1 => (
                                                                            <div>
                                                                                <MDBIcon far icon="comment" />
                                                                                <p id={item1.commentId}> <i>{item1.owner} </i> said {item1.text}</p>
                                                                                <MDBCol md="4">
                                                                                <div className="sm-form" size="sm">
                                                                                    <form className="needs-validation" onSubmit={this.submitHandlerPostCommentEdit} noValidate>
                                                                                        <input  value={item1.commetId} onChange={this.handlePostCommentEdit} name={"editComment"+item.pid}  type="text" id={"editComment"+item1.commentId} className="form-control" placeholder="Edit Comment Text" />
                                                                                        <div className="text-center mt-4">
                                                                                            <MDBInput color="indigo" type="submit" value="Edit"/>
                                                                                        </div>
                                                                                    </form>
                                                                                </div>
                                                                                </MDBCol>
                                                                            </div>
                                                                        ))}
                                                                    </MDBMedia>
                                                                </MDBCol>
                                                            </MDBRow>
                                                        </MDBCardBody>
                                                    </MDBCard>
                                                </MDBCol>
                                                <br/>
                                            </div>
                                        )
                                            // )
                                        }
                                    </div>
                                    : null}
                            </div>
                        </div>
                </div>
            </div>
        );
    }
}

export default MainPage;
