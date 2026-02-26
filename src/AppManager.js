import React, { useState } from 'react';
import Home from './Home';
import VocabGame from './VocabGame';
import SentenceGame from './createSentence';

const App = () => {
  const [currentGame, setCurrentGame] = useState('home');

  const handleSelectGame = (gameId) => {
    setCurrentGame(gameId);
  };

  const handleBackToHome = () => {
    setCurrentGame('home');
  };

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'vocab':
        return <VocabGame onBackToHome={handleBackToHome} />;
      case 'sentence':
        return <SentenceGame onBackToHome={handleBackToHome} />;
      default:
        return <Home onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <div className="font-sans">
      {renderCurrentGame()}
    </div>
  );
};

export default App;