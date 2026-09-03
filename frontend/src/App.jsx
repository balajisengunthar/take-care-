import { useState } from 'react';
import FoodNotification from './components/FoodNotification';
import ButterflyAnimation from './components/ButterflyAnimation';
import ApologyPage from './components/ApologyPage';

// Flow states
// 'notification' → 'butterfly' → 'apology'

function App() {
  const [screen, setScreen] = useState('notification');
  const [answer, setAnswer]   = useState(null); // 'yes' | 'no'

  function handleAnswer(ans) {
    setAnswer(ans);
    setScreen('butterfly');
  }

  function handleButterflyDone() {
    setScreen('apology');
  }

  return (
    <div className="app-shell">
      {screen === 'notification' && (
        <FoodNotification onAnswer={handleAnswer} />
      )}
      {screen === 'butterfly' && (
        <ButterflyAnimation answer={answer} onDone={handleButterflyDone} />
      )}
      {screen === 'apology' && (
        <ApologyPage />
      )}
    </div>
  );
}

export default App;

