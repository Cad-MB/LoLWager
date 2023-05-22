import React, { Component } from 'react';
import '../css/AfficheTableauJoueur.css';

class AfficheTableauJoueur extends Component {
  constructor(props)
  {
    super(props);
    this.state = {sommeDamageDealt: 0, sommeDamageTaken: 0,sommeHeal: 0, mise:0}
    this.a = [0,1,2,3,4];
    this.value = Math.floor(Math.random() * 5)
    this.randomIntDamageDealt = this.a[this.value];
    this.valueDamageDealt = props.matchInfo.info.participants[this.randomIntDamageDealt].totalDamageDealtToChampions
    this.a.splice(this.value, 1)

    this.value = Math.floor(Math.random() * 4)
    this.randomIntDamageTaken = this.a[this.value];
    this.valueDamageTaken = props.matchInfo.info.participants[this.randomIntDamageTaken].totalDamageTaken
    this.a.splice(this.value, 1)
    
    this.value = Math.floor(Math.random() * 3)
    this.randomIntHeal = this.a[this.value];
    this.a.splice(this.value, 1)
    
    this.valueDamageHeal = props.matchInfo.info.participants[this.randomIntHeal].totalHeal
    this.username = props.username
    this.mise = props.mise
    this.setPage = props.setPage
    this.setLCoins = props.setLCoins
    this.myLcoin = props.lcoin
    this.setPage = props.setPage
    this.image = props.image
  }
  formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration / 600);
    return `${minutes}:${seconds}`;
  }
  
  handleChangeDamageDealt = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    this.setState({sommeDamageDealt: numericValue });
  };

  handleChangeDamageTaken = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    this.setState({sommeDamageTaken: numericValue });
  };

  handleChangeHeal = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    this.setState({sommeHeal: numericValue });
  };

  handleValidation = (e) => {
    {this.isCorrect() ? this.updateUserLCoins(true, (this.mise*2)) : this.updateUserLCoins(false, (this.mise*(-1)))}
  
  }

  isCorrect(){
    if((this.valueDamageDealt - 2500) <= this.state.sommeDamageDealt && this.state.sommeDamageDealt <= (this.valueDamageDealt + 2500)
    && (this.valueDamageTaken - 2500) <= this.state.sommeDamageTaken && this.state.sommeDamageTaken <= (this.valueDamageTaken + 2500)
    && (this.valueDamageHeal - 1500) <= this.state.sommeHeal && this.state.sommeHeal <= (this.valueDamageHeal + 1500)
    ) 
      return true;
    else
      return false;
  }

  

  updateUserLCoins(WoL, lCoinsValue) {
    if (WoL){
      alert("Vous avez gagné !")
    }
    else {
      alert("Vous avez perdu !")
    }
    
    fetch(`http://localhost:5000/User/${this.username}/${lCoinsValue}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Erreur lors de la requête fetch:', error);
      });
       
      const data = {
        username: this.username,
        contenu: '',
        lCoins: lCoinsValue.toString(),
        winOrLoose: WoL,
        img: this.image,
      };
    fetch('http://localhost:5000/WinOrLoose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .catch(error => {
          console.error(error);
        });

      const newvalue = this.myLcoin + lCoinsValue
      if(newvalue < 0)
        this.props.setLCoins(0)
      else 
        this.props.setLCoins(newvalue)
      
      this.setPage(3)
      
  }
 
 
  render() {
    const { matchInfo } = this.props;
    const participants = matchInfo.info.participants;
    
    // Divisez les participants en deux tableaux de cinq participants chacun
    const tableau1 = participants.slice(0, 5);
    const tableau2 = participants.slice(5, 10);
    
    return (
      <div className="tableau-joueur-container">
        <div>durée de la partie {this.formatDuration(matchInfo.info.gameDuration)} min</div>
        <div className="tableau-joueur">
          <h2>Equipe 1 </h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Role</th>
                <th>Tué</th>
                <th>Morts</th>
                <th>Assists</th>
                <th>CS tués</th>
                <th>Gold</th>
                <th>Degats infligé (au champion)</th>
                <th>Degats Subit</th>
                <th>Degats soigné</th>
              </tr>
            </thead>
            <tbody>
              {tableau1.map((participant, index) => (
                <tr key={index}>
                  <td>{participant.championName}</td>
                  <td>{participant.teamPosition}</td>
                  <td>{participant.kills}</td>
                  <td>{participant.deaths}</td>
                  <td>{participant.assists}</td>
                  <td>{participant.totalMinionsKilled}</td>
                  <td>{participant.goldEarned}</td>
                  {index === this.randomIntDamageDealt ? (
                    <input type="text" pattern="[0-9]*"   value={this.state.sommeDamageDealt} onChange={this.handleChangeDamageDealt} />
                  ) : (
                    <td>{participant.totalDamageDealtToChampions}</td>
                  )}
                  {index === this.randomIntDamageTaken ? (
                    <input type="text" pattern="[0-9]*"   value={this.state.sommeDamageTaken} onChange={this.handleChangeDamageTaken} />
                  ) : (
                    <td>{participant.totalDamageTaken}</td>
                  )}
                  {index === this.randomIntHeal ? (
                    <input type="text" pattern="[0-9]*"   value={this.state.sommeHeal} onChange={this.handleChangeHeal} />
                  ) : (
                    <td>{participant.totalHeal}</td>
                  )}
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tableau-joueur">
          <h2>Equipe 2</h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Role</th>
                <th>Tué</th>
                <th>Morts</th>
                <th>Assists</th>
                <th>CS tués</th>
                <th>Gold</th>
                <th>Degats infligé (au champion)</th>
                <th>Degats Subit</th>
                <th>Degats soigné</th>
              </tr>
            </thead>
            <tbody>
              {tableau2.map((participant, index) => (
                <tr key={index}>
                  <td>{participant.championName}</td>
                  <td>{participant.teamPosition}</td>
                  <td>{participant.kills}</td>
                  <td>{participant.deaths}</td>
                  <td>{participant.assists}</td>
                  <td>{participant.totalMinionsKilled}</td>
                  <td>{participant.goldEarned}</td>
                  <td>{participant.totalDamageDealtToChampions}</td>
                  <td>{participant.totalDamageTaken}</td>
                  <td>{participant.totalHeal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <button onClick={this.handleValidation}>VALIDER</button>
        </div>
      </div>
    );
  }
}

export default AfficheTableauJoueur;