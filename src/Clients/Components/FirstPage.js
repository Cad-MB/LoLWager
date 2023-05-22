import React from 'react';
import TopBar from './TopBar';

import '../css/FirstPage.css';


function FirstPage({isLoggedIn, setPage, setProfil}) {
  return (
    <div className="first-page">
        <TopBar setProfil={setProfil} isLoggedIn={isLoggedIn} setPage={setPage} />
      
      <h1 className="welcome-text">Pariez sur votre champion <br/>préféré avec LoLWager</h1>
      <h1 className="promo-text1">100 LCOINS</h1>
      <h1 className="promo-text2">offerts pour les nouveaux adhérents</h1>
    </div>
  );
}

export default FirstPage;
