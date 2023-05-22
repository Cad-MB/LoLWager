import React, { Component } from 'react';
import Message from './Message';
import '../css/Chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      contenu: ''
    };
    
  }

  componentDidMount() {
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 5000);
  }

  handleChange = (event) => {
    this.setState({ contenu: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { username, profilName } = this.props;
    const { contenu } = this.state;
    const message = {
        username: username,
        contenu: contenu,
        profilName: profilName,
    };
    
    fetch('http://localhost:5000/Message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    .then(response => {
      if (response.ok) {
        console.log('Message envoyé avec succès');
        // Réinitialiser le formulaire ou effectuer d'autres actions après l'envoi réussi
      } else {
        console.error('Échec de l\'envoi du message');
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'envoi du message:', error);
    });

    this.fetchData()
  }

  fetchData() {
    const { lobby, profilName } = this.props;
    fetch(`http://localhost:5000/Message/${profilName}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ messages: data });
      return data
    });
    
  }

  render() {
    const { contenu } = this.state;
    const messageElements = this.state.messages.map((message, index) => (
      <div key={index} className="chat-message">
        <Message content={message.contenu} username={message.username} date={message.CreatedAt}/>
      </div>
    ));
   
    return (
      <div className="chat-container">
        
        <div className="chat-messages">
          
          {messageElements}

          <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" name="contenu" value={contenu} onChange={this.handleChange} />
          </label>
          <br />
          <button type="submit">Envoyer</button>
        </form>
        </div>
      </div>
    );
  }
}

export default Chat;