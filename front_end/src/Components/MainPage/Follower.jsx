import React from "react";
import {MDBListGroupItem,} from "mdbreact";

export const Follower = (follower) => {
    return (
        <div>
            <MDBListGroupItem id ={follower.id}>
                <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-8.jpg" className="rounded mx-auto d-block" alt="aligment" />
                <br/>
                <p>{follower}</p>
            </MDBListGroupItem>
        </div>
    );
};