import React from "react";
import {MDBInput} from "mdbreact";

export const User = () => {
    return (
        <div className="CardWrapper">
            <div className="ColImg">
                <img alt="Image Nor Found" className="Img" src={"https://mdbootstrap.com/img/new/standard/city/042.jpg"} />
            </div>
            <div className="sm-form" size="sm">
                    <textarea id="comment" className="md-textarea form-control" rows="1" placeholder="Enter New Comment"/>
            </div>
            <MDBInput type="submit" value="Cancel"/>
            <MDBInput type="submit" value="Post"/>
        </div>
    );
};