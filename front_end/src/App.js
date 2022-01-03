import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom';
import LandingPage from "./Components/LandingPage/landingPage";
import MainPage from "./Components/MainPage/MainPage";
import {ProfilePage} from "./Components/ProfilePage/profilePage";
import AuthLandingPage from "./Components/LandingPage/AuthLandingPage";
import NavbarPage from "./Components/LandingPage/NavBar";
import React from "react";


function App() {

    return (
    <div className="App">
        <NavbarPage/>
        <Router>
            <Switch>
                <Route exact path="/">
                  <LandingPage />
                </Route>
                <Route exact path={"/MainPage"} render={(props) => <MainPage {...props} key={props.match.params.id} />}/>
                <Route exact path={"/ProfilePage"} render={(props) => <ProfilePage {...props} key={props.match.params.id} />}/>
                <Route exact path={"/AuthLandingPage/:id"} render={(props) => <AuthLandingPage {...props} key={props.match.params.id} />}/>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
