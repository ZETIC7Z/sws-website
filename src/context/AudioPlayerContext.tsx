import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface Song {
  videoId: string;
  songName: string;
  authorName: string;
  albumArt: string;
}

export const DEFAULT_PLAYLIST: Song[] = [
  {
    videoId: "xFYQQPAOz7Y",
    songName: "Lose Yourself",
    authorName: "Eminem",
    albumArt: "https://i.ytimg.com/vi/xFYQQPAOz7Y/hqdefault.jpg"
  },
  {
    videoId: "_fgOrexuD_E",
    songName: "45 Sipag Buto AKP UMC 45th Anniversarry Akrho Song LongLive!",
    authorName: "Jose Blair Becaldo",
    albumArt: "https://i.ytimg.com/vi/_fgOrexuD_E/hqdefault.jpg"
  },
  {
    videoId: "5ymlO_GaWrU",
    songName: "We The Scepters - Honestas Et Dignitas ( Official Video )",
    authorName: "We The Scepters",
    albumArt: "https://i.ytimg.com/vi/5ymlO_GaWrU/hqdefault.jpg"
  },
  {
    videoId: "y0LQaRHIVoU",
    songName: "Stig",
    authorName: "Bugoy na Koykoy",
    albumArt: "https://i.ytimg.com/vi/y0LQaRHIVoU/hqdefault.jpg"
  }
];

interface AudioPlayerContextType {
  playlist: Song[];
  setPlaylist: React.Dispatch<React.SetStateAction<Song[]>>;
  currentSongIndex: number;
  setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (vol: number) => void;
  completedSongs: string[];
  setCompletedSongs: React.Dispatch<React.SetStateAction<string[]>>;
  togglePlay: () => void;
  playNext: (isAutoEnd?: boolean) => void;
  playPrev: () => void;
  seekTo: (seconds: number) => void;
  addToPlaylist: (song: Song) => void;
  removeFromPlaylist: (index: number, e: React.MouseEvent) => void;
  playSearchedSong: (song: Song) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [playlist, setPlaylist] = useState<Song[]>(() => {
    const saved = localStorage.getItem("sws_music_playlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Song[];
        // Migrate check: if it contains the old songs, reset to new default
        if (parsed.some(s => s.videoId === "TQ8WlA2GXbk" || s.videoId === "DuMqFknYHBs" || s.songName === "AKRho SWS Chapter Theme")) {
          localStorage.setItem("sws_music_playlist", JSON.stringify(DEFAULT_PLAYLIST));
          return DEFAULT_PLAYLIST;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_PLAYLIST;
      }
    }
    return DEFAULT_PLAYLIST;
  });

