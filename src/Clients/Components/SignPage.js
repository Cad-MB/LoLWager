import React, { Component } from 'react';
import backgroundImage from '../../public/BackgroundSignUp.gif';
import '../css/SignPage.css'

class SignPage extends Component {

    constructor(props){
		super(props);
		this.state={ password:"", setPassword:"", username:"", setUsername:"", confirmpassword:"", setConfirmPassword:"", passwordLogin: "", setpasswordLogin: "", usernemLogin: "", setUsernemLogin: ""};
		this.setPage = this.props.setPage;
		this.login = this.props.login;
    this.setUsername = this.props.setUsername;
    this.setLCoins = this.props.setLCoins;
    }

    
    

    setUsername(e){
      this.setState({name: e});
      if (e == 'rien'){
        this.state.username = "";
      }
    }
    setPassword(e){
      this.setState({name: e});
      if (e == 'rien'){
        this.state.password = "";
      }
    }

    setconfirmpassword(e){
      this.state.confirmpassword = e;
      if (e == 'rien'){
        this.state.confirmpassword = "";
      }
    }






    render(){
        return <div className = "SigninPage">
			<h1 className='LolGambling'>LoLWager</h1>
      <div className="background-image-container">
        <img className="background-image" src={backgroundImage} alt="Background" />
      </div>
			<div id='wrapper'>
			<nav>
				<h2>
					Sign Up
				</h2>
				<div className="ids">
					<label for="username">Username</label>
					<input id="username" name="username" type="info" value ={this.state.username} onChange={(e) => this.setState({username: e.target.value})}/>
				</div>

				<div className="ids">
					<label for="password">Password</label>
					<input id="password" name="password" type="password" value ={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
				</div>

				<div className="ids">
					<label for="confirm">Confirm</label>
					<input id="confirm" name="password" type="password" value ={this.state.confirmpassword} onChange={(e) => this.setState({confirmpassword: e.target.value})}/>
				</div>

				<div className="buttons">
					<button type="submit" onClick={async (e) => {
             let username = this.state.username;
             let password = this.state.password;
             let confirmpassword = this.state.confirmpassword;
             if (password === confirmpassword){
               console.log("les deux password sont bon")
             }else{
               alert("les deux mots de passes ne sont pas bon !");
               return 0;
             }

              e.preventDefault();
              let result = await fetch(
              'http://localhost:5000/SignUp', {
                  method: "post",
                  body: JSON.stringify({username, password}),
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })

              result = await result.text();
              console.warn(result);
              if (result === "True") {
                  alert("Vous etes inscrit !");
                  this.setUsername(username)
                  this.setState({username: ""})
                  this.props.setLCoins(100)
                  
                  this.login();
                  this.setPage(2);
                  return 
              }else{
                alert("le nom d'utilisateur est deja prit");
              }
          }}> Register</button>

				</div>

			</nav>
			<nav>
				<h2>
					Sign In
				</h2>
				<div className="ids">
					<label id="username" for="username">Username</label>
					<input id="username" name="username" type="info" value ={this.state.usernemLogin} onChange={(e) => this.setState({usernemLogin: e.target.value})}/>
				</div>

				<div className="ids">
					<label for="password">Password</label>
					<input id="password" name="password" type="password" value ={this.state.passwordLogin} onChange={(e) => this.setState({passwordLogin: e.target.value})}/>
				</div>

				<div className="buttons">
					<button type="submit" onClick={async (e) => {
             let username = this.state.usernemLogin;
             let password = this.state.passwordLogin;

              e.preventDefault();
              let result = await fetch(
              'http://localhost:5000/Login', {
                  method: "post",
                  body: JSON.stringify({username, password}),
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })

              result = await result.text();
              
              

              console.warn(result);

              if (result === "True") {
                  alert("Vous etes connecté !");
                  this.setUsername(username);
                  this.setPassword('rien');
                  this.setconfirmpassword('rien');
                  this.login();
                  this.setPage(7);
              }else if ( result === "ID"){
                alert("Username inexistant ");
              }else if (result === "False"){
                alert("Mauvais mot de passe ");
              }


          }}> Log In</button>
				</div>
			</nav>
			</div>
        </div>

    }
}

export default SignPage;
