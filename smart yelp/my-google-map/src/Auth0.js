// import jwtDecode from '../node_modules/jwt-decode/build/jwt-decode.min.js';
var jwtDecode = require('jwt-decode');
// Avoid name not found warnings
var Auth0Lock = window.Auth0Lock;
// var jwtDecode = window.jwt_decode;

export default class AuthService {
  // Configure Auth0

  login() {
    let clientId = 'pqcLNfL8Jx6pzcVVsyxwdyP2_uBIESSD';
    let domain = 'mengchie.auth0.com';
    let lock = new Auth0Lock(clientId, domain, {});

    
    return new Promise(function(resolve, reject) {
      lock.show((error, profile, id_token, expires_at) => {
        if (error) {
          console.log(error);
        } else {
          let pro = profile;
          localStorage.setItem('profile', JSON.stringify(profile));
          localStorage.setItem('id_token', id_token);
          localStorage.setItem('expires_at', expires_at);
          console.log(id_token);
          console.log(jwtDecode(id_token));
          console.log(new Date().getTime());
          resolve(pro);
          // let au = this.authenticated();
          // console.log(au);
        }
      });
      
    });
  }

  authenticated() {
    //return tokenNotExpired('id_token');
    if(localStorage.getItem('id_token')) {
      let expiresAt = jwtDecode(localStorage.getItem('id_token')).exp;
      console.log(expiresAt);
      return new Date().getTime()/1000 < expiresAt;
    }
    return false;
    
  }

  logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
  }

  getProfile() {
    return JSON.parse(localStorage.getItem('profile'));
  }
}


