import React, { Component } from "react";
import {MDBNavbar, MDBNavbarBrand,MDBNavbarToggler} from "mdbreact";

class NavbarPage extends Component {
    state = {
        isOpen: false
    };

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        return (
                <MDBNavbar color="indigo" dark expand="lg">
                    <MDBNavbarBrand>
                       <center> <strong className="white-text" >Parliament - <small><i> Social Media Platform For the Owls, By the Owls and From the Owls </i> </small> </strong></center>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                </MDBNavbar>

        );
    }
}

export default NavbarPage;