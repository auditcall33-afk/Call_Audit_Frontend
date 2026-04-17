import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX,
  PhoneCall, FileText, Hash
} from 'lucide-react';
import './AudioPlayer.css';

const formatTime = (s) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function AudioPlayer({ metadata = {} }) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Synthetic demo audio – use a sample public MP3
  const audioSrc = metadata.audioSrc || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onLoaded = () => setDuration(el.duration);
    const onTime   = () => !dragging && setCurrentTime(el.currentTime);
    const onEnded  = () => setPlaying(false);
    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
    };
  }, [dragging]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { await el.play().catch(() => {}); setPlaying(true); }
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v === 0) setMuted(true);
    else setMuted(false);
  };

  const toggleMute = () => {
    setMuted(m => {
      if (audioRef.current) audioRef.current.muted = !m;
      return !m;
    });
  };

  const seek = useCallback((e) => {
    const bar = progressRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const pct = Math.min(Math.max((x - rect.left) / rect.width, 0), 1);
    const t = pct * duration;
    setCurrentTime(t);
    if (audioRef.current) audioRef.current.currentTime = t;
  }, [duration]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const {
    vlogCallNumber = 'VCN-2024-001842',
    cli            = '+91-98765-43210',
    recordFileName = 'REC_20240413_154512_V001842.mp3',
    agentName      = 'Saanvi Sharma',
    campaignName   = 'PLCS Retention Q2',
    callDate       = '13 Apr 2026, 3:45 PM',
  } = metadata;

  return (
    <div className="audio-player-card card">
      {/* Header */}
      <div className="ap-header">
        <div className="ap-title-group">
          <span className="ap-icon-wrap"><PhoneCall size={16} /></span>
          <div>
            <h2 className="ap-title">Call Recording</h2>
            <p className="ap-subtitle">{callDate}</p>
          </div>
        </div>
        <div className="ap-campaign-chip">{campaignName}</div>
      </div>

      {/* Metadata Row */}
      <div className="ap-meta-row">
        <div className="ap-meta-item">
          <Hash size={13} className="ap-meta-icon" />
          <div>
            <span className="ap-meta-label">Vlog Call No.</span>
            <span className="ap-meta-value">{vlogCallNumber}</span>
          </div>
        </div>
        <div className="ap-meta-item">
          <PhoneCall size={13} className="ap-meta-icon" />
          <div>
            <span className="ap-meta-label">CLI</span>
            <span className="ap-meta-value">{cli}</span>
          </div>
        </div>
        <div className="ap-meta-item" style={{ flex: 1.5 }}>
          <FileText size={13} className="ap-meta-icon" />
          <div>
            <span className="ap-meta-label">Record File Name</span>
            <span className="ap-meta-value ap-filename">{recordFileName}</span>
          </div>
        </div>
        <div className="ap-meta-item">
          <div className="ap-avatar">{agentName.charAt(0)}</div>
          <div>
            <span className="ap-meta-label">Agent</span>
            <span className="ap-meta-value">{agentName}</span>
          </div>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="ap-controls">
        <audio ref={audioRef} src={audioSrc} preload="metadata" />

        <button className="ap-play-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>

        <span className="ap-time">{formatTime(currentTime)}</span>

        <div
          className="ap-progress-track"
          ref={progressRef}
          onClick={seek}
          onMouseDown={e => { setDragging(true); seek(e); }}
          onMouseMove={e => dragging && seek(e)}
          onMouseUp={() => setDragging(false)}
          role="slider"
          aria-label="Seek"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        >
          <div className="ap-progress-bg" />
          <div className="ap-progress-fill" style={{ width: `${progress}%` }} />
          <div className="ap-progress-thumb" style={{ left: `${progress}%` }} />
        </div>

        <span className="ap-time">{formatTime(duration)}</span>

        <button className="ap-mute-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <input
          type="range" min="0" max="1" step="0.01"
          value={muted ? 0 : volume}
          onChange={handleVolumeChange}
          className="ap-volume-slider"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
