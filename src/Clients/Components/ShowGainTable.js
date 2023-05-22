import React, { Component } from 'react';
import ShowGain from './ShowGain.js';
import '../css/ShowGainTable.css'; 

class ShowGainTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wins: [
        
      ],
      endLoading: false
    }
  }
 
  fetchData() {
    
    fetch('http://localhost:5000/WinOrLoose', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      const { wins } = this.state;
      data.forEach(win => {
        if (win.winOrLoose) {
          wins.unshift({
            playerIcon: win.img,
            playerName: win.username,
            winPhrase: `a gagné ${win.lCoins}`,
            playerGain: win.lCoins
          });
        } else {
          wins.unshift({
            playerIcon: win.img,
            playerName: win.username,
            winPhrase: `a perdu ${win.lCoins}`,
            playerGain: win.lCoins
          });
        }
      });
      
      this.setState({ wins, endLoading:false});
      
      
    }
    )
    .catch(error => {
      
    });;
  }
  
  componentDidMount() {
    this.fetchData();
    setInterval(() => {
      
      this.fetchData();
    }, 60000);
    
  }

  render() {
    
    
    const winElements = this.state.wins.map((win, index) => (
      <ShowGain key={index} playerIcon={win.playerIcon} playerName={win.playerName} winPhrase={win.winPhrase} playerGain={win.playerGain}/>
    ));
    return (
      <div className="show-table-win">
      
        <h2>Derniers gagnants</h2>
        <div className="win-list">
          {winElements}
        </div>
      </div>
    );
  }
}

export default ShowGainTable; 