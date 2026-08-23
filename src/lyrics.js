import { vocalTiming } from './vocalTiming.js';

export const DURATION = 146.82;

const lyricRows = [
  { t: 11.85, jp: '偶然それはそこにいて，', zh: '偶然它就在那儿，', motion: 'drift' },
  { t: 14.56, jp: 'ただ、そこにいて，', zh: '仅仅只是、待在那儿，', motion: 'still' },
  { t: 17.27, jp: '相対、幸いわたしには目もくれずいた…？', zh: '相对、所幸的是它看都不看我一眼……？', motion: 'avoid' },
  { t: 21.05, jp: 'きっと，', zh: '这肯定的啊，', motion: 'doubt' },
  { t: 22.69, jp: '咲いた花は誰かのためじゃない，', zh: '肆意盛放的花可不是为了任何人，', motion: 'bloom' },
  { t: 29.2, jp: '画面の向こうで手を振ってるあの人も，', zh: '在屏幕那头挥手的那家伙，', motion: 'screen' },
  { t: 35.03, jp: 'ゆっくり　しずかに，', zh: '正慢慢地 悄悄地，', motion: 'slow' },
  { t: 37.67, jp: '気づかれないように，', zh: '为了不被人察觉地，', motion: 'hide' },
  { t: 40.4, jp: 'じわりと触られてる，', zh: '一点一点地触碰着我，', motion: 'touch' },
  { t: 43.35, jp: '気がして，', zh: '有所察觉，', motion: 'notice' },
  { t: 45.92, jp: '寝苦しい夜に終わりなどないな，', zh: '辗转难眠的夜晚 看来是永无止境了，', motion: 'burst' },
  { t: 52.35, jp: '幸せって実はどこにもなくてェ…，', zh: '所谓的幸福 其实哪儿都找不到啊……，', motion: 'hollow' },
  { t: 58.12, jp: 'たどり着いたとて満たされないとか，', zh: '就算抵达目的地 也注定不会得到满足，', motion: 'unfilled' },
  { t: 63.95, jp: 'いいから、眠りに就こうよ，', zh: '算了、还是闭上眼睡觉吧，', motion: 'sleep' },
  { t: 69.74, jp: '何を観ても聴いても響かない，', zh: '不管看什么听什么都无动于衷，', motion: 'mute' },
  { t: 72.59, jp: 'サッと通り過ぎる黒猫にビビって，', zh: '被突然窜过的黑猫吓得心惊胆跳，', motion: 'cat' },
  { t: 76.06, jp: '占いに怯えて，', zh: '还会对占卜的结果深感惶恐，', motion: 'fortune' },
  { t: 78.42, jp: '馬鹿らしいけどさ…，', zh: '虽然听起来确实挺傻的……，', motion: 'shrink' },
  { t: 80.79, jp: '流れた星に願うこと，', zh: '看到流星划过夜空 只得许愿，', motion: 'meteor' },
  { t: 83.38, jp: 'どうかここには落ちないでと，', zh: '祈求千万不要掉在我这里，', motion: 'repel' },
  { t: 86.34, jp: '星座みたいに，', zh: '仿佛勾勒星座那样，', motion: 'constellation' },
  { t: 88.26, jp: '線を引いてしまう性にもう，', zh: '总习惯于划清界限的毛病，', motion: 'connect' },
  { t: 90.43, jp: '嫌気が差している，', zh: '对此我已经彻底受够了，', motion: 'reject' },
  { t: 95.42, jp: '朝の占い、良くなかったから，', zh: '因为早上占卜的结果、非常不好，', motion: 'evidence' },
  { t: 101.18, jp: '泥濘踏んじゃったから，', zh: '因为不小心踩到泥坑了，', motion: 'evidence' },
  { t: 106.94, jp: 'あのときわたし、笑えなかったから，', zh: '因为那时候我、也没能挤出一丝笑容，', motion: 'evidence' },
  { t: 112.39, jp: '世界の全てが，', zh: '忍不住想着  这世界上的一切，', motion: 'world' },
  { t: 117.4, jp: 'アスファルトに転がる小石さえ，', zh: '甚至就连静躺在柏油路上的小石子，', motion: 'stone' },
  { t: 123.08, jp: '誰かが仕組んだ罠なのかもなんて，', zh: '都像是谁恶意设下的陷阱，', motion: 'trap' },
  { t: 129.03, jp: 'それでもいいと思えたら，', zh: '如果能觉得 这些都无所谓的话，', motion: 'release' },
  { t: 132.08, jp: '楽だろうな，', zh: '那该有多轻松啊，', motion: 'ease' },
  { t: 135.26, jp: '早く，', zh: '快点啊，', motion: 'hurry' },
  { t: 136.48, jp: '安らぎをくれよ，', zh: '给我一丝安宁吧，', motion: 'peace' },
  { t: 139.43, jp: 'なんでもいい，', zh: '怎样都好了，', motion: 'collapse' },
  { t: 141.1, jp: 'この縄を解いてほしいの，', zh: '我只想解开这根束缚我的绳子。', motion: 'rope' },
];

export const lyrics = lyricRows.map((item, index) => ({
  ...item,
  t: vocalTiming[index]?.t ?? item.t,
  beats: vocalTiming[index]?.beats ?? [],
}));

export const chapters = [
  { start: 0, end: 46.76, key: 'presence', label: '01 / PRESENCE' },
  { start: 46.76, end: 69.46, key: 'insomnia', label: '02 / INSOMNIA' },
  { start: 69.46, end: 95.22, key: 'omens', label: '03 / OMENS' },
  { start: 95.22, end: 128.98, key: 'conspiracy', label: '04 / CONSPIRACY' },
  { start: 128.98, end: DURATION, key: 'release', label: '05 / RELEASE' },
];

export function lyricAt(time) {
  let index = -1;
  for (let i = lyrics.length - 1; i >= 0; i -= 1) {
    if (time >= lyrics[i].t) { index = i; break; }
  }
  if (index < 0) return { index, item: null, progress: 0 };
  const item = lyrics[index];
  const end = lyrics[index + 1]?.t ?? DURATION;
  return { index, item, progress: Math.min(1, Math.max(0, (time - item.t) / (end - item.t))) };
}

export function chapterAt(time) {
  return chapters.find((chapter) => time >= chapter.start && time < chapter.end) ?? chapters.at(-1);
}
