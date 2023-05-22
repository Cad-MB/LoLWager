import React from "react";

class ShowLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: props.creator,
      maxPlayers: props.maxPlayers,
      currentPlayerCount: props.currentPlayerCount,
    };
  }

  handleJoinLobby = () => {
    this.setState(prevState => ({
      currentPlayerCount: prevState.currentPlayerCount + 1
    }));
  }

  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <p>Creator: {this.state.creator}</p>
        <p>Players: {this.state.currentPlayerCount}/{this.state.maxPlayers}</p>
        <button onClick={this.handleJoinLobby}>Join Lobby</button>
      </div>
    );
  }
}

export default ShowLobby;