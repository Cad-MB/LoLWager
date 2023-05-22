import React, { Component } from 'react';
import ShowRank from './ShowRank';
import '../css/ShowGainTable.css'; 

class ShowRankTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }
  
  fetchData() {
    fetch('http://localhost:5000/UserRank', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      const { users } = this.state;
      const updatedUsers = data.map(user => ({
        playerIcon: user.img,
        playerName: user.username,
        winPhrase: `LCoins: ${user.LCoins}`,
        playerGain: user.LCoins
      }));
      this.setState({ users: updatedUsers });
    });
  }
  
  
  componentDidMount() {
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 60000);
  }

  render() {
    const userElements = this.state.users.map((user, index) => (
      <ShowRank key={index} playerIcon={user.playerIcon} playerName={user.playerName} winPhrase={`${user.winPhrase}`} playerCoins={user.playerGain} />
    ));
    return (
      
      <div className="show-table-win">
        
        <h2>Classement des joueurs</h2>
        <div className="win-list">
          {userElements}
        </div>
      </div>
    );
  }
}

export default ShowRankTable;
