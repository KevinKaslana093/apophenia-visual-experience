import { useEffect, useMemo, useRef, useState } from 'react';
import { LOVE_DURATION, loveCueAt, loveCues } from './loveLyrics';

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const clock = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

function splitVoices(text) {
  const parts = [];
  let depth = 0;
  let buffer = '';
  let backing = false;
  const flush = () => { if (buffer) parts.push({ text: buffer, backing }); buffer = ''; };
  for (const char of text) {
    if (char === '(') { flush(); depth += 1; backing = true; buffer += char; }
    else if (char === ')') { buffer += char; depth = Math.max(0, depth - 1); if (depth === 0) { flush(); backing = false; } }
    else buffer += char;
  }
  flush();
  return parts;
}

function LoveLine({ cue, index, progress, time }) {
  const parts = useMemo(() => splitVoices(cue.text), [cue.text]);
  const main = parts.filter(part => !part.backing).map(part => part.text).join(' ').replace(/\s+/g, ' ').trim();
  let wordIndex = 0;
  const totalWords = parts.reduce((sum, part) => sum + (part.text.match(/\S+/g)?.length || 0), 0);
  return <div className={`love-line mood-${cue.mood}`} style={{ '--line-p': progress, '--line-index': index }}>
    <div className="love-shadow" aria-hidden="true"><i>{main}</i><i>{main}</i><i>{main}</i></div>
    <div className="love-copy" aria-label={cue.text}>
      {parts.map((part, partIndex) => <span className={part.backing ? 'voice-back' : 'voice-main'} key={`${part.text}-${partIndex}`}>
        {part.text.split(/(\s+)/).map((token, tokenIndex) => {
          if (!token.trim()) return token;
          const current = wordIndex++;
          const phase = progress * Math.max(1, totalWords);
          const hit = clamp(1 - Math.abs(phase - current - .35) * 1.7);
          return <b key={`${token}-${tokenIndex}`} style={{ '--word': current, '--hit': hit, '--audio-age': time - cue.t }}>{token}</b>;
        })}
      </span>)}
    </div>
    <div className="love-line-meta"><span>{String(index + 1).padStart(2, '0')} / {loveCues.length}</span><b>{cue.mood.toUpperCase()}</b></div>
  </div>;
}

function LoveScene({ cue, progress }) {
  return <div className={`love-scene scene-${cue?.mood || 'prelude'}`} style={{ '--scene-p': progress }} aria-hidden="true">
    <div className="love-film" />
    <div className="love-ink">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
    <div className="love-labels"><span>DESIRE</span><span>APPROVAL</span><span>REPEAT</span><span>NEED</span></div>
    <div className="love-ribbons"><i /><i /><i /></div>
  </div>;
}

function LoveIntro({ start, back }) {
  return <main className="love-intro">
    <img src={`${import.meta.env.BASE_URL}covers/love-me.jpg`} alt="Love Me album cover" />
    <div className="love-intro-film" />
    <button className="love-intro-back" onClick={back}>← ARCHIVE</button>
    <div className="love-intro-title"><small>VISUAL STUDY / 002</small><h1>LOVE<br /><i>ME</i></h1><p>A STUDY OF NEED<br />VOICE / ECHO / ADHESION</p><button onClick={start}>ENTER THE SONG <b>04:25</b></button></div>
    <div className="love-intro-repeat">LOVE ME&nbsp;&nbsp;LOVE ME&nbsp;&nbsp;LOVE ME&nbsp;&nbsp;LOVE ME</div>
  </main>;
}

export default function LoveMeExperience({ onBack }) {
  const audio = useRef(null);
  const graph = useRef(null);
  const bins = useRef(null);
  const raf = useRef(null);
  const last = useRef(0);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [hud, setHud] = useState(false);
  const { index, cue, progress } = loveCueAt(time);

  useEffect(() => {
    audio.current = new Audio(`${import.meta.env.BASE_URL}audio/love-me.mp3`);
    audio.current.preload = 'auto';
    audio.current.addEventListener('ended', () => setPlaying(false));
    return () => { cancelAnimationFrame(raf.current); audio.current?.pause(); graph.current?.context.close(); };
  }, []);

  const prepareGraph = async () => {
    if (!graph.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = .64;
      const source = context.createMediaElementSource(audio.current);
      source.connect(analyser); analyser.connect(context.destination);
      bins.current = new Uint8Array(analyser.frequencyBinCount);
      graph.current = { context, analyser, source };
    }
    if (graph.current.context.state === 'suspended') await graph.current.context.resume();
  };

  const loop = stamp => {
    if (audio.current && stamp - last.current > 32) {
      last.current = stamp;
      setTime(audio.current.currentTime);
      if (graph.current && bins.current) {
        graph.current.analyser.getByteFrequencyData(bins.current);
        const avg = (a, b) => { let sum = 0; for (let i = a; i <= b; i += 1) sum += bins.current[i] || 0; return sum / ((b - a + 1) * 255); };
        const bass = avg(1, 5), body = avg(6, 22), air = avg(23, 74);
        document.documentElement.style.setProperty('--lm-bass', bass.toFixed(3));
        document.documentElement.style.setProperty('--lm-body', body.toFixed(3));
        document.documentElement.style.setProperty('--lm-air', air.toFixed(3));
      }
    }
    raf.current = requestAnimationFrame(loop);
  };

  const toggle = async value => {
    if (value) { await prepareGraph(); await audio.current.play(); setPlaying(true); setHud(false); cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(loop); }
    else { audio.current.pause(); setPlaying(false); setHud(true); cancelAnimationFrame(raf.current); setTime(audio.current.currentTime); }
  };
  const start = async () => { setEntered(true); await toggle(true); };
  const seek = value => { audio.current.currentTime = value; setTime(value); };
  const leave = () => { audio.current?.pause(); cancelAnimationFrame(raf.current); onBack(); };

  useEffect(() => {
    const key = event => {
      if (!entered) return;
      if (event.code === 'Space') { event.preventDefault(); toggle(!playing); }
      if (event.code === 'Escape') leave();
      if (event.code === 'KeyH') setHud(value => !value);
    };
    addEventListener('keydown', key); return () => removeEventListener('keydown', key);
  }, [entered, playing]);

  if (!entered) return <LoveIntro start={start} back={onBack} />;
  return <main className={`love-experience ${playing ? 'playing' : 'paused'}`} onClick={event => { if (!event.target.closest('.love-hud,.love-return')) setHud(value => !value); }}>
    <LoveScene cue={cue} progress={progress} />
    {!cue && <div className="love-prelude"><span>LOVE ME</span><i /></div>}
    {cue && <LoveLine cue={cue} index={index} progress={progress} time={time} />}
    <button className="love-return" onClick={leave}>← ARCHIVE</button>
    <div className={`love-hud ${hud ? 'shown' : ''}`}>
      <div><b>LOVE ME</b><span>{cue?.mood.toUpperCase() || 'PRELUDE'}</span></div>
      <section><button onClick={() => toggle(!playing)}>{playing ? 'Ⅱ' : '▶'}</button><time>{clock(time)}</time><input type="range" min="0" max={audio.current?.duration || LOVE_DURATION} step=".01" value={time} onChange={event => seek(Number(event.target.value))} /><time>{clock(audio.current?.duration || LOVE_DURATION)}</time></section>
    </div>
  </main>;
}
