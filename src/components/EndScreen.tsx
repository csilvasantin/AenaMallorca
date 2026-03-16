import { useRef, useEffect } from 'react';
import type { HistoryEntry, StoryGraph } from '../types';
import { VideoWall } from './VideoWall';

// Map mall_ nodes to their video files
const excursionVideos: Record<string, string> = {
  mall_playa: 'videos/excursiones/mall_playa.mp4',
  mall_catedral: 'videos/excursiones/mall_catedral.mp4',
  mall_bellver: 'videos/excursiones/mall_bellver.mp4',
  mall_soller: 'videos/excursiones/mall_soller.mp4',
  mall_serra: 'videos/excursiones/mall_serra.mp4',
  mall_drach: 'videos/excursiones/mall_drach.mp4',
  mall_valldemossa: 'videos/excursiones/mall_valldemossa.mp4',
  mall_trenc: 'videos/excursiones/mall_trenc.mp4',
  mall_portals: 'videos/excursiones/mall_portals.mp4',
};

interface EndScreenProps {
  story: StoryGraph;
  finalNodeId: string;
  history: HistoryEntry[];
  onRestart: () => void;
  onGoBack?: () => void;
}

export function EndScreen({ story, finalNodeId, history, onRestart, onGoBack }: EndScreenProps) {
  const finalNode = story.nodes[finalNodeId];
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMallorcaExcursion = finalNodeId.startsWith('mall_');
  const videoSrc = excursionVideos[finalNodeId];
  const basePath = import.meta.env.BASE_URL;

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoSrc]);

  return (
    <div className="end-screen">
      {isMallorcaExcursion && onGoBack && (
        <div className="story-header explorer-header" style={{ marginBottom: '0.5rem' }}>
          <h2 className="scene-title">🏝️ {finalNode.title}</h2>
          <button className="back-btn" onClick={onGoBack}>
            ← Volver
          </button>
          <div className="explorer-walker">
            <div
              className="explorer-sprite"
              style={{ backgroundImage: `url(${basePath}images/explorer-sprite.png)` }}
            />
          </div>
        </div>
      )}

      {isMallorcaExcursion && videoSrc ? (
        <>
          {/* Excursion video */}
          <div className="excursion-video-wrapper">
            <video
              ref={videoRef}
              src={`${basePath}${videoSrc}`}
              className="excursion-video"
              loop
              muted
              playsInline
              autoPlay
            />
            <div className="excursion-video-overlay">
              <h1 className="excursion-video-title">{finalNode.title}</h1>
            </div>
          </div>

          {/* VideoWall with excursion */}
          <VideoWall currentNodeId={finalNodeId} />

          <div className="journey-recap">
            <h3>Tu recorrido:</h3>
            <div className="journey-steps">
              {history.map((entry, i) => (
                <div key={i} className="journey-step">
                  <span className="step-node">{story.nodes[entry.nodeId].title}</span>
                  <span className="step-arrow">→</span>
                  <span className="step-decision">{entry.decisionLabel}</span>
                </div>
              ))}
              <div className="journey-step final">
                <span className="step-node">{finalNode.title}</span>
                <span className="step-badge">🏁 Final</span>
              </div>
            </div>
          </div>

          {/* Indiana Jones banner */}
          <div className="indy-banner-wrapper" onClick={onRestart}>
            <img
              src={`${basePath}images/indy-banner.png`}
              alt="Indiana Jones"
              className="indy-banner"
            />
            <div className="indy-banner-cta">
              <span>🔄 VOLVER A EMPEZAR</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="end-title">Fin de la Historia</h1>
          <h2 className="end-subtitle">{finalNode.title}</h2>

          <div className="journey-recap">
            <h3>Tu recorrido:</h3>
            <div className="journey-steps">
              {history.map((entry, i) => (
                <div key={i} className="journey-step">
                  <span className="step-node">{story.nodes[entry.nodeId].title}</span>
                  <span className="step-arrow">→</span>
                  <span className="step-decision">{entry.decisionLabel}</span>
                </div>
              ))}
              <div className="journey-step final">
                <span className="step-node">{finalNode.title}</span>
                <span className="step-badge">🏁 Final</span>
              </div>
            </div>
          </div>

          <button className="restart-btn" onClick={onRestart}>
            🔄 Volver a empezar
          </button>
        </>
      )}
    </div>
  );
}
