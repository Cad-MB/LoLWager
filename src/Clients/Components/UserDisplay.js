import React from 'react';
import '../css/UserDisplay.css';
import mygif from '../../public/logo.jpg'
function UserDisplay({icon, name, lCoin}){
  return (
    <div className="user-display">
      <div className="user-icon">
      <img className="user-icon-circle" src={mygif} alt={name} />
      </div>
      <div className="user-info">
        <p className="user-name">{name}</p>
        <p className="user-lcoin">{lCoin} LCoins</p>
      </div>
    </div>
  );
};

export default UserDisplay;