import React, { Component } from 'react';
import './App.css';
import FirstPage from './Clients/Components/FirstPage.js';
import SignPage from './Clients/Components/SignPage.js';
import Cookies from 'js-cookie';
import MainPage from './Clients/Components/MainPage';
import ChoixPari from './Clients/Components/ChoixPari';
import Pari from './Clients/Components/Pari';
import ProfilPage from './Clients/Components/ProfilPage';
import Chat from './Clients/Components/Chat';
import UserSearchProfil from './Clients/Components/UserSearchProfil';
import Loading from './Clients/Components/Loading';
class App extends Component {

  constructor(props){
    super(props)
    this.current = "connexion"
    this.state = {isConnected : true, page : 0, username: "", droit: false, userPage:"", description:"", icon:"", name:"sheewez", wins:[], 
    lCoin:0, mise:0, image:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", profilName: ""}
    this.getConnected = this.getConnected.bind(this)
    this.setLogout = this.setLogout.bind(this)
    this.setPage = this.setPage.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.getUsername = this.getUsername.bind(this)
    this.getUserPage = this.getUserPage.bind(this)
    this.setUserPage = this.setUserPage.bind(this)
    this.setDescription = this.setDescription.bind(this)
    this.setMise = this.setMise.bind(this)
    this.setProfil = this.setProfil.bind(this)
    this.setLCoins = this.setLCoins.bind(this);
    
  }
  
  setLCoins(n){
    this.setState({lCoin: n});
  }

  setMise(n){
    this.setState({mise : n});
  }

  setProfil(n){
    this.setState({profilName : n});
    this.setPage(6);
  }
  
  getConnected(){
    this.current = "kwe"
    const cookieExists = Cookies.get('connected') !== undefined;
    if (!cookieExists) {
      Cookies.set('connected', 'false', { expires: 7, path: '/' });
    }
    return Cookies.get('connected')
  }

  setLogout(){
    this.setState({username: ""})
    this.current = "connexion"
    this.setState({isConnected : false});

  }

  setPage(n){
    this.setState({page : n});
  }
  setUsername(n){
    this.setState({username : n});
  }

  getUsername(){
    return String(this.state.username)
  }

  getUserPage(){
    return String(this.state.userPage)
  }

  setUserPage(n){
    this.setState({userPage : n});
  }
  setDescription(n){
    this.setState({description: n})
  }

  

  

  renderSwitch(param){
    switch(param){
      case 0:
        //return <MainPage isConnected={this.state.isConnected} setPage={this.setPage}  getUsername={this.state.username}/>
        return <FirstPage setProfil={this.setPage} isLoggedIn={false} setPage={this.setPage} />
      case 1:
        return <SignPage setLCoins={this.setLCoins} login={this.getConnected} setPage={this.setPage} setUsername={this.setUsername} />
      case 2:
        return <MainPage setProfil={this.setProfil} setPage={this.setPage} icone={this.state.icone} name={this.state.username} wins={this.state.wins} isLoggedIn={this.state.isConnected} lCoin={this.state.lCoin}/>
      case 3:
          return <ChoixPari mise={this.state.mise} profilName={this.state.profilName} setProfil={this.setProfil} setPage={this.setPage} icone={this.state.icone} name={this.state.username} lCoin={this.state.lCoin} setMise={this.setMise}/>
      case 4:
        return <Pari image={this.state.image} lCoin={this.state.lCoin} apiKey="<tokken Riot>" setPage={this.setPage} mise={this.state.mise} username={this.state.username} setLCoins={this.setLCoins}></Pari>
      case 5:
        return <ProfilPage setProfil={this.setProfil} profilName={this.state.username} setPage={this.setPage} icone={this.state.image} name={this.state.username} lCoin={this.state.lCoin}/>
      case 6:
        return <UserSearchProfil  username={this.state.username} profilName={this.state.profilName} setProfil={this.setProfil} setPage={this.setPage} />
      case 7:
        return <Loading setPage={this.setPage} setLCoins={this.setLCoins} username={this.state.username}/>
      

      }
      
  }
  
  render() {
    if (this.state.page == 0)
      return <FirstPage setProfil={this.setPage} isLoggedIn={false} setPage={this.setPage} />
    else
      return (
        <div className="App">
          {this.renderSwitch(this.state.page)}
        </div>
      );
  }

}


export default App;
