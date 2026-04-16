"use client";
import { useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';
import Countdown from 'react-countdown';
import { Fireworks } from '@fireworks-js/react';
import type { FireworksHandlers } from '@fireworks-js/react';
import { sponsorUrls } from './photos';
import useExitPrompt from './useExitPrompt.js';

const OFFICIAL_END = Date.UTC(2026, 4, 30, 17, 0, 0);

const SOUNDS = [
  { label: '🙈 Airball',      song: 'airball'    },
  { label: "🇺🇸 L'américain", song: 'usa',       random: true },
  { label: '💥 Kaboom',       song: 'kaboom',    random: true },
  { label: '🙅 No good',      song: 'no-good'    },
  { label: '🔥 On fire',      song: 'on-fire'    },
  { label: 'Too easy',        song: 'too-easy'   },
  { label: '🫨 Wild shot',    song: 'wild-shot'  },
  { label: '🎉 Tada',         song: 'tada'       },
  { label: '💨 Pet',          song: 'fart'       },
  { label: '📯 Horn',         song: 'horn'       },
];

// ↑↑↓↓←→←→BA
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export default function Scoreboard() {
  const [scoreBlue, setScoreBlue] = useState(() =>
    typeof window !== 'undefined' ? Number(localStorage.getItem('scoreBlue')) || 0 : 0
  );
  const [scoreRed, setScoreRed] = useState(() =>
    typeof window !== 'undefined' ? Number(localStorage.getItem('scoreRed')) || 0 : 0
  );
  const [isMuted, setIsMuted]       = useState(false);
  const [playingSong, setPlayingSong] = useState<string | null>(null);
  const [shakeBlue, setShakeBlue]   = useState(false);
  const [shakeRed, setShakeRed]     = useState(false);
  const [timerUrgency, setTimerUrgency] = useState<'normal' | 'warning' | 'critical'>('normal');
  const fireworksRef = useRef<FireworksHandlers>(null);
  const konamiSeq    = useRef<string[]>([]);

  useExitPrompt(true);

  useEffect(() => { localStorage.setItem('scoreBlue', String(scoreBlue)); }, [scoreBlue]);
  useEffect(() => { localStorage.setItem('scoreRed',  String(scoreRed));  }, [scoreRed]);

  // Easter egg : code Konami → feux d'artifices + tada
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      konamiSeq.current = [...konamiSeq.current, e.key].slice(-KONAMI.length);
      if (konamiSeq.current.join(',') === KONAMI.join(',')) {
        const fw = fireworksRef.current;
        if (fw) {
          fw.updateSize({ height: window.innerHeight, width: window.innerWidth });
          fw.start();
          setTimeout(() => fw.stop(), 6000);
        }
        new Howl({ src: ['tada.mp3'], html5: true }).play();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  function handleComplete() {
    const fw = fireworksRef.current;
    if (!fw) return;
    fw.updateSize({ height: window.innerHeight, width: window.innerWidth });
    fw.start();
  }

  function onTick({ total }: { total: number }) {
    const next: typeof timerUrgency =
      total <= 60_000  ? 'critical' :
      total <= 300_000 ? 'warning'  : 'normal';
    setTimerUrgency(prev => prev === next ? prev : next);
  }

  function inc(delta: number, score: number, set: (n: number) => void, setShake: (b: boolean) => void) {
    if (score + delta < 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    set(score + delta);
  }

  function toggleMute() {
    const next = !isMuted;
    setIsMuted(next);
    Howler.volume(next ? 0 : 1);
  }

  function playSong(song: string, random = false) {
    if (isMuted) return;
    const suffix = random ? `-${Math.floor(Math.random() * 2) + 1}` : '';
    if (playingSong !== null) Howler.stop();
    const sound = new Howl({ src: [`${song}${suffix}.mp3`], html5: true });
    sound.play();
    setPlayingSong(song);
    sound.on('end', () => setPlayingSong(null));
  }

  return (
    <div className="scoreboard">
      <Fireworks
        ref={fireworksRef}
        autostart={false}
        options={{ opacity: 0.5 }}
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 50, pointerEvents: 'none' }}
      />

      {/* ── Header ── */}
      <header className="scoreboard__header">
        <span className="scoreboard__title">🏀 Chrono 24h Basket 2025</span>
        <button className="btn-mute" onClick={toggleMute}>
          {isMuted ? '🔈 Son off' : '🔇 Mute'}
        </button>
      </header>

      {/* ── Countdown ── */}
      <div className="scoreboard__timer">
        <Countdown
          date={OFFICIAL_END}
          daysInHours
          onComplete={handleComplete}
          onTick={onTick}
          renderer={({ formatted, completed }) =>
            completed ? (
              <span className="timer-display timer-display--finished">FIN !</span>
            ) : (
              <span className={`timer-display timer-display--${timerUrgency}`}>
                {formatted.hours}:{formatted.minutes}:{formatted.seconds}
              </span>
            )
          }
        />
      </div>

      {/* ── Scores ── */}
      <div className="scoreboard__scores">
        <div className="scoreboard__teams">

          {/* Équipe Bleue */}
          <div className="team team--blue">
            <span key={`flash-blue-${scoreBlue}`} className="team__flash" aria-hidden="true" />
            <span className="team__name">Équipe Bleue</span>
            <span key={scoreBlue} className={`team__score${shakeBlue ? ' team__score--shake' : ''}`}>
              {scoreBlue}
            </span>
            <div className="team__controls">
              <button className="btn-score btn-score--add" onClick={() => inc(+2, scoreBlue, setScoreBlue, setShakeBlue)}>+2</button>
              <button className="btn-score btn-score--add" onClick={() => inc(+3, scoreBlue, setScoreBlue, setShakeBlue)}>+3</button>
              <button className="btn-score btn-score--sub" onClick={() => inc(-2, scoreBlue, setScoreBlue, setShakeBlue)}>−2</button>
              <button className="btn-score btn-score--sub" onClick={() => inc(-3, scoreBlue, setScoreBlue, setShakeBlue)}>−3</button>
            </div>
          </div>

          {/* Équipe Rouge */}
          <div className="team team--red">
            <span key={`flash-red-${scoreRed}`} className="team__flash" aria-hidden="true" />
            <span className="team__name">Équipe Rouge</span>
            <span key={scoreRed} className={`team__score${shakeRed ? ' team__score--shake' : ''}`}>
              {scoreRed}
            </span>
            <div className="team__controls">
              <button className="btn-score btn-score--add" onClick={() => inc(+2, scoreRed, setScoreRed, setShakeRed)}>+2</button>
              <button className="btn-score btn-score--add" onClick={() => inc(+3, scoreRed, setScoreRed, setShakeRed)}>+3</button>
              <button className="btn-score btn-score--sub" onClick={() => inc(-2, scoreRed, setScoreRed, setShakeRed)}>−2</button>
              <button className="btn-score btn-score--sub" onClick={() => inc(-3, scoreRed, setScoreRed, setShakeRed)}>−3</button>
            </div>
          </div>

        </div>

        {/* ── Sponsors ── */}
        <div className="scoreboard__sponsors">
          {sponsorUrls.map((src) => (
            <img key={src} src={src} alt="" className="sponsor-logo" />
          ))}
        </div>
      </div>

      {/* ── Sound Effects ── */}
      <div className="scoreboard__sounds">
        {SOUNDS.map(({ label, song, random }) => (
          <button
            key={song}
            className={`btn-sound${playingSong === song ? ' btn-sound--playing' : ''}`}
            onClick={() => playSong(song, random)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
