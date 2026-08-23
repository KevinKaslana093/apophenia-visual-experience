import { useEffect, useMemo, useRef, useState } from 'react';
import MagnetLines from './components/MagnetLines';
import Threads from './components/Threads';
import { DURATION, chapterAt, lyricAt, lyrics } from './lyrics';

const pad = (value) => String(Math.floor(value)).padStart(2, '0');
const clock = (value) => `${pad(value / 60)}:${pad(value % 60)}`;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const displayText = (value) => value.replace(/[，,、。．.]/g, '');
const COLORS = {
  black: [5, 5, 5],
  red: [237, 46, 37],
  paper: [232, 227, 218],
};
const mix = (from, to, amount) => from.map((value, i) => Math.round(value + (to[i] - value) * clamp(amount)));
const rgb = (color) => `rgb(${color.join(',')})`;

function paletteAt(time) {
  let background = COLORS.black;
  if (time >= 45.50 && time < 46.76) background = mix(COLORS.black, COLORS.red, (time - 45.50) / 1.26);
  else if (time >= 46.76 && time < 67.8) background = COLORS.red;
  else if (time >= 67.8 && time < 71.6) background = mix(COLORS.red, COLORS.black, (time - 67.8) / 3.8);
  else if (time >= 71.6 && time < 93.3) background = COLORS.black;
  else if (time >= 93.3 && time < 97.8) background = mix(COLORS.black, COLORS.paper, (time - 93.3) / 4.5);
  else if (time >= 97.8 && time < 126.2) background = COLORS.paper;
  else if (time >= 126.2 && time < 130.2) background = mix(COLORS.paper, COLORS.black, (time - 126.2) / 4);
  else if (time >= 130.2) background = COLORS.black;
  const luminance = background[0] * .299 + background[1] * .587 + background[2] * .114;
  const redField = time >= 46.12 && time < 69.2;
  return { background: rgb(background), foreground: luminance > 118 ? '#070707' : '#f0ece4', accent: redField ? '#070707' : '#ed2e25' };
}

function Intro({ onStart }) {
  return (
    <section className="intro">
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-copy">
        <span className="index">VISUAL STUDY / 001</span>
        <h1><span>アポ</span><span>フェニア</span></h1>
        <div className="intro-rule" />
        <p>偶然之间没有线<br />是我们忍不住把它们连在一起</p>
        <button onClick={onStart}><i />进入作品 <small>02:27</small></button>
      </div>
      <div className="intro-meta">黒うさぎ<br />AUDIO-DRIVEN TYPOGRAPHY<br />HEADPHONES RECOMMENDED</div>
    </section>
  );
}

function Bloom({ progress }) {
  return <div className="bloom" style={{ '--p': progress }}>{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>;
}

const constellationShapes = {
  eye: {
    stars: [[17,49],[27,38],[39,31],[52,35],[64,29],[76,38],[85,49],[75,59],[63,67],[51,61],[39,68],[27,59],[51,48],[58,48]],
    links: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,0],[3,12],[12,9],[12,13]],
  },
  wing: {
    stars: [[12,61],[22,55],[31,46],[39,35],[48,23],[54,43],[62,34],[70,28],[66,48],[78,43],[88,46],[59,60],[70,68],[82,73],[47,72],[34,78]],
    links: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[5,8],[8,9],[9,10],[5,11],[11,12],[12,13],[11,14],[14,15],[1,15]],
  },
  fracture: {
    stars: [[10,23],[23,31],[35,20],[48,39],[63,18],[78,27],[91,16],[18,69],[31,58],[46,76],[58,57],[72,74],[87,61],[51,49]],
    links: [[0,3],[1,13],[2,3],[3,4],[3,8],[4,6],[5,13],[7,8],[8,13],[9,13],[10,13],[11,10],[12,13]],
  },
  world: {
    stars: [[4,18],[13,72],[21,37],[29,87],[34,11],[42,59],[48,27],[54,81],[61,44],[67,7],[72,68],[79,31],[87,90],[94,54],[9,48],[25,61],[39,76],[57,16],[69,89],[83,12],[91,39],[48,48],[75,53],[18,20]],
    links: [[0,6],[0,15],[1,4],[1,21],[2,9],[2,16],[3,8],[3,19],[4,14],[4,22],[5,17],[5,20],[6,12],[6,22],[7,14],[7,20],[8,15],[8,19],[9,16],[9,21],[10,17],[10,23],[11,14],[11,18],[12,21],[13,16],[13,23],[14,21],[15,19],[15,22],[16,20],[17,22],[18,21],[19,23],[20,22]],
  },
};

