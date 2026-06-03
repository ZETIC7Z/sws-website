import { useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Search, List, Plus, Trash2, X, Maximize2, MoreHorizontal, Minimize2, Music } from "lucide-react";
import { useAudioPlayer, Song, DEFAULT_PLAYLIST } from "@/context/AudioPlayerContext";

const SWSMusicPlayer = () => {
  const {
    playlist,
    setPlaylist,
    currentSongIndex,
    setCurrentSongIndex,
    playing,
    setPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    completedSongs,
    setCompletedSongs,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    addToPlaylist,
    removeFromPlaylist,
    playSearchedSong
  } = useAudioPlayer();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Volume slider popover state
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const currentSong = playlist[currentSongIndex] || null;

  // Seek handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo(val);
  };

  // Volume handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
  };

  // Format elapsed time (seconds -> mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Format remaining time (seconds -> -mm:ss)
  const formatRemainingTime = (secs: number) => {
    const rem = duration - secs;
    if (isNaN(rem) || rem <= 0) return "-0:00";
    const m = Math.floor(rem / 60);
    const s = Math.floor(rem % 60);
    return `-${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // YouTube Search using API Key
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    setSearchLoading(true);
    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyAeIy261EmClOm7zElt2Y0j2wMazfDjC9M";
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          q
        )}&type=video&maxResults=8&key=${apiKey}`
      );
      if (res.ok) {
        const data = await res.json();
        const songs: Song[] = (data.items || []).map((item: any) => ({
          videoId: item.id.videoId,
          songName: item.snippet.title,
          authorName: item.snippet.channelTitle,
          albumArt: item.snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`
        }));
        setSearchResults(songs);
      } else {
        console.error("YouTube search error:", res.status, res.statusText);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div
      id="sws-music-player"
      className={`rounded-xl scroll-panel shadow-2xl relative select-none flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isFullscreen ? "fixed inset-4 z-[999] md:inset-10 h-auto" : "w-full"
      }`}
      style={isFullscreen ? {} : { height: "260px" }}
    >
      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-between p-4 pb-2 relative z-10">
        
        {/* Title Bar (Minimized / Maximize controls at far right) */}
        <div className="absolute top-3 right-4 flex items-center gap-2 text-primary/50 z-20">
          <button className="hover:text-primary transition-colors cursor-pointer text-sm font-bold">-</button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="hover:text-primary transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Full Screen" : "Open Full Screen Player"}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button 
            onClick={() => {
              if (isFullscreen) {
                setIsFullscreen(false);
              }
            }} 
            className="hover:text-primary transition-colors cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Content Panel */}
        <div className="flex-1 flex gap-5 mt-2 overflow-hidden">
          {/* Left Side: Cover Art and Elapsed Time */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0 w-24">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-black/30 border border-primary/20 shadow-lg relative">
              {currentSong ? (
                <img
                  src={currentSong.albumArt}
                  alt=""
                  className={`w-full h-full object-cover select-none ${
                    playing ? "animate-pulse" : ""
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={28} className="text-primary/30" />
                </div>
              )}
            </div>
            {/* Elapsed Time below album art */}
            <span className="text-[11px] font-mono text-primary/80 tracking-wider">
              {formatTime(currentTime)}
            </span>
          </div>

          {/* Right Side: Metadata, Progress Bar, and Remaining Time */}
          <div className="flex-1 flex flex-col justify-center min-w-0 pr-8">
            <h3 className="font-heading font-bold text-[17px] text-primary text-glow-gold leading-tight truncate">
              {currentSong ? currentSong.songName : "SWS Playlist"}
            </h3>
            <p className="text-[12px] text-foreground/80 font-body truncate mt-1">
              {currentSong ? currentSong.authorName : "No song playing"}
            </p>

            {/* Progress Slider Container */}
            <div className="mt-4 w-full relative">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-primary/20 appearance-none rounded-full accent-primary outline-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #c8920a 0%, #c8920a ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, rgba(200,146,10,0.2) ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, rgba(200,146,10,0.2) 100%)`
                }}
              />
              {/* Remaining Time display to the right end */}
              <div className="flex justify-end mt-1">
                <span className="text-[10px] font-mono text-primary/60">
                  {formatRemainingTime(currentTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls and Action Toolbar (Bottom) */}
        <div className="h-12 border-t border-primary/15 flex items-center justify-between text-primary/80 mt-1 relative">
          
          {/* Left Controls: Volume & Options */}
          <div className="flex items-center gap-4 flex-shrink-0 relative">
            {/* Volume Speaker Icon & Popover */}
            <div className="relative flex items-center">
              <button 
                onClick={() => setShowVolumeSlider(!showVolumeSlider)} 
                className="hover:text-primary transition-colors cursor-pointer"
              >
                <Volume2 size={16} />
              </button>
              {showVolumeSlider && (
                <div className="absolute left-6 bg-[#1a140f] border border-primary/30 rounded-md p-2 flex items-center z-30 shadow-xl">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-primary/20 accent-primary rounded-full outline-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Choose Options (•••) */}
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="hover:text-primary transition-colors cursor-pointer"
              title="Choose Options"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Center Playback Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={playPrev}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform border border-primary/60 cursor-pointer shadow-md shadow-primary/10"
            >
              {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
            </button>

            <button
              onClick={() => playNext()}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>

          {/* Right Action Icons: Search & Playlist */}
          <div className="flex items-center gap-4">
            {/* Replaced Lyrics button with Search Button to open Search Overlay */}
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                setShowPlaylist(false);
                setShowOptions(false);
              }}
              className={`hover:text-primary transition-colors cursor-pointer ${showSearch ? "text-primary text-glow-gold" : ""}`}
              title="Search Music"
            >
              <Search size={16} />
            </button>

            {/* Open Playing Next List */}
            <button
              onClick={() => {
                setShowPlaylist(!showPlaylist);
                setShowSearch(false);
                setShowOptions(false);
              }}
              className={`hover:text-primary transition-colors cursor-pointer ${showPlaylist ? "text-primary text-glow-gold" : ""}`}
              title="Open Playing Next List"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── SEARCH / ADD SONGS OVERLAY ─── */}
      {showSearch && (
        <div className="absolute inset-0 bg-[#0d0a07]/95 backdrop-blur-md z-20 flex flex-col p-4 animate-fade-in text-foreground border border-primary/20 rounded-xl">
          <div className="flex items-center justify-between mb-2 border-b border-primary/15 pb-1">
            <span className="font-heading font-bold uppercase tracking-wider text-[11px] text-primary flex items-center gap-1">
              <Search size={12} /> YouTube Search
            </span>
            <button onClick={() => setShowSearch(false)} className="hover:text-primary transition-colors cursor-pointer">
              <X size={15} />
            </button>
          </div>
          
          <div className="flex items-center gap-1.5 mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search YouTube music..."
              className="flex-1 h-7 px-3 bg-black/40 border border-primary/25 rounded text-foreground placeholder:text-muted-foreground/50 text-[11px] focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="h-7 px-3 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold uppercase text-[10px] tracking-wider rounded border border-primary/60 hover:brightness-110 disabled:opacity-60 cursor-pointer"
            >
              {searchLoading ? "..." : "Search"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar text-[11px]">
            {searchResults.length === 0 ? (
              <p className="text-center text-muted-foreground/60 mt-8">Search to see results</p>
            ) : (
              searchResults.map((song) => {
                const isAdded = playlist.some((s) => s.videoId === song.videoId);
                return (
                  <div
                    key={song.videoId}
                    onClick={() => playSearchedSong(song)}
                    className="flex items-center gap-2 p-1.5 bg-black/30 border border-primary/10 rounded cursor-pointer hover:bg-primary/5 transition-colors"
                  >
                    <img src={song.albumArt} alt="" className="w-8 h-8 rounded object-cover select-none pointer-events-none" />
                    <div className="flex-1 min-w-0 pointer-events-none">
                      <p className="font-heading font-bold text-[10px] text-foreground truncate">{song.songName}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{song.authorName}</p>
                    </div>
                    {/* Add Plus button for selection */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToPlaylist(song);
                      }}
                      disabled={isAdded}
                      className={`p-1.5 rounded transition-colors ${
                        isAdded
                          ? "text-success cursor-default"
                          : "hover:text-primary text-foreground/80 cursor-pointer bg-primary/10 hover:bg-primary/20 border border-primary/20"
                      }`}
                      title="Add to Playlist"
                    >
                      {isAdded ? "✓" : <Plus size={12} />}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── OPTIONS OVERLAY ─── */}
      {showOptions && (
        <div className="absolute inset-0 bg-[#0d0a07]/95 backdrop-blur-md z-20 flex flex-col p-4 animate-fade-in text-foreground border border-primary/20 rounded-xl">
          <div className="flex items-center justify-between mb-2 border-b border-primary/15 pb-1">
            <span className="font-heading font-bold uppercase tracking-wider text-[11px] text-primary">
              Choose Options
            </span>
            <button onClick={() => setShowOptions(false)} className="hover:text-primary transition-colors cursor-pointer">
              <X size={15} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-3 p-4">
            <button
              onClick={() => {
                setPlaylist(DEFAULT_PLAYLIST);
                setCurrentSongIndex(0);
                setPlaying(false);
                setShowOptions(false);
                setCompletedSongs([]);
                alert("Playlist reset to default tracks!");
              }}
              className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              Reset Playlist to Default
            </button>
            <p className="text-[10px] text-center text-muted-foreground">
              Search icon is located in the bottom toolbar to add custom tracks.
            </p>
          </div>
        </div>
      )}

      {/* ─── PLAYLIST / QUEUE OVERLAY ─── */}
      {showPlaylist && (
        <div className="absolute inset-0 bg-[#0d0a07]/95 backdrop-blur-md z-20 flex flex-col p-4 animate-fade-in text-foreground border border-primary/20 rounded-xl">
          <div className="flex items-center justify-between mb-2 border-b border-primary/15 pb-1">
            <span className="font-heading font-bold uppercase tracking-wider text-[11px] text-primary flex items-center gap-1">
              <List size={12} /> Playing Next ({playlist.length})
            </span>
            <button onClick={() => setShowPlaylist(false)} className="hover:text-primary transition-colors cursor-pointer">
              <X size={15} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar text-[11px]">
            {playlist.map((song, idx) => (
              <div
                key={song.videoId + idx}
                onClick={() => {
                  setCurrentSongIndex(idx);
                  setPlaying(true);
                }}
                className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors border ${
                  idx === currentSongIndex
                    ? "bg-primary/15 border-primary/45"
                    : "bg-black/30 border-transparent hover:bg-primary/5"
                }`}
              >
                <span className="font-mono text-primary/40 w-4 text-center">{idx + 1}</span>
                <img src={song.albumArt} alt="" className="w-8 h-8 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-[10px] text-foreground truncate">{song.songName}</p>
                  <p className="text-[9px] text-muted-foreground truncate">{song.authorName}</p>
                </div>
                <button
                  onClick={(e) => removeFromPlaylist(idx, e)}
                  className="p-1.5 hover:text-red-400 text-muted-foreground/60 transition-colors cursor-pointer"
                  title="Remove from playlist"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SWSMusicPlayer;
