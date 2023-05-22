import React, { Component } from 'react';
import AfficheTableauJoueur from './AfficheTableauJoueur';
import TopBar from './TopBar';

class Pari extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      matches: [],
      matcheInfo: [],
      apiKey: props.apiKey,
      endLoading: true, // Ajout de la variable d'état isLoading
      mytest: "oui",
      mise: props.mise,
      username: props.username
     
    };
    this.setLCoins = props.setLCoins;
    this.setPage = props.setPage;
    this.lcoin = props.lCoin;
    this.image = props.image;
  }

  componentDidMount() {
    this.fetchPlayers();
  }

  fetchPlayers = () => {
    fetch('http://localhost:5000/ProPlayer')
      .then(response => response.json())
      .then(data => {
        this.setState({ players: data }, () => {
          this.fetchListOfGame();
        });
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });
  };

  fetchListOfGame = () => {
    
    const { players } = this.state;
    const promises = players.map(player => {
      if (player.name !== "") {
        const url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${player.puuid}/ids?start=0&count=20&api_key=${this.state.apiKey}`;
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => {
            console.error(`Error fetching matches for player ${player.name}:`, error);
            return [];
          });
      } else {
        return Promise.resolve([]);
      }
    });

    Promise.all(promises)
      .then(results => {
        const allMatches = results.flat();
        this.setState({ matches: allMatches }, () => {
            this.fetchScore();
          });
        
      })
      
      .catch(error => {
        console.error('Error fetching matches:', error);
      });
  };

  fetchScore = () => {
    fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${this.getRandomMatch()}?api_key=${this.state.apiKey}`)
      .then(response => response.json())
      .then(data => {
        
        this.setState({ matcheInfo: data, endLoading: false});
        //alert(this.state.matcheInfo)
      })
      .catch(error => {
        this.setState({mytest: 'Error fetching players:' });
        console.error('Error fetching players:', error);
      });
  };

  getRandomMatch = () => {
    const { matches } = this.state;
    if (matches.length === 0) {
      return null; // Si le tableau matches est vide, retourne null
    }
    const randomIndex = Math.floor(Math.random() * matches.length);
    return matches[randomIndex];
  };

  render() {
    const { endLoading, matcheInfo, players } = this.state;

    if (endLoading) {
      return <div>Loading... </div>; // Affiche un message de chargement si isLoading est true
    }
    

    return (
      <div className='Pari'>
        <TopBar  setProfil={this.props.setProfil} isLoggedIn={true} setPage={this.props.setPage}></TopBar>
         <div>
            <AfficheTableauJoueur  image={this.image} lcoin={this.lcoin} matchInfo={matcheInfo} setPage={this.setPage} mise={this.state.mise} username={this.state.username} setLCoins={this.props.setLCoins}/>
         </div>
         <div>
            
        </div>
      </div>
    );
  }
}

export default Pari;