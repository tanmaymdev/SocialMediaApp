import React from "react";
import {MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol, MDBInput, MDBMedia, MDBRow,} from "mdbreact";
import axios from 'axios';
var newComment;
var postToUpdate;
function toggleComments(evt){
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
function submitHandler (event) {
    event.preventDefault();
    console.log(event.target.value);
    console.log(postToUpdate);
    //console.log(document.getElementById("newComment"+event.target.value).innerHTML)
    axios.put('http://127.0.0.1:3000/articles/'+postToUpdate,{ text: newComment, commentId : -1},{withCredentials:true})
        .then((res) => {
            //this.setState({ headline:res.data.headline,});
        }, (error) => {
            console.log(error);
        });
};
function handleChange(evt) {
    evt.preventDefault();
    console.log(evt.target.value);
    newComment = evt.target.value;
    postToUpdate = evt.target.id.substring(10,11);
}
export const Card = (post) => {
    return (
        <div>
        <MDBCol size="12">
            {console.log(post)}
            <MDBCard style={{ width: "60rem"}}>
                <img src={"https://mdbootstrap.com/img/Photos/Horizontal/Nature/full page/img(11).jpg"}/>
                <MDBCardBody>
                    <MDBCardTitle>Title: New Post</MDBCardTitle>
                    <small className="text-left">From : {post.auth}</small>
                    <small className="text-left">@ {post.date}</small>
                    {/*<small className="text-left">@{post[6]}</small>*/}
                    <MDBCardText>
                        {post.text}
                    </MDBCardText>
                    <MDBRow>
                    {/*<MDBCol md="4">*/}
                    {/*    <textarea id="comment" className="md-textarea form-control" rows="3" placeholder="Enter New Comment" width={80}></textarea>*/}
                    {/*</MDBCol>*/}
                        {/*<MDBCol md="4">*/}
                        {/*<MDBInput type="submit" value="Comment" width={20}/><MDBInput type="submit" value="Edit" width={20}/>*/}
                        {/*</MDBCol>*/}
                        <div className="sm-form" size="sm">
                            <form className="needs-validation"
                                  onSubmit={submitHandler}
                                  noValidate>
                                <input  value={post.id} onChange={handleChange} name={"newComment"+post.pid}  type="text" id={"newComment"+post.pid} className="form-control" placeholder="Enter New Comment" />
                                <div className="text-center mt-4">
                                    <MDBInput color="indigo" type="submit" value="Comment"/>
                                </div>
                            </form>
                        </div>
                        <MDBCol md="4">
                            {/*<MDBInput id={"toggelCommentSection"+post[0]} name={post[0]} value="Show Comments" type="submit" onClick={toggleComments}></MDBInput>*/}
                            {/*<MDBMedia id={"comment_section"+post[0]} style={{display:'none'}}>*/}
                                <MDBMedia body>
                                    <MDBMedia heading>
                                       Comment Section
                                    </MDBMedia>
                                    {post.comments.map(item => (
                                        <p id={item.commetId}>{item.owner} ==> {item.text}</p>
                                    ))}
                                    {console.log(post.comments)}
                                    {/*<p>@Leanne --> Cras sit amet nibh libero, in gravida nulla. </p>*/}
                                    {/*<p>@Patricai --> Nulla vel metus scelerisque ante sollicitudin.</p>*/}
                                    {/*<p>@Chelsey -->Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>*/}
                                </MDBMedia>
                            {/*</MDBMedia>*/}
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
            <br/>
        </div>
    );
};