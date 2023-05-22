import React, { Component } from 'react';
import ShowGain from './ShowGain.js';


class ShowMyGainTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wins: []
    }
  }

  

  fetchData() {
    const { username } = this.props;

    fetch(`http://localhost:5000/WinOrLoose/${this.props.username}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      
      const updatedUsers = data.map(win => (
        {
        playerIcon: win.img,
        playerName: win.username,
        winPhrase: `${win.lCoins}`,
        playerGain: win.LCoins
      }));
      this.setState({ wins: updatedUsers });
      
    });
  }
  
  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { username } = this.props;
    const winElements = this.state.wins.map((win, index) => (
      <ShowGain key={index} playerIcon={win.playerIcon} playerName={win.playerName} winPhrase={win.winPhrase} playerGain={win.playerGain}/>
    ));
    return (
      <div className="show-table-win">
        <h2>Mes Stats</h2>
        <div className="win-list">
          {winElements}
        </div>
      </div>
    );
  }
}

export default ShowMyGainTable;

