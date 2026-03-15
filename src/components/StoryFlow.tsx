import { useCallback } from 'react';
import type { StoryGraph } from '../types';
import { useStoryEngine } from '../hooks/useStoryEngine';
import { VideoPlayer } from './VideoPlayer';
import { DecisionOverlay } from './DecisionOverlay';
import { EndScreen } from './EndScreen';
import { ProgressBar } from './ProgressBar';
import { VideoWall } from './VideoWall';
import { FlightMap } from './FlightMap';

interface StoryFlowProps {
  story: StoryGraph;
}

export function StoryFlow({ story }: StoryFlowProps) {
  const {
    currentNode,
    history,
    isFinished,
    showDecisions,
    setShowDecisions,
    makeDecision,
    restart,
    goBack,
    canGoBack,
  } = useStoryEngine(story);

  const handleTimeUpdate = useCallback(
    (time: number) => {
      if (!currentNode.decisions || showDecisions) return;
      const shouldShow = currentNode.decisions.some((d) => time >= d.timeAppear);
      if (shouldShow) setShowDecisions(true);
    },
    [currentNode, showDecisions, setShowDecisions]
  );

  const handleVideoEnded = useCallback(() => {
    if (currentNode.decisions && !showDecisions) {
      setShowDecisions(true);
    }
  }, [currentNode, showDecisions, setShowDecisions]);

  const handleDecision = useCallback(
    (index: number) => {
      makeDecision(index);
    },
    [makeDecision]
  );

  if (isFinished) {
    return (
      <EndScreen
        story={story}
        finalNodeId={currentNode.id}
        history={history}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="story-flow">
      <FlightMap currentNodeId={currentNode.id} />

      <div className="story-content">
        <div className="story-header">
          <h2 className="scene-title">{currentNode.title}</h2>
          {canGoBack && (
            <button className="back-btn" onClick={goBack}>
              ← Volver
            </button>
          )}
        </div>

        <div className="video-wrapper">
          <VideoPlayer
            nodeId={currentNode.id}
            title={currentNode.title}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            paused={showDecisions}
          />
          {currentNode.decisions && (
            <DecisionOverlay
              decisions={currentNode.decisions}
              onDecision={handleDecision}
              visible={showDecisions}
            />
          )}
        </div>

        <ProgressBar story={story} history={history} currentNodeId={currentNode.id} />

        <VideoWall currentNodeId={currentNode.id} />
      </div>
    </div>
  );
}
