import React, { Component } from 'react';
import TopBar from './TopBar';
import ShowGainTable from './ShowGainTable';
import UserDisplay from './UserDisplay';
import '../css/MainPage.css';
import myGif from '../../public/logo.jpg'
import Chat from './Chat';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setPage: props.setPage,
      icone: props.icone,
      name: props.name,
      wins: props.wins,
      lCoin: props.lCoin,
      isLoggedIn: props.isLoggedIn,
    };
  }

  render() {
    return (
      <div className='main-page'>
        <TopBar setProfil={this.props.setProfil} isLoggedIn={true} setPage={this.state.setPage} />
        <UserDisplay icone={myGif} name={this.state.name} lCoin={this.state.lCoin} />
        <div className="table-container">
          <div className="show-gain-table">
            <ShowGainTable wins={this.state.wins} />
          </div>
        <div className="Chat">
          <Chat username={this.state.name} profilName="MainPage"/>
        </div>

        </div>
         
        
        
        
      </div>
    );
  }
}

export default MainPage;