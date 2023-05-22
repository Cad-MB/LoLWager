import React, { Component } from 'react';
import TopBar from './TopBar';
import UserDisplay from './UserDisplay';
import '../css/ChoixPari.css';

class ChoixPari extends Component {
  constructor(props) {
    super(props);
    this.state = {
      somme: '',
      isValid: false,
      isValidDaily: false
    };
    this.setPage = props.setPage;
    this.setMise = props.setMise;
    this.lCoin = props.lCoin;
    this.icone = props.icone;
    this.name = props.name;
  }
  

  handleChange = (event) => {
    const somme = event.target.value;
    this.setState({ somme, isValid: somme >= 10 });
  }

  handleClick = (event) => {
    const { setPage } = this.props;
    const { somme } = this.state;
    if (somme >= 10 && this.lCoin >= somme) {
      if(event.target.value == "1"){
        this.setMise(somme)
        setPage(4);
      }
        
     
    }
    else {
      alert("Vous avez indiqué une somme incorrect")
    }
  }

  render() {
    const { isValid } = this.state;

    return (
      <div className="ChoixPari">
        <TopBar  setProfil={this.props.setProfil} isLoggedIn={true} setPage={this.setPage} />
        <UserDisplay icone="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" name={this.name} lCoin={this.lCoin} />
        <div style={{ marginTop: "80px", textAlign: "center" }}>
          <p>Somme à parier (minimum 10 Lcoins)</p>
          <input type="number" value={this.state.somme} onChange={this.handleChange} />
          <p>Choix du nombre de statistiques</p>
          <div className="btn-group">
            <button onClick={this.handleClick} value="1" disabled={!isValid}>3 stats</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ChoixPari;