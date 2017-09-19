// src/Auth/Auth.js

import auth0 from 'auth0-js';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'mengchie.auth0.com',
    clientID: 'pqcLNfL8Jx6pzcVVsyxwdyP2_uBIESSD',
    redirectUri: 'http://localhost:3000',
    audience: 'https://mengchie.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile',
    sso: 'false'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.getExpiresAt = this.getExpiresAt.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  handleAuthentication() {
    console.log('in authentication');
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log(authResult);
        this.setSession(authResult);
        this.getProfile();
      } else if (err) {
        console.log(err);
      }
    });
  }

  getProfile() {
    let accessToken = this.getAccessToken();
    if(accessToken) {
      this.auth0.client.userInfo(accessToken, (err, profile) => {
        if (profile) {
          this.userProfile = profile;
        }
        console.log(profile);
      });
    }
    
  }

  getAccessToken() {
    return localStorage['access_token'];
  }

  getIdToken() {
    return localStorage['id_token'];
  }

  getExpiresAt() {
    return localStorage['expires_at'];
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  logout() {
    // Clear access token and ID token from local storage
    console.log('logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
  }

  login() {
    this.auth0.authorize();
    // this.handleAuthentication();
  }
}