import React, { Component } from 'react';
import myGif from '../../public/logo.jpg';
import '../css/TopBar.css';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && this.props.isLoggedIn) {
      this.props.setProfil(this.state.inputValue);
      this.setState({ inputValue: '' });
    } else {
      if(e.key === 'Enter') 
        alert("vous devez être connecté")
    }
      
      
  };
  setAccueil = (e) => {
    if (this.props.isLoggedIn)
      this.props.setPage(2)
    else
      alert("vous devez être connecté")
  }

  myParier = (e) => {
    if (this.props.isLoggedIn)
      this.props.setPage(3)
    else
      alert("vous devez être connecté")
  }

  myProfil = (e) => {
    if (this.props.isLoggedIn)
      this.props.setPage(5)
    else
      alert("vous devez être connecté")
  }

  render() {
    const { isLoggedIn, setPage } = this.props;
    const { inputValue } = this.state;

    return (
      <div className="top-bar">
        <div className="logo-container">
          <img src={myGif} alt="Animated GIF" />
          <div className="logo-text">LolGambling</div>
        </div>
        <button onClick={() => this.setAccueil(2)}>Page d'accueil</button>
        <button onClick={() => this.myParier(3)}>Parier</button>
        <button onClick={() => this.myProfil(5)}>Profil</button>

        {isLoggedIn ? (
          <button onClick={() => setPage(0)}>Déconnecter</button>
        ) : (
          <button onClick={() => setPage(1)}>Connecter</button>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={this.handleInputChange}
          onKeyPress={this.handleInputKeyPress}
          placeholder="Nom de joueur"
        />
      </div>
    );
  }
}

export default TopBar;