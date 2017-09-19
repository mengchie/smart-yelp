import React, { Component } from 'react';
import {Navbar,Nav, NavItem, NavDropdown,MenuItem, Button } from 'react-bootstrap';
// import Auth from '../Auth0.js';


var initMap = window.initMap;

// let auth = new Auth();
class SearchBar extends Component {

    // componentWillMount() {
    //   this.setState({ profile: {} });
    //   const { userProfile, getProfile } = this.props.auth;
    //   if (!userProfile) {
    //     getProfile((err, profile) => {
    //       this.setState({ profile });
    //     });
    //   } else {
    //     this.setState({ profile: userProfile });
    //   }
    // }
    
    componentDidMount() {

    }
    constructor(props) {
        super(props);
        this.state = { current: 'mail', profile: {nickname: 'Guest'}};
        // this.handleClick = this.handleClick.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login() {
        let log = this.props.auth.login().then(
            (value) => {
                let prof = value;
                this.setState({
                    profile: prof    
                });
                console.log(this.state.profile.nickname);
            }
        );
    }

    logout() {
        this.props.auth.logout();
        let prof = this.state.profile;
        prof.nickname = 'Guest';
        this.setState({
            profile: prof
        });
    }

    render() {
        const authenticated = this.props.auth.authenticated();
        console.log(authenticated);
        return ( 
            <Navbar inverse collapseOnSelect style={{position: 'fixed', zIndex: 101, top: 0, width: `100%`}}>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#">Play Chat</a>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav pullRight>

                  <NavDropdown eventKey={3} title={authenticated? JSON.parse(localStorage.getItem('profile')).nickname : this.state.profile.nickname} id="basic-nav-dropdown">
                    <MenuItem eventKey={3.1}>Profile</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={3.3} onClick={this.logout} style={authenticated? {} : {visibility: 'hidden'}}>Logout</MenuItem>
                  </NavDropdown>
                </Nav>
                <Button type="submit" onClick={this.login} style={(!authenticated)? {backgroundColor: '#0e77ca' , color: '#f7f7f7', float: 'right', marginRight: 18, marginTop: 8} : {visibility: 'hidden'}} >Sign in</Button>
              </Navbar.Collapse>
              
            </Navbar>
        );
    }
}


export default SearchBar;
