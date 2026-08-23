export const LOVE_DURATION = 265.334;

export const loveLines = [
  'Love me, love me, love me, love me',
  'Oh babyLove me (love me), love me (love me), love me (yeah yeah yeah (love me) yeah yeah)',
  'Oh baby (love me), oh love me (love me), love me (love me)',
  'Yeah yeah yeah yeah yeah yeah Oh baby (love me)',
  'ohh love meLove me, love me oh baby (Yeah yeah yeah yeah yeah yeah)',
  "Yeah-ah, won't you say that you love me",
  "Swear you're gonna love me",
  'Give you a little honey',
  'Make you spend a little money',
  "You don't need it anyway, no",
  'Not for nothing',
  'You know imma keep it coming',
  'Imma keep this party running',
  "You ain't even gotta say, no (Ooooh)",
  "Uh yeah You ain't even gotta say",
  'Mmm, mmm (ye ye yeah)',
  "You ain't even gotta say (Ooooh)",
  'Uh yeah Yeah yeah yeah',
  'I want you to love me',
  'Love me, love me, love me, oh baby',
  'Love me (love me), love me (love me), love me',
  'Yeah yeah yeah yeah yeah yeah (love me)',
  'Oh baby (love me) Oh, love me (love me) Love me (love me)',
  'Yeah yeah yeah yeah yeah yeah (oh baby) Oh baby (love me)',
  'Oh, love me (love me) Love me (love me)',
  'Yeah yeah yeah yeah yeah yeah (oh baby)',
  'Love me, love me oh baby',
  "Won't you say that you love me",
  'Mama, love me',
  'Papa, love me',
  'Brother, love me',
  'Sister, love me',
  'And all the rest of my family',
  'That always wants to just judge me',
  "Save a little bit of your energy'",
  "Cause a little bit of love is what I need, yeah",
  'Judas, yeah',
  'Jesus, yeah',
  'Accept me in the gates of heaven, yeah',
  'Influence, yeah (Oh yeah)',
  'Creedence, yeah',
  "I'm a sinner, I'm a sinner",
  'I want you to love me, love me, love me, love me',
  'Oh baby',
  'Love me, love me, love me, love me',
  'Love me baby, yeah (ooh love me, love me, love me)',
  'Love me baby, yeah (ooh love me)',
  'Love me',
  'Love me, oh baby',
  'Yeah',
  "Won't you say that you love me",
  'Love me',
  'Love me oh baby, yeah',
  "Won't you say that you love me",
];

export const loveStarts = [
  2.0,8.0,16.0,23.0,31.0,42.0,
  48.0,53.0,58.0,63.0,68.0,72.92,76.0,79.89,84.0,88.0,92.0,96.0,100.0,
  104.0,110.0,116.0,121.0,127.0,133.0,139.0,145.0,151.0,
  158.0,162.0,166.0,170.0,174.0,179.0,185.0,191.0,
  198.0,201.0,204.0,210.0,214.0,218.0,222.0,
  227.0,231.0,234.0,239.0,244.0,248.0,251.0,254.0,257.0,260.0,263.0,
];

const moodAt = (index) => {
  if (index < 6) return 'adhesive';
  if (index < 13) return 'transaction';
  if (index < 19) return 'party';
  if (index < 28) return 'chorus';
  if (index < 36) return 'family';
  if (index < 43) return 'confession';
  return 'finale';
};

export const loveCues = loveLines.map((text, index) => ({
  text,
  t: loveStarts[index],
  mood: moodAt(index),
}));

export function loveCueAt(time) {
  let index = -1;
  for (let i = loveCues.length - 1; i >= 0; i -= 1) {
    if (time >= loveCues[i].t) { index = i; break; }
  }
  if (index < 0) return { index, cue: null, progress: 0 };
  const cue = loveCues[index];
  const end = loveCues[index + 1]?.t ?? LOVE_DURATION;
  return { index, cue, progress: Math.max(0, Math.min(1, (time - cue.t) / (end - cue.t))) };
}
