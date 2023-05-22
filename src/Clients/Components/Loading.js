import React, { Component } from 'react';

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state={LCoins:0, EndLoad:false}
        this.LCoins = 0;
        }

  componentDidMount() {
    this.fetchLcoin();
  }
  
  fetchLcoin() {
    
    fetch(`http://localhost:5000/User/${this.props.username}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        
        
        this.setState({LCoins:data.LCoins, EndLoad: false})
        this.props.setLCoins(data.LCoins)
        this.props.setPage(2)
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi du message:', error);
        alert("error")
      });
      
      
  }

  render() {
    const {EndLoad, LCoins} = this.state;
    if(EndLoad)
        return <div> fin chargement {LCoins}</div>
    else
        return <div> Loading ... {LCoins} et {this.props.username} </div>
  }
}

export default Loading;