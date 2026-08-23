import { useState } from 'react';
import App from './App';
import LoveMeExperience from './LoveMe';

const records = [
  { id: 'apophenia', title: 'アポフェニア', artist: '黒うさぎ', cover: 'covers/apophenia.jpg', side: 'left', level: 2, color: '#3157ff' },
  { id: 'love-me', title: 'LOVE ME', artist: 'SOFT SPOT / 2023', cover: 'covers/love-me.jpg', side: 'right', level: 5, color: '#f2d500' },
  { id: 'future-03', title: 'UNTITLED / 003', artist: 'NAME TO BE FILLED', side: 'left', level: 8, color: '#837f78', locked: true },
  { id: 'future-04', title: 'UNTITLED / 004', artist: 'NAME TO BE FILLED', side: 'right', level: 11, color: '#837f78', locked: true },
];

function Landing({ enter }) {
  return <main className="museum-landing">
    <div className="museum-grain" />
    <div className="museum-door"><i /><i /><i /><span>02</span></div>
    <div className="museum-title">
      <small>A PRIVATE ARCHIVE OF SOUND &amp; MOTION</small>
      <h1>LISTEN<br /><em>WITH</em><br />YOUR EYES</h1>
      <p>两首歌 两种妄念<br />沿着声音向上走</p>
      <button onClick={enter}><span>进入音乐馆</span><i>↗</i></button>
    </div>
    <div className="museum-index">VISUAL MUSIC ARCHIVE<br />AUDIO / TYPE / MOTION<br />EST. 2026</div>
  </main>;
}

function RecordCard({ record, open }) {
  return <button
    className={`record-card ${record.side} ${record.locked ? 'locked' : ''}`}
    style={{ '--level': record.level, '--record-color': record.color }}
    onClick={() => !record.locked && open(record.id)}
  >
    <span className="record-number">0{record.level}</span>
    <span className="record-cover">
      {record.cover ? <img src={`${import.meta.env.BASE_URL}${record.cover}`} alt={`${record.title} album cover`} /> : <i />}
      <b>PLAY VISUAL</b>
    </span>
    <span className="record-copy"><strong>{record.title}</strong><small>{record.artist}</small></span>
  </button>;
}

function Gallery({ open, back }) {
  return <main className="gallery">
    <div className="gallery-fog" />
    <header className="gallery-head"><button onClick={back}>← EXIT</button><span>THE ASCENDING LISTENING ROOM</span><b>02 WORKS / 04 SLOTS</b></header>
    <div className="gallery-copy"><small>SELECT A RECORD</small><h2>沿声音<br />向上</h2></div>
    <div className="stair-world" aria-hidden="true">
      <div className="stair-spine">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ '--step': i }} />)}</div>
      <div className="walker"><i /><b /><span /><span /></div>
    </div>
    <section className="record-field">{records.map(record => <RecordCard key={record.id} record={record} open={open} />)}</section>
    <div className="gallery-hint">HOVER TO SHIFT<br />CLICK TO ENTER</div>
  </main>;
}

export default function Root() {
  const [view, setView] = useState('landing');
  if (view === 'landing') return <Landing enter={() => setView('gallery')} />;
  if (view === 'gallery') return <Gallery open={setView} back={() => setView('landing')} />;
  if (view === 'apophenia') return <div className="work-shell"><button className="work-back" onClick={() => setView('gallery')}>← 回到音乐回廊</button><App /></div>;
  if (view === 'love-me') return <LoveMeExperience onBack={() => setView('gallery')} />;
  return null;
}