  const [currentSongIndex, setCurrentSongIndex] = useState(() => {
    const saved = localStorage.getItem("sws_music_playlist");
    let tempPlaylist = DEFAULT_PLAYLIST;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Song[];
        if (!parsed.some((s: any) => s.videoId === "TQ8WlA2GXbk" || s.videoId === "DuMqFknYHBs" || s.songName === "AKRho SWS Chapter Theme")) {
          tempPlaylist = parsed;
        }
      } catch (e) {}
    }
    const idx = tempPlaylist.findIndex(s => s.videoId === "_fgOrexuD_E");
    return idx !== -1 ? idx : 0;
  });

  const [playing, setPlaying] = useState(false);
  const [completedSongs, setCompletedSongs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);

  // Refs
  const playlistRef = useRef(playlist);
  const currentSongIndexRef = useRef(currentSongIndex);
  const completedSongsRef = useRef(completedSongs);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const isApiLoadedRef = useRef(false);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentSongIndexRef.current = currentSongIndex;
  }, [currentSongIndex]);

  useEffect(() => {
    completedSongsRef.current = completedSongs;
  }, [completedSongs]);

  const currentSong = playlist[currentSongIndex] || null;

  // Save playlist changes
  useEffect(() => {
    localStorage.setItem("sws_music_playlist", JSON.stringify(playlist));
  }, [playlist]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT && !isApiLoadedRef.current) {
      isApiLoadedRef.current = true;
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }

    const initPlayer = () => {
      if (!currentSong) return;
      
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying player:", e);
        }
      }

      playerRef.current = new window.YT.Player("sws-yt-player-container", {
        height: "1",
        width: "1",
        videoId: currentSong.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          fs: 0,
          iv_load_policy: 3
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            if (playing) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (event.data === 0) { // ENDED
              const finishedVideoId = currentSong?.videoId;
              if (finishedVideoId) {
                setCompletedSongs((prev) => {
                  if (prev.includes(finishedVideoId)) return prev;
                  const newCompleted = [...prev, finishedVideoId];
                  completedSongsRef.current = newCompleted;
                  return newCompleted;
                });
              }
              if (playNextRef.current) {
                playNextRef.current(true);
              }
            }
            if (event.data === 1) { // PLAYING
              setPlaying(true);
              setDuration(playerRef.current.getDuration() || 0);
            }
            if (event.data === 2) { // PAUSED
              setPlaying(false);
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentSongIndex]);

  // Track progress when playing
  useEffect(() => {
    if (playing) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
          setCurrentTime(playerRef.current.getCurrentTime());
          setDuration(playerRef.current.getDuration() || 0);
        }
      }, 500);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [playing]);

  // Handle play/pause
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pauseVideo();
      setPlaying(false);
    } else {
      playerRef.current.playVideo();
      setPlaying(true);
    }
  };

  const playNextRef = useRef<any>(null);

  const playNext = async (isAutoEnd = false) => {
    const currentPlaylist = playlistRef.current;
    const currentIndex = currentSongIndexRef.current;
    const currentCompleted = completedSongsRef.current;

    if (currentPlaylist.length === 0) return;

    const nextIndex = currentIndex + 1;
    const reachedEnd = nextIndex >= currentPlaylist.length;

    // Check if the 4 default songs have been completed
    const defaultIds = DEFAULT_PLAYLIST.map(s => s.videoId);
    const completedDefaults = defaultIds.filter(id => currentCompleted.includes(id));
    const allDefaultsPlayed = completedDefaults.length >= 4;

    if (isAutoEnd && (reachedEnd || allDefaultsPlayed)) {
      const seedSong = DEFAULT_PLAYLIST[Math.floor(Math.random() * DEFAULT_PLAYLIST.length)];
      let searchQuerySeed = "";
      if (seedSong.videoId === "xFYQQPAOz7Y") {
        searchQuerySeed = "Eminem hip hop rap music";
      } else if (seedSong.videoId === "_fgOrexuD_E") {
        searchQuerySeed = "AKP Cebu Akrho anniversary song";
      } else if (seedSong.videoId === "5ymlO_GaWrU") {
        searchQuerySeed = "We The Scepters Honestas Et Dignitas";
      } else {
        searchQuerySeed = "Bugoy na Koykoy hip hop rap music";
      }

      try {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyAeIy261EmClOm7zElt2Y0j2wMazfDjC9M";
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchQuerySeed
          )}&type=video&maxResults=10&key=${apiKey}`
        );
        if (res.ok) {
          const data = await res.json();
          const candidateSongs: Song[] = (data.items || [])
            .map((item: any) => ({
              videoId: item.id.videoId,
              songName: item.snippet.title,
              authorName: item.snippet.channelTitle,
              albumArt: item.snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`
            }))
            .filter((s: Song) => s.videoId && !currentPlaylist.some((p) => p.videoId === s.videoId));

          if (candidateSongs.length > 0) {
            const randomSong = candidateSongs[Math.floor(Math.random() * candidateSongs.length)];
            const updatedPlaylist = [...currentPlaylist, randomSong];
            setPlaylist(updatedPlaylist);
            setCurrentSongIndex(updatedPlaylist.length - 1);
            setPlaying(true);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch related song:", err);
      }
    }

    // Pick a random song from the playlist instead of sequential
    let nextIdx = currentIndex;
    if (currentPlaylist.length > 1) {
      let attempts = 0;
      while (nextIdx === currentIndex && attempts < 10) {
        nextIdx = Math.floor(Math.random() * currentPlaylist.length);
        attempts++;
      }
    } else {
      nextIdx = 0;
    }
    setCurrentSongIndex(nextIdx);
    setPlaying(true);
  };

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playlist, currentSongIndex, completedSongs]);

  const playPrev = () => {
    const currentPlaylist = playlistRef.current;
    if (currentPlaylist.length === 0) return;
    setCurrentSongIndex((prev) => (prev - 1 + currentPlaylist.length) % currentPlaylist.length);
    setPlaying(true);
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(seconds, true);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(vol);
    }
  };

  const addToPlaylist = (song: Song) => {
    if (playlist.some((s) => s.videoId === song.videoId)) {
      alert("Song already in playlist!");
      return;
    }
    setPlaylist((prev) => [...prev, song]);
  };

  const removeFromPlaylist = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.length <= 1) {
      alert("Cannot delete the last song!");
      return;
    }
    setPlaylist((prev) => prev.filter((_, idx) => idx !== index));
    if (currentSongIndex === index) {
      setCurrentSongIndex(0);
      setPlaying(false);
    } else if (currentSongIndex > index) {
      setCurrentSongIndex((prev) => prev - 1);
    }
  };

  const playSearchedSong = (song: Song) => {
    const existingIndex = playlist.findIndex((s) => s.videoId === song.videoId);
    if (existingIndex !== -1) {
      setCurrentSongIndex(existingIndex);
      setPlaying(true);
    } else {
      const updatedPlaylist = [...playlist, song];
      setPlaylist(updatedPlaylist);
      setCurrentSongIndex(updatedPlaylist.length - 1);
      setPlaying(true);
    }
  };

  // Trigger audio playback automatically if user just clicked "ENTER SITE"
  useEffect(() => {
    const playOnEnter = sessionStorage.getItem("sws_play_on_enter");
    if (playOnEnter === "true") {
      sessionStorage.removeItem("sws_play_on_enter");
      const idx = playlist.findIndex(s => s.videoId === "_fgOrexuD_E");
      if (idx !== -1) {
        setCurrentSongIndex(idx);
      }
      setPlaying(true);
    }
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        playlist,
        setPlaylist,
        currentSongIndex,
        setCurrentSongIndex,
        playing,
        setPlaying,
        currentTime,
        duration,
        volume,
        setVolume: handleVolumeChange,
        completedSongs,
        setCompletedSongs,
        togglePlay,
        playNext: () => playNext(false),
        playPrev,
        seekTo,
        addToPlaylist,
        removeFromPlaylist,
        playSearchedSong
      }}
    >
      {children}
      {/* Hidden YouTube Container */}
      <div
        className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
        dangerouslySetInnerHTML={{ __html: '<div id="sws-yt-player-container"></div>' }}
      />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
};
