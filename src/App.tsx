import { useState, useRef, useCallback } from 'react';
import { PasswordGate } from './components/PasswordGate';
import { IntroVideo } from './components/IntroVideo';
import { StoryFlow } from './components/StoryFlow';
import { demoStory } from './data/story';
import './styles/app.css';

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.volume = 0.5;
        audio.play().catch(() => {});
        setMuted(false);
      } else {
        audio.pause();
        setMuted(true);
      }
    }
  }, []);

  const handleReplayIntro = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIntroFinished(false);
  };

  if (!introFinished) {
    return (
      <PasswordGate>
        <div className="app">
          <audio ref={audioRef} src={`${import.meta.env.BASE_URL}videos/intro-music.mp3`} loop />
          <IntroVideo onFinished={() => setIntroFinished(true)} onStartMusic={startMusic} onToggleMute={toggleMute} muted={muted} />
        </div>
      </PasswordGate>
    );
  }

  return (
    <PasswordGate>
      <div className="app">
        <audio ref={audioRef} src={`${import.meta.env.BASE_URL}videos/intro-music.mp3`} loop />
        <header className="app-header">
          <h1>✈️ Aena La Aventura Gráfica</h1>
          <p className="subtitle">powered by Admira</p>
          <button className="replay-intro-btn" onClick={handleReplayIntro}>
            🎬 Ver intro
          </button>
        </header>
        <button className="mute-btn" onClick={toggleMute}>
          {muted ? '🔇' : '🔊'}
        </button>
        <main>
          <StoryFlow story={demoStory} />
        </main>
      </div>
    </PasswordGate>
  );
}

export default App;
