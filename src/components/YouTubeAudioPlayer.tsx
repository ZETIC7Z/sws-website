import { useEffect, useRef } from "react";

interface YouTubeAudioPlayerProps {
  playing: boolean;
}

const VIDEO_ID = "5ymlO_GaWrU";

const YouTubeAudioPlayer = ({ playing }: YouTubeAudioPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing && iframeRef.current) {
      // Load the iframe src to trigger play (requires user gesture already happened)
      const src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&mute=0&rel=0&modestbranding=1&enablejsapi=1`;
      iframeRef.current.src = src;
    }
  }, [playing]);

  if (!playing) return null;

  return (
    <div
      style={{
        position: "fixed",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
        overflow: "hidden",
        top: "-9999px",
        left: "-9999px",
        zIndex: -1,
      }}
      aria-hidden="true"
    >
      <iframe
        ref={iframeRef}
        title="SWS Background Audio"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen={false}
        style={{ width: "1px", height: "1px" }}
      />
    </div>
  );
};

export default YouTubeAudioPlayer;
