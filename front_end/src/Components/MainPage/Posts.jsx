import React from "react";
import {Card} from "./Card";
import {MDBCard,MDBRow,MDBCol,MDBInput,MDBCardBody,MDBCardText, MDBCardTitle,MDBMedia}from "mdbreact";
import axios from 'axios';
var newComment;
var postToUpdate;
class Posts extends React.Component {
    state = {
        postsToShow:[],
        ready:false,
        ready1:false,
        editPost:"",
        editPostId:"",
        editComment:"",
        editCommentId:""
    }
    constructor(props) {
        super(props);
        this.state = {value: ''};

    }
    componentDidMount() {
        axios.get('http://127.0.0.1:3000/articles',{withCredentials:true})
            .then((res) => {
                //console.log(res.data)
                console.log(res)
                this.setState({ postsToShow:res.data.articles,ready: true});
            }, (error) => {
                console.log(error);
            });
    }

    sortByDate = arr => {
        console.log("Sorting")
        const sorter = (a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        //console.log(arr.sort(sorter))
        arr.sort(sorter);
    }
    correctOrder = arr =>{
        arr.reverse();
    }
    onNewPost = () => {
        axios.post('http://127.0.0.1:3000/article',{text:this.state.newPost},{withCredentials:true})
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
    onClear = () => {

        //console.log("Clearing textarea");
        document.getElementById("newPost").value="";
    }
    addNewPost = (evt) => {

        evt.preventDefault();
        this.setState({ [evt.target.name]: evt.target.value });

    }
   submitHandler = (event) => {
        event.preventDefault();
       postToUpdate = postToUpdate.substring(10,postToUpdate.length)
        axios.put('http://127.0.0.1:3000/articles/'+postToUpdate,{ text: newComment, commentId : -1},{withCredentials:true})
            .then((res) => {
                let newposts  = res.data.articles;
                this.setState({ postsToShow:newposts});
            }, (error) => {
                console.log(error);
            });
    };
    submitHandlerPostEdit = (event) => {
        event.preventDefault();
        postToUpdate = this.state.editPostId.substring(8,this.state.editPostId.length)
        axios.put('http://127.0.0.1:3000/articles/'+postToUpdate,{ text: this.state.editPost},{withCredentials:true})
            .then((res) => {
                let newposts  = res.data.articles;
                this.setState({ postsToShow:newposts});
            }, (error) => {
                console.log(error);
            });
    };
    submitHandlerPostCommentEdit = (event) => {
        event.preventDefault();
        let commentToUpdate = this.state.editCommentId.substring(11,this.state.editCommentId.length)
        let postToUpdate = this.state.editPostId.substring(11,this.state.editPostId.length)
        axios.put('http://127.0.0.1:3000/articles/'+postToUpdate,{ text: this.state.editComment, commentId:commentToUpdate},{withCredentials:true})
            .then((res) => {
                let newposts  = res.data.articles;
                this.setState({ postsToShow:newposts});
            }, (error) => {
                console.log(error);
            });
    };
    handleChange = (evt) => {
        evt.preventDefault();
        newComment = evt.target.value;
        postToUpdate = evt.target.id;
    }
    handlePostEdit = (evt) => {
        evt.preventDefault();
        this.setState({
            editPost: evt.target.value,
            editPostId: evt.target.id
        })
    }
    handlePostEdit = (evt) => {
        evt.preventDefault();
        this.setState({
            editPost: evt.target.value,
            editPostId: evt.target.id
        })
    }
    handlePostCommentEdit = (evt) => {
        evt.preventDefault();
        this.setState({
            editComment: evt.target.value,
            editCommentId: evt.target.id,
            editPostId: evt.target.name
        })
    }
    render() {
        return(
         <div className="row">
            <div className="Container">
                 <MDBCard>
                     <MDBCardBody>
                         <MDBRow>
                             <MDBCol md="4" className="mb-3">
                                 <div className="input-group">
                                     <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroupFileAddon01">
                                         Upload
                                         </span>
                                     </div>
                                     <div className="custom-file">
                                         <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"/>
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
                                 <MDBInput type="submit" onClick={this.onNewPost} value="Post" size="sm"/>
                             </MDBCol>
                             <MDBCol md="3" className="mb-2">
                                 <MDBInput type="reset" onClick={this.onClear} value="Cancel" size="sm"/>
                             </MDBCol>
                         </MDBRow>
                     </MDBCardBody>
                 </MDBCard>
                 <br/>
                 <br/>
                {this.state.ready ?
                    <div id="userposts">
                     {(this.sortByDate(this.state.postsToShow))}
                     {this.correctOrder(this.state.postsToShow)}
                        {/*{this.state.postsToShow.map(element => element.map(item =>*/}
                        { this.state.postsToShow.map(item =>
                         <div>
                               <MDBCol size="12">
                                  {/*{console.log(item)}*/}
                                   <MDBCard style={{ width: "60rem"}}>
                                       <img src={"https://mdbootstrap.com/img/Photos/Horizontal/Nature/full page/img(11).jpg"}/>
                                       <MDBCardBody>
                                           <small className="text-left">From : {item.auth}</small>
                                           <small className="text-left">@ {item.date}</small>
                                           <MDBCardText>
                                              <h6> {item.text} </h6>
                                           </MDBCardText>
                                           <MDBRow>
                                               <div className="sm-form" size="sm">
                                                   <form className="needs-validation"
                                                       onSubmit={this.submitHandler}
                                                         noValidate>
                                                       <input  value={item.id} onChange={this.handleChange} name={"newComment"+item.pid}  type="text" id={"newComment"+item.pid} className="form-control" placeholder="Enter New Comment" />
                                                       <div className="text-center mt-4">
                                                           <MDBInput color="indigo" type="submit" value="Comment"/>
                                                       </div>
                                                   </form>
                                               </div>
                                               <MDBCol md="4">
                                                   <MDBMedia body>
                                                       <MDBMedia heading>
                                                           Comment Section
                                                       </MDBMedia>
                                                       {item.comments.map(item1 => (
                                                           <div>
                                                               <p id={item1.commentId}>{item1.owner} ==> {item1.text}</p>
                                                              <div className="sm-form" size="sm">
                                                                   <form className="needs-validation" onSubmit={this.submitHandlerPostCommentEdit} noValidate>
                                                                       <input  value={item1.commetId} onChange={this.handlePostCommentEdit} name={"editComment"+item.pid}  type="text" id={"editComment"+item1.commentId} className="form-control" placeholder="Edit Comment Text" />
                                                                       <div className="text-center mt-4">
                                                                           <MDBInput color="indigo" type="submit" value="Edit"/>
                                                                       </div>
                                                                   </form>
                                                               </div>
                                                           </div>
                                                      ))}
                                                   </MDBMedia>
                                               </MDBCol>
                                               <MDBCol md="4">
                                                   <div className="sm-form" size="sm">
                                                       <form className="needs-validation"
                                                             onSubmit={this.submitHandlerPostEdit}
                                                             noValidate>
                                                           <input  value={item.id} onChange={this.handlePostEdit} name={"editText"+item.pid}  type="text" id={"editText"+item.pid} className="form-control" placeholder="Edit Post Text" />
                                                           <div className="text-center mt-4">
                                                               <MDBInput color="indigo" type="submit" value="Edit"/>
                                                           </div>
                                                       </form>
                                                   </div>
                                               </MDBCol>
                                           </MDBRow>
                                       </MDBCardBody>
                                   </MDBCard>
                               </MDBCol>
                          <br/>
                          </div>
                         )
                     }
                    </div>
                    : null}
                </div>
            </div>
        );
    }
}

export default Posts;
