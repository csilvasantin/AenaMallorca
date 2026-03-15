import { useRef, useState, useCallback } from 'react';
import { AenaSplash } from './AenaSplash';

type Phase = 'waiting' | 'splash' | 'video';

interface IntroVideoProps {
  onFinished: () => void;
  onStartMusic: () => void;
}

export function IntroVideo({ onFinished, onStartMusic }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>('waiting');

  const handleStart = () => {
    onStartMusic();
    setPhase('splash');
  };

  const handleSplashFinished = useCallback(() => {
    setPhase('video');
    setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 100);
  }, []);

  const handleSkip = () => {
    onFinished();
  };

  const handleEnded = () => {
    onFinished();
  };

  return (
    <div className="intro-video">
      {phase === 'waiting' && (
        <div
          style={{
            aspectRatio: '16/9',
            background: '#000',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            gap: '1rem',
          }}
          onClick={handleStart}
        >
          <div style={{
            fontSize: '3rem',
            color: '#ff8906',
            textShadow: '3px 3px 0 #5a2d00',
          }}>
            ▶
          </div>
          <p style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.6rem',
            color: '#a7a9be',
            textTransform: 'uppercase',
          }}>
            Click para empezar
          </p>
        </div>
      )}
      {phase === 'splash' && (
        <div style={{ aspectRatio: '16/9', background: '#000', width: '100%' }}>
          <AenaSplash onFinished={handleSplashFinished} />
        </div>
      )}
      {phase === 'video' && (
        <video
          ref={videoRef}
          src={`${import.meta.env.BASE_URL}videos/intro.mp4`}
          playsInline
          onEnded={handleEnded}
          style={{ aspectRatio: '16/9', width: '100%', objectFit: 'cover' }}
          onClick={() => {
            const v = videoRef.current;
            if (v) {
              if (v.paused) {
                v.play();
              } else {
                v.pause();
              }
            }
          }}
        />
      )}
      <button className="skip-btn" onClick={handleSkip}>
        Saltar intro →
      </button>
    </div>
  );
}