function StarField({ trap = false, variant = 'scatter' }) {
  const generated = useMemo(() => Array.from({ length: 23 }, (_, i) => ({ x: (i * 37 + 9) % 96, y: (i * 61 + 13) % 88, s: 1 + (i % 3) })), []);
  const shape = constellationShapes[variant];
  const stars = shape ? shape.stars.map(([x, y], i) => ({ x, y, s: 1 + (i % 3) })) : generated;
  const links = shape?.links ?? stars.slice(0, 15).map((_, i) => [i, (i * 5 + 4) % stars.length]);
  return <svg className={`stars ${trap ? 'trap' : ''}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    {stars.map((star, i) => <circle key={i} cx={star.x} cy={star.y} r={star.s * .12} />)}
    {links.map(([from, to], i) => <line key={`l${variant}-${i}`} x1={stars[from].x} y1={stars[from].y} x2={stars[to].x} y2={stars[to].y} style={{ '--delay': `${i * .07}s` }} />)}
    {trap && stars.slice(0, 18).map((star, i) => <line key={`t${i}`} x1={star.x} y1={star.y} x2="50" y2="50" style={{ '--delay': `${i * .035}s` }} />)}
  </svg>;
}

function Evidence({ index }) {
  const items = ['RESULT / BAD', '泥濘 / TRACE', 'SMILE / MISSING'];
  return <div className="evidence-board">{items.map((text, i) => <div className={i <= index - 23 ? 'shown' : ''} key={text}><b>0{i + 1}</b><span>{text}</span><i /></div>)}</div>;
}

function KineticLine({ item, index, progress, time, exiting = false }) {
  if (!item) return null;
  const visualJp = displayText(item.jp);
  const visualZh = displayText(item.zh);
  const chars = [...visualJp];
  const beats = item.beats ?? [];
  return (
    <div className={`lyric motion-${item.motion} ${exiting ? 'is-exiting' : ''}`} key={`${index}-${item.jp}`} style={{ '--progress': progress }}>
      <div className="jp" aria-label={visualJp}>
        {chars.map((char, i) => {
          const beat = beats[i];
          const age = beat == null ? -1 : time - beat;
          const hit = age < 0 || age > .38 ? 0 : age < .08 ? age / .08 : 1 - (age - .08) / .30;
          const state = hit > 0 ? 'is-current' : beat != null && age >= .38 ? 'is-sung' : '';
          const fallOrder = item.motion === 'repel' ? [2, 4, 7, 9].indexOf(i) : -1;
          const fall = fallOrder < 0 ? 0 : clamp((time - (85.50 + fallOrder * .12)) / .82);
          return <span className={`${state} ${fall > 0 ? 'is-falling' : ''}`} key={`${char}-${i}`} style={{ '--char': i, '--count': chars.length, '--hit': clamp(hit), '--fall': fall, '--fall-order': fallOrder }}>{char}</span>;
        })}
      </div>
      <p className="zh" style={{ '--line-progress': progress }}>{visualZh}</p>
      <div className="line-number">{String(index + 1).padStart(2, '0')} / {String(lyrics.length).padStart(2, '0')}</div>
    </div>
  );
}

function VisualLayer({ time, active, index, item, progress, chapter }) {
  const constellation = ['constellation', 'connect', 'reject'].includes(item?.motion);
  const evidence = item?.motion === 'evidence';
  const worldMesh = ['world', 'stone', 'trap'].includes(item?.motion);
  const trapped = item?.motion === 'trap';
  const ending = chapter.key === 'release';
  const early = ['drift', 'still', 'avoid', 'doubt'].includes(item?.motion);
  const starVariant = item?.motion === 'constellation' ? 'eye' : item?.motion === 'connect' ? 'wing' : 'fracture';
  const palette = paletteAt(time);
  const naProgress = item?.motion === 'notice' ? clamp((time - 45.58) / 1.12) : 0;
  const naOpacity = Math.sin(naProgress * Math.PI);
  const lineAge = item ? time - item.t : 0;
  const previousItem = index > 0 && lineAge < .52 ? lyrics[index - 1] : null;
  const tension = chapter.key === 'insomnia'
    ? clamp(Math.min((time - 46.76) / 1.4, (69.46 - time) / 1.6))
    : 0;
  return (
    <div className={`visual chapter-${chapter.key} visual-${item?.motion ?? 'instrumental'} ${active ? 'is-playing' : ''}`} style={{ backgroundColor: palette.background, color: palette.foreground, '--accent': palette.accent, '--p': progress, '--na': naProgress, '--na-opacity': naOpacity, '--tension': tension }}>
      <div className="paper-noise" />
      <div className="scanlines" />
      <div className="ambient-motion" aria-hidden="true"><i /><i /><i /></div>
      {chapter.key === 'insomnia' && <div className="red-tension" aria-hidden="true"><i /><i /><i /><b /><b /><span /></div>}
      {chapter.key === 'insomnia' && <div className={`red-scene red-scene-${item?.motion}`} aria-hidden="true"><i /><i /><i /><b /><b /></div>}
      {time >= 94.72 && time < 95.72 && <div className="bw-error" aria-hidden="true"><i /><i /><i /><b>ERR&nbsp;&nbsp;PATTERN / 23</b></div>}
      {item?.motion === 'trap' && lineAge < .82 && <div className="trap-impact" aria-hidden="true"><i /><i /><b /></div>}
      {early && <div className="early-field" aria-hidden="true"><i /><i /><i /><b /><b /></div>}
      <div className="red-orbit" />
      {item?.motion === 'notice' && <div className="na-transition" aria-hidden="true"><i /><i /><span>ね</span></div>}
      {item?.motion === 'bloom' && <Bloom progress={progress} />}
      {item?.motion === 'screen' && <div className="false-screen"><i /><i /><i /><b>?</b></div>}
      {item?.motion === 'touch' && <div className="touch-field"><i /><i /><i /></div>}
      {item?.motion === 'cat' && <div className="black-cat"><i /><b /></div>}
      {['meteor', 'repel'].includes(item?.motion) && <div className="meteor"><i /><b /></div>}
      {constellation && <><StarField key={starVariant} variant={starVariant} /><MagnetLines active rows={7} columns={11} /></>}
      {evidence && <Evidence index={index} />}
      {worldMesh && <StarField key="world-mesh" variant="world" trap={trapped} />}
      {item?.motion === 'stone' && <div className="stone"><i /></div>}
      {ending && <Threads active fade={item?.motion === 'peace' ? .18 : .78} amplitude={item?.motion === 'rope' ? .92 : .36} distance={item?.motion === 'rope' ? .16 : .72} />}
      {previousItem && <KineticLine item={previousItem} index={index - 1} progress={1} time={time} exiting />}
      <KineticLine item={item} index={index} progress={progress} time={time} />
    </div>
  );
}

function Player({ audio, time, playing, setPlaying, seek, chapter, showTranslation, setShowTranslation, visible }) {
  return (
    <div className={`hud ${visible ? '' : 'hidden'}`}>
      <div className="hud-top"><b>アポフェニア</b><span>{chapter.label}</span><button onClick={() => setShowTranslation(!showTranslation)}>{showTranslation ? '中译 ON' : '中译 OFF'}</button></div>
      <div className="transport">
        <button className="play" onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ' : '▶'}</button>
        <span>{clock(time)}</span>
        <input aria-label="播放进度" type="range" min="0" max={audio.current?.duration || DURATION} step="0.01" value={time} onChange={(e) => seek(Number(e.target.value))} />
        <span>{clock(audio.current?.duration || DURATION)}</span>
        <button className="full" onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()}>⛶</button>
      </div>
    </div>
  );
}

export default function App() {
  const audio = useRef(null);
  const audioGraph = useRef(null);
  const spectrum = useRef(null);
  const bassMemory = useRef(0);
  const frame = useRef();
  const lastVisualFrame = useRef(0);
  const [entered, setEntered] = useState(false);
  const [playing, setPlayingState] = useState(false);
  const [time, setTime] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);
  const { index, item, progress } = lyricAt(time);
  const chapter = chapterAt(time);

  useEffect(() => {
    audio.current = new Audio(`${import.meta.env.BASE_URL}audio/apophenia.mp3`);
    audio.current.preload = 'auto';
    audio.current.addEventListener('ended', () => setPlayingState(false));
    return () => { cancelAnimationFrame(frame.current); audio.current?.pause(); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('hide-translation', !showTranslation);
  }, [showTranslation]);

  const loop = (stamp = 0) => {
    if (audio.current && stamp - lastVisualFrame.current >= 32) {
      lastVisualFrame.current = stamp;
      setTime(audio.current.currentTime);
      if (audioGraph.current && spectrum.current) {
        audioGraph.current.analyser.getByteFrequencyData(spectrum.current);
        const bins = spectrum.current;
        const average = (from, to) => {
          let total = 0;
          for (let i = from; i <= to; i += 1) total += bins[i] || 0;
          return total / ((to - from + 1) * 255);
        };
        const rawBass = average(1, 5);
        const body = average(5, 18);
        const edge = average(18, 58);
        const bass = bassMemory.current + (rawBass - bassMemory.current) * (rawBass > bassMemory.current ? .72 : .16);
        const beat = clamp((rawBass - bassMemory.current) * 4.6 + rawBass * .34);
        bassMemory.current = bass;
        document.documentElement.style.setProperty('--bass', bass.toFixed(3));
        document.documentElement.style.setProperty('--body', body.toFixed(3));
        document.documentElement.style.setProperty('--edge', edge.toFixed(3));
        document.documentElement.style.setProperty('--beat', beat.toFixed(3));
      }
    }
    frame.current = requestAnimationFrame(loop);
  };
  const prepareAudioGraph = async () => {
    if (!audio.current) return;
    if (!audioGraph.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = .58;
      const source = context.createMediaElementSource(audio.current);
      source.connect(analyser);
      analyser.connect(context.destination);
      spectrum.current = new Uint8Array(analyser.frequencyBinCount);
      audioGraph.current = { context, analyser, source };
    }
    if (audioGraph.current.context.state === 'suspended') await audioGraph.current.context.resume();
  };
  const setPlaying = async (value) => {
    if (!audio.current) return;
    if (value) { await prepareAudioGraph(); await audio.current.play(); setPlayingState(true); setControlsVisible(false); cancelAnimationFrame(frame.current); frame.current = requestAnimationFrame(loop); }
    else { audio.current.pause(); setPlayingState(false); setControlsVisible(true); cancelAnimationFrame(frame.current); setTime(audio.current.currentTime); }
  };
  const start = async () => { setEntered(true); await setPlaying(true); };
  const seek = (value) => { if (!audio.current) return; audio.current.currentTime = value; setTime(value); };

  useEffect(() => {
    const keys = (event) => {
      if (!entered) return;
      if (event.code === 'Space') { event.preventDefault(); setPlaying(!playing); }
      if (event.code === 'KeyH') setControlsVisible((visible) => !visible);
      if (event.code === 'ArrowRight') seek(clamp(time + 5, 0, audio.current?.duration || DURATION));
      if (event.code === 'ArrowLeft') seek(clamp(time - 5, 0, audio.current?.duration || DURATION));
    };
    addEventListener('keydown', keys); return () => removeEventListener('keydown', keys);
  }, [entered, playing, time]);

  if (!entered) return <Intro onStart={start} />;
  return (
    <main
      className={`experience ${controlsVisible ? 'controls-visible' : 'controls-hidden'}`}
      onClick={(event) => {
        if (event.target.closest('.hud')) return;
        setControlsVisible((visible) => !visible);
      }}
    >
      <VisualLayer time={time} active={playing} index={index} item={item} progress={progress} chapter={chapter} />
      {!item && <><div className="instrumental"><span>APOPHENIA</span><i /></div><div className="intro-pulses" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div></>}
      <Player audio={audio} time={time} playing={playing} setPlaying={setPlaying} seek={seek} chapter={chapter} showTranslation={showTranslation} setShowTranslation={setShowTranslation} visible={controlsVisible} />
    </main>
  );
}
