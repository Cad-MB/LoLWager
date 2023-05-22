import React from 'react';
import '../css/ShowGain.css'
function ShowRank({ playerIcon, playerName, playerCoins}) {
    
    return (
        <div className="show-win-container">
          <div className="show-win">
            <img src={playerIcon} alt="Player Icon" />
            <p>{playerName}</p>
            <p>{`${playerCoins} Lcoins !`}</p>
          </div>
        </div>
      );
  }

  export default ShowRank;
