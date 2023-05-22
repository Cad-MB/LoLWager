import React, { Component } from 'react';
import TopBar from './TopBar';
import ShowMyGainTable from './ShowMyGainTable';
import ShowRankTable from './ShowRankTable';
import UserDisplay from './UserDisplay';
import Chat from './Chat';
import '../css/ProfilPage.css';

class UserSearchProfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setPage: props.setPage,
      icone: '',
      name: props.profilName,
      lCoin: 0,
      profilName: props.profilName,
      username: props.username,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { profilName } = this.state;
    fetch(`http://localhost:5000/User/${this.props.profilName}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const { username, LCoins, img } = data;
        this.setState({ name: username, lCoin: LCoins, icone: img });
      });
  }

  render() {
    return (
      <div className="profil-page">
        <TopBar setProfil={this.props.setProfil} isLoggedIn={true} setPage={this.state.setPage} />
        <UserDisplay icone={this.state.icone} name={this.state.profilName} lCoin={this.state.lCoin} />
        <div className="table-container">
          <div className="show-my-gain-table">
          <ShowMyGainTable username={this.state.profilName} />
          </div>
          <div className="chat">
          <Chat username={this.state.username} profilName={this.state.profilName} />
          </div>
          <div className="show-rank-table">
            <ShowRankTable users={this.state.users} />
          </div>
        </div>
      </div>
    );
  }
}

export default UserSearchProfil;