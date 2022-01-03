import React from "react";
import {SignIn} from "./signIn";
import axios from 'axios';
import FormsPage from "./registrationForm";


class LandingPage extends React.Component {
    state = {
        userName: "",
        password: "",
    };
    constructor(props) {
        super(props);
        this.state = {value: ''};

    }

    componentDidMount() {
        console.log("This was called")
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(res => {
                const persons = res.data;
                this.setState({ persons });
                console.log(persons)
            })
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(res => {
                const posts = res.data;
                this.setState({ posts });
            })
    }

    render() {

        return(
            <div className="row" id="classicformpage">
                <div className="col-md-1"/>
                <div id="div-sign-in" className="col-md-4"><SignIn userDetails={this.state.persons} posts={this.state.posts}/>
                </div>
                <div id="div-registration" className="col-md-6"><FormsPage userDetails={this.state.persons} posts={this.state.posts}/></div>
            </div>

        );
    }
}

export default LandingPage;
