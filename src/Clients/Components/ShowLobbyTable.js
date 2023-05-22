import React, { Component } from 'react';
import ShowLobby from './ShowLobby';

class ShowLobbyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbies: props.lobbies
    };
  }

  render() {
    const lobbyList = this.state.lobbies.map((lobby, index) => {
      return (
        <ShowLobby
          key={index}
          name={lobby.name}
          creator={lobby.creator}
          maxPlayers={lobby.maxPlayers}
          currentPlayerCount={lobby.currentPlayerCount}
        />
      );
    });

    return <div>{lobbyList}</div>;
  }
}


export default ShowLobbyTable;