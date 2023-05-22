import React from 'react';
import '../css/ShowGain.css'
function ShowGain({ winPhrase, playerIcon, playerName, playerGain}) {
    
    return (
        <div className="show-win-container">
          <div className="show-win">
            <img src={playerIcon} alt="Player Icon" />
            <p>{playerName}</p>
            <p>{`Ce joueur ${winPhrase} Lcoins !`}</p>
          </div>
        </div>
      );
  }

  export default ShowGain;