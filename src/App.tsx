import { useState, useRef, useCallback } from 'react';
import { IntroVideo } from './components/IntroVideo';
import { StoryFlow } from './components/StoryFlow';
import { demoStory } from './data/story';
import './styles/app.css';

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  }, []);

  const handleReplayIntro = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIntroFinished(false);
  };

  if (!introFinished) {
    return (
      <div className="app">
        <audio ref={audioRef} src={`${import.meta.env.BASE_URL}videos/intro-music.mp3`} loop />
        <IntroVideo onFinished={() => setIntroFinished(true)} onStartMusic={startMusic} />
      </div>
    );
  }

  return (
    <div className="app">
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}videos/intro-music.mp3`} loop />
      <header className="app-header">
        <h1>✈️ Aeropuerto Interactivo</h1>
        <p className="subtitle">¿Qué avión ha llegado?</p>
        <button className="replay-intro-btn" onClick={handleReplayIntro}>
          🎬 Ver intro
        </button>
      </header>
      <main>
        <StoryFlow story={demoStory} />
      </main>
    </div>
  );
}

export default App;
