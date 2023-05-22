import React, { Component } from 'react';
import TopBar from './TopBar';
import ShowMyGainTable from './ShowMyGainTable';
import ShowRankTable from './ShowRankTable';
import UserDisplay from './UserDisplay';
import '../css/ProfilPage.css'
import myGif from '../../public/logo.jpg'
import Chat from './Chat';


class ProfilPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setPage: props.setPage,
      icone: props.icone,
      name: props.name,
      lCoin: props.lCoin,
      profilName: props.profilName
    };
  }
  
  

  render() {
    return (
      <div className="profil-page">
        <TopBar setProfil={this.props.setProfil} isLoggedIn={true} setPage={this.state.setPage} />
        <UserDisplay icone={this.state.icone} name={this.state.name} lCoin={this.state.lCoin} />
        <div className="table-container">
          <div className="show-my-gain-table">
            <ShowMyGainTable username={this.state.name} />
          </div>
          <div className="chat">
            <Chat username={this.state.name} profilName={this.state.name} />
          </div>
          <div className="show-rank-table">
            <ShowRankTable users={this.state.users} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilPage;
