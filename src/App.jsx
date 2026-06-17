import { useState, useReducer, useEffect, useRef, useCallback } from "react";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap";
document.head.appendChild(FONT_LINK);

// ── Languages ─────────────────────────────────────────────────────────────────
const LANGS = [
  { code:"en", label:"English",    flag:"🇬🇧" },
  { code:"hi", label:"Hindi",      flag:"🇮🇳" },
  { code:"ta", label:"Tamil",      flag:"🇮🇳" },
  { code:"te", label:"Telugu",     flag:"🇮🇳" },
  { code:"kn", label:"Kannada",    flag:"🇮🇳" },
  { code:"ml", label:"Malayalam",  flag:"🇮🇳" },
  { code:"mr", label:"Marathi",    flag:"🇮🇳" },
  { code:"gu", label:"Gujarati",   flag:"🇮🇳" },
  { code:"bn", label:"Bengali",    flag:"🇧🇩" },
  { code:"pa", label:"Punjabi",    flag:"🇮🇳" },
  { code:"ur", label:"Urdu",       flag:"🇵🇰" },
  { code:"or", label:"Odia",       flag:"🇮🇳" },
  { code:"es", label:"Spanish",    flag:"🇪🇸" },
  { code:"fr", label:"French",     flag:"🇫🇷" },
  { code:"de", label:"German",     flag:"🇩🇪" },
  { code:"ja", label:"Japanese",   flag:"🇯🇵" },
  { code:"ar", label:"Arabic",     flag:"🇸🇦" },
  { code:"zh", label:"Chinese",    flag:"🇨🇳" },
  { code:"pt", label:"Portuguese", flag:"🇧🇷" },
  { code:"ru", label:"Russian",    flag:"🇷🇺" },
  { code:"ko", label:"Korean",     flag:"🇰🇷" },
  { code:"it", label:"Italian",    flag:"🇮🇹" },
];
const RTL = ["ar","ur"];

// ── Categories ────────────────────────────────────────────────────────────────
const CATS = {
  story:   { label:"Short Story", icon:"📖", color:"#E67E22" },
  biopic:  { label:"Biopic",      icon:"🎬", color:"#3498DB" },
  science: { label:"Science",     icon:"🔬", color:"#2ECC71" },
  history: { label:"History",     icon:"🏛️",  color:"#9B59B6" },
  travel:  { label:"Travel",      icon:"✈️",  color:"#1ABC9C" },
  mystery: { label:"Mystery",     icon:"🔍", color:"#95A5A6" },
  life:    { label:"Life",        icon:"🌿", color:"#E74C3C" },
  tech:    { label:"Technology",  icon:"💻", color:"#34495E" },
};

// ── Theme ─────────────────────────────────────────────────────────────────────
const TH = {
  bg:"#07070F", bg2:"#0D0D1A", card:"#111120", card2:"#181828",
  border:"#1E1E35", border2:"#252540",
  text:"#EEECf8", muted:"#8880AA", subtle:"#3A3858",
  accent:"#6C4FE8", accentL:"#9C7FFF", accentBg:"rgba(108,79,232,0.13)",
  pink:"#E84FA0", gold:"#F5C842", teal:"#3DD6C0", green:"#4AE880",
  grad1:"linear-gradient(135deg,#6C4FE8,#E84FA0)",
  grad2:"linear-gradient(135deg,#6C4FE8 0%,#3DD6C0 100%)",
  grad3:"linear-gradient(160deg,#0D0D1A 0%,#12102A 50%,#0A1520 100%)",
  navBg:"rgba(7,7,15,0.9)",
  shadow:"0 4px 24px rgba(0,0,0,0.5)",
  glowPurple:"0 0 40px rgba(108,79,232,0.25)",
  glowPink:"0 0 40px rgba(232,79,160,0.2)",
};

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id:1, name:"Priya Shankar",  username:"priya_writes", email:"priya@narratica.io", password:"demo123",
    avatar:"PS", bio:"Essayist & storyteller. Science, history, and the strange corners of the world. ✍️",
    location:"Mumbai, India", website:"priya.writes", joined:"2025-01-15T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#6C4FE8,#E84FA0)", verified:true, followers:[2,3,4,5,7,8], following:[2,3,6] },
  { id:2, name:"Marcus Osei",    username:"marcus_osei",  email:"marcus@narratica.io", password:"demo123",
    avatar:"MO", bio:"Fiction writer & travel journalist. If I'm not writing, I'm on a train somewhere. 🌍",
    location:"Accra, Ghana", website:"marcosei.stories", joined:"2025-03-22T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#1ABC9C,#34495E)", verified:false, followers:[1,4,6,9], following:[1,3,5] },
  { id:3, name:"Leila Nouri",    username:"leila_nouri",  email:"leila@narratica.io", password:"demo123",
    avatar:"LN", bio:"Science communicator. Making the universe feel personal, one article at a time. 🔬✨",
    location:"Tehran → London", website:"leilanouri.science", joined:"2025-06-10T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#2ECC71,#1ABC9C)", verified:true, followers:[1,2,5,7,8,9], following:[1,4] },
  { id:4, name:"Ananya Krishnan", username:"ananya_reads", email:"ananya@narratica.io", password:"demo123",
    avatar:"AK", bio:"Lifelong reader, occasional writer. Big fan of biopics and quiet mornings with coffee. ☕📚",
    location:"Chennai, India", website:"", joined:"2025-02-08T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#F5C842,#E67E22)", verified:false, followers:[1,2,3], following:[1,2,3] },
  { id:5, name:"Daniel Reyes",   username:"danreyes",     email:"daniel@narratica.io", password:"demo123",
    avatar:"DR", bio:"History nerd. I will talk about ancient libraries for far too long if you let me.",
    location:"Manila, Philippines", website:"danreyes.blog", joined:"2025-04-19T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#9B59B6,#3498DB)", verified:false, followers:[2,3], following:[1,3,2] },
  { id:6, name:"Sofia Petrov",   username:"sofia_writes_", email:"sofia@narratica.io", password:"demo123",
    avatar:"SP", bio:"Travel journalist chasing small stories in big cities. Currently somewhere in the Caucasus.",
    location:"Tbilisi, Georgia", website:"sofiapetrov.travel", joined:"2025-05-30T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#1ABC9C,#6C4FE8)", verified:true, followers:[1,2], following:[2] },
  { id:7, name:"Rahul Mehta",    username:"rahul_m",      email:"rahul@narratica.io", password:"demo123",
    avatar:"RM", bio:"Engineer by day, amateur astronomer by night. Here for the science deep-dives.",
    location:"Bengaluru, India", website:"", joined:"2025-07-02T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#3498DB,#2ECC71)", verified:false, followers:[3], following:[1,3] },
  { id:8, name:"Grace Okafor",   username:"grace_okafor", email:"grace@narratica.io", password:"demo123",
    avatar:"GO", bio:"Writing about loneliness, genius, and everything in between. Tesla broke my heart a little.",
    location:"Lagos, Nigeria", website:"graceokafor.com", joined:"2025-08-14T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#E84FA0,#9B59B6)", verified:false, followers:[1,3], following:[3] },
  { id:9, name:"Tomás Almeida",  username:"tomas_a",      email:"tomas@narratica.io", password:"demo123",
    avatar:"TA", bio:"Reader of mysteries, drinker of too much coffee. The Voynich Manuscript lives in my head rent-free.",
    location:"Lisbon, Portugal", website:"", joined:"2025-09-01T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#34495E,#95A5A6)", verified:false, followers:[2,3], following:[2] },
  { id:10, name:"SARABHOJI M",  username:"sarabhoji",  email:"sarabhoji@narratica.io", password:"demo123",
    avatar:"SM", bio:"Avid reader & storyteller. Exploring narrative history and deep science. 📝",
    location:"Chennai, India", website:"", joined:"2026-06-17T00:00:00Z",
    coverGrad:"linear-gradient(135deg,#2ecc71,#1abc9c)", verified:true, followers:[], following:[1,2,3] },
];

const SEED_POSTS = [
  { id:1, userId:1, category:"biopic", featured:true,
    title:"The Last Lecture: Randy Pausch and the Art of Living Fully",
    excerpt:"On September 18, 2007, a dying professor walked onto a stage at Carnegie Mellon and delivered a talk that 20 million people would watch. He had pancreatic cancer. He was the happiest man in the room.",
    body:`On September 18, 2007, a dying professor walked onto a stage at Carnegie Mellon and delivered a talk that 20 million people would watch. He had pancreatic cancer. Three to six months to live. And he was the happiest man in the room.

Randy Pausch was 47. His students called his lab "the Disneyland of universities." When diagnosed in 2006, he chose to use every remaining good day well.

The lecture was titled "Really Achieving Your Childhood Dreams." His wife Jai sat front row, unaware he had arranged for their wedding cake mid-lecture, because their anniversary was that week.

His core argument: brick walls are not there to stop you. They show how much you want something. They stop the people who don't want it enough.

"We cannot change the cards we are dealt," he told the audience, "just how we play the hand."

Randy Pausch died July 25, 2008 — ten months after his lecture. He was survived by Jai and their three children.

His lecture lives on. Not as a monument to tragedy. As an instruction manual for joy.`,
    tags:["inspiration","education","courage"], readTime:7, likes:312, likedBy:[2,3,4,5,7,8,9], bookmarkedBy:[3,4], createdAt:"2026-05-01T10:00:00Z" },
  { id:2, userId:2, category:"story", featured:true,
    title:"The Cartographer of Forgotten Rivers",
    excerpt:"In the village of Miren, there was a woman who mapped rivers that no longer existed. She was ninety-one, half-blind, and the most precise person Ezra had ever met.",
    body:`In the village of Miren, there was a woman who mapped rivers that no longer existed. Ninety-one years old, half-blind, the most precise person Ezra had ever met.

Her name was Salome Adira. She lived in a stone house near the dried-out gorge, drawing in ink so thin it looked like watercolor — except it never bled, never blurred, never lied.

"These rivers," he said. "None are on any current survey."

"No," she agreed, adding a tributary with three strokes.

"So why map them?"

She looked up. Eyes behind thick lenses, the color of old parchment. "Young man. When a river dries, where does it go?"

He opened his mouth for the geological answer. He stopped. "It goes somewhere that isn't here," he said carefully.

"Precisely. I keep record of where it went. Someone should."

He stayed three weeks. Each morning she unrolled a new map and told him a story.

"Every river is a library," she said on his last morning. "Water is an archivist."

She handed him a roll of paper tied with brown twine. A map of the town where he grew up — threaded with six rivers cutting through streets he walked every day.

At the bottom, in her precise hand: "The rivers are still there. Look for the dips in the road. They are not gone. They are only resting."`,
    tags:["fiction","memory","wonder"], readTime:6, likes:218, likedBy:[1,5,9], bookmarkedBy:[1,5], createdAt:"2026-05-08T10:00:00Z" },
  { id:3, userId:3, category:"science", featured:false,
    title:"The Woman Who Discovered the Universe Was Expanding (And Was Ignored)",
    excerpt:"In 1912, Henrietta Swan Leavitt published one of the most important measurements in astronomy. She was never credited. She didn't even have a telescope.",
    body:`In 1912, Henrietta Swan Leavitt published one of the most important measurements in the history of astronomy. She was never credited in her lifetime. She didn't even have a telescope.

Leavitt worked at Harvard as a "computer" — a human calculator analyzing photographic plates. Women were paid 25 cents an hour. They were not, in the institution's estimation, scientists.

What she found studying 1,777 stars was a pattern too clean to be coincidence: the brighter the Cepheid star, the longer its period. Always. Like clockwork.

This period-luminosity relationship gave astronomers a way to measure distances beyond our galaxy for the first time.

Edwin Hubble used Leavitt's calibration to prove the universe was expanding. Modern cosmology rests on Leavitt's ruler.

In 1926, a Swedish mathematician nominated her for the Nobel Prize. Leavitt had died of cancer four years earlier, at 53. Nobel Prizes aren't awarded posthumously.

The universe was telling its secrets. She was the one listening.`,
    tags:["astronomy","women-in-science","discovery"], readTime:8, likes:445, likedBy:[1,2,4,7], bookmarkedBy:[2,7], createdAt:"2026-05-15T10:00:00Z" },
  { id:4, userId:1, category:"mystery", featured:false,
    title:"The Voynich Manuscript: 600 Years of Beautiful Nonsense",
    excerpt:"Somewhere in Yale's Beinecke Library sits a book no one can read. It has defeated cryptographers, scholars, and AI systems. It might be a hoax. No one knows.",
    body:`Somewhere in Yale's Beinecke Library sits a book that no one can read.

The Voynich Manuscript — 240 pages of vellum from the early 15th century — is illustrated with plants that don't exist, solar diagrams matching no known cosmological system, and naked women bathing in pools connected by elaborate tubing.

All written in a script no one has ever deciphered.

In a century of attempts: the cryptanalyst who cracked Japan's "Purple" cipher worked on it for thirty years. Failed. A 2019 Bristol analysis found it has features of natural language — syntax-like clustering. Something is there. We don't know what.

Theories: medieval pharmacological handbook. Glossolalic religious trance writing. An elaborate 16th-century hoax. A Cathar heretic code.

What draws people isn't hope of cracking it. It's the object lesson in the limits of knowing. A human artifact, clearly meaning something to someone — and we cannot reach it.

Some messages were addressed to an audience that no longer exists.

The mystery is the better ending. I'm in no hurry to solve it.`,
    tags:["history","language","puzzles"], readTime:7, likes:398, likedBy:[1,3,9], bookmarkedBy:[9], createdAt:"2026-06-08T10:00:00Z" },
  { id:5, userId:2, category:"travel", featured:false,
    title:"Forty Hours in Tbilisi: The City That Runs on Wine and Warmth",
    excerpt:"The capital of Georgia sits at the intersection of Europe and Asia — not metaphorically. Persian balconies across from Soviet brutalism. A 4th-century church beside a glass bridge.",
    body:`The capital of Georgia sits at the intersection of Europe and Asia in a way that is not metaphorical. Standing in the old town: Persian balconies across from Soviet brutalism, a 4th-century church beside a 21st-century glass bridge.

I arrived Tuesday with forty hours between flights. My host was a retired engineer named Giorgi who had converted his apartment into a guesthouse "because I missed having people."

Seven in the morning. Khachapuri — Georgian cheese bread, legitimately one of the most comforting foods on earth. Coffee that seemed to refill by magic.

"You're alone," he said. Statement, not question.
"I'm between places."
"Tbilisi is good for that. You come between places, you leave knowing where you're going."

In the afternoon I climbed Narikala fortress. From up there: the Orthodox cathedral, the minaret, pink and blue balconies on houses that look structurally questionable but have stood since the 19th century.

A man sat next to me on the ramparts. We shared no language. He offered walnuts from his pocket. We sat in comfortable silence.

I didn't leave knowing where I was going. But I left knowing where I'd been.`,
    tags:["georgia","culture","food"], readTime:7, likes:267, likedBy:[1,6], bookmarkedBy:[6], createdAt:"2026-06-11T10:00:00Z" },
  { id:6, userId:3, category:"biopic", featured:false,
    title:"Nikola Tesla's Pigeon",
    excerpt:"In his final years, Tesla lived alone in a hotel room feeding pigeons. He had once lit 200 bulbs wirelessly from 40 km away. Now he was broke, alone, devoted to a single white bird.",
    body:`In his final years, Nikola Tesla lived alone in Room 3327 of the New Yorker Hotel, feeding pigeons from his window. He had once lit 200 light bulbs wirelessly from 40 kilometres away.

Now he was broke, alone, and devoted to a single white bird with grey-tipped wings.

He wrote: "I loved that pigeon as a man loves a woman, and she loved me. As long as I had her, there was a purpose to my life."

Born 1856 in Serbia. Photographic memory. Could visualize machines complete in his head and run them mentally. Arrived in New York with four cents in his pocket.

He won the War of Currents against Edison. Then, when Westinghouse faced financial difficulties, Tesla tore up the royalty contract that would have made him the world's first billionaire — out of loyalty.

He died alone on January 7, 1943. Age 86.

The honest lesson isn't "history will vindicate your genius." That's too comfortable. It's this: to be a full human being is to need something that reflects back at you — a person, an animal, a work — that says "you are here."

Tesla found it in a bird he fed from a hotel window.

It is not a triumphant ending. It is a true one.`,
    tags:["genius","loneliness","invention"], readTime:9, likes:521, likedBy:[1,2,3,4,7,8], bookmarkedBy:[1,8], createdAt:"2026-06-02T10:00:00Z" },
];

const SEED_COMMENTS = [
  { id:1, postId:1, userId:2, body:"That brick wall metaphor has been living rent-free in my head for years. Genuinely one of the most useful mental models I've ever encountered.", createdAt:"2026-05-02T10:00:00Z", likes:12, likedBy:[3,4] },
  { id:2, postId:1, userId:3, body:"He was performing joy while living through grief. That's not denial — that's an extraordinary act of will.", createdAt:"2026-05-03T10:00:00Z", likes:18, likedBy:[1,2,4,7] },
  { id:3, postId:1, userId:4, body:"I show this lecture to every new team I manage. The line about brick walls showing how much you want something changed how I think about setbacks at work.", createdAt:"2026-05-04T14:20:00Z", likes:9, likedBy:[1,3] },
  { id:4, postId:1, userId:7, body:"The detail about the wedding cake being wheeled out mid-lecture while his wife wept in the front row — that's the part that gets me every time, not the speech itself.", createdAt:"2026-05-05T09:10:00Z", likes:14, likedBy:[1,2] },
  { id:5, postId:2, userId:1, body:"'Every river is a library.' That line wrecked me. I'll be thinking about it for weeks.", createdAt:"2026-05-09T10:00:00Z", likes:9, likedBy:[2,5] },
  { id:6, postId:2, userId:5, body:"As someone obsessed with maps and lost history, this is exactly the kind of quiet, patient storytelling I come to Narratica for. Salome deserves a whole book.", createdAt:"2026-05-10T11:45:00Z", likes:11, likedBy:[2,1] },
  { id:7, postId:2, userId:9, body:"The twist that the map he's handed is of his own hometown got me. Didn't expect a short story about cartography to feel this personal.", createdAt:"2026-05-11T08:30:00Z", likes:7, likedBy:[2] },
  { id:8, postId:3, userId:2, body:"The injustice of the Nobel rule is real but — she was doing it with no expectation of recognition. That's a different kind of greatness.", createdAt:"2026-05-16T10:00:00Z", likes:22, likedBy:[1,3,7] },
  { id:9, postId:3, userId:7, body:"As someone who works with data for a living, the idea that she found this pattern by hand, on glass plates, with a hearing impairment and no telescope — it's almost unbelievable.", createdAt:"2026-05-17T13:05:00Z", likes:19, likedBy:[1,3,2] },
  { id:10, postId:3, userId:4, body:"'The universe was telling its secrets. She was the one listening.' I had to stop reading for a second after that line.", createdAt:"2026-05-18T16:40:00Z", likes:15, likedBy:[3] },
  { id:11, postId:4, userId:9, body:"I've fallen down this rabbit hole more times than I'd like to admit. The Bristol statistical analysis finding syntax-like patterns is the detail that keeps me up at night.", createdAt:"2026-06-09T12:00:00Z", likes:13, likedBy:[1,3] },
  { id:12, postId:4, userId:1, body:"'Some doors were never meant for us' might be the best closing line I've read on this whole platform.", createdAt:"2026-06-09T15:30:00Z", likes:16, likedBy:[3,9] },
  { id:13, postId:5, userId:1, body:"Tbilisi has been on my list for years and this piece just moved it to the top. The detail about sharing walnuts in silence with a stranger is so quietly perfect.", createdAt:"2026-06-12T09:15:00Z", likes:10, likedBy:[2,6] },
  { id:14, postId:5, userId:6, body:"As someone living in Tbilisi right now — you captured Giorgi-type hospitality perfectly. This city does this to every visitor, every time.", createdAt:"2026-06-12T18:50:00Z", likes:21, likedBy:[2,1] },
  { id:15, postId:6, userId:1, body:"'It is not a triumphant ending. It is a true one.' That last line absolutely wrecked me.", createdAt:"2026-06-03T10:00:00Z", likes:34, likedBy:[2,3,4,7,8] },
  { id:16, postId:6, userId:8, body:"The detail about him tearing up the royalty contract out of loyalty to Westinghouse — that single decision cost him more than most people will ever earn. And he didn't regret it.", createdAt:"2026-06-04T08:20:00Z", likes:27, likedBy:[1,3,2] },
  { id:17, postId:6, userId:3, body:"I come back to this piece every few months. The pigeon detail humanizes him in a way no list of patents ever could.", createdAt:"2026-06-05T11:00:00Z", likes:23, likedBy:[1,8] },
];

// ── Persistent Storage ─────────────────────────────────────────────────────────
const STORE_KEY = "narratica_v1";
const SEED_VERSION = 3;
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed._seedVersion === SEED_VERSION) return parsed;
    }
  } catch {}
  return null;
}
function saveStore(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify({...s, _seedVersion: SEED_VERSION})); } catch {}
}
function loadUser() {
  try {
    const raw = localStorage.getItem(STORE_KEY + "_cu");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}
function saveUser(u) {
  try {
    if (u) localStorage.setItem(STORE_KEY + "_cu", JSON.stringify(u));
    else localStorage.removeItem(STORE_KEY + "_cu");
  } catch {}
}

function initState() {
  const saved = loadStore();
  if (saved) return saved;
  return { users: SEED_USERS, posts: SEED_POSTS, comments: SEED_COMMENTS, nUid: 11, nPid: 7, nCid: 18, _seedVersion: SEED_VERSION };
}

// ── Reducer ────────────────────────────────────────────────────────────────────
function reducer(s, a) {
  let ns;
  switch (a.type) {
    case "REGISTER": {
      const u = { ...a.p, id: s.nUid, avatar: a.p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(), followers:[], following:[], joined: new Date().toISOString(), coverGrad:"linear-gradient(135deg,#6C4FE8,#E84FA0)", verified:false };
      ns = { ...s, users:[...s.users, u], nUid: s.nUid+1 };
      break;
    }
    case "UPD_USER": ns = { ...s, users: s.users.map(u => u.id===a.p.id ? {...u,...a.p} : u) }; break;
    case "CREATE_POST": {
      const p = { ...a.p, id:s.nPid, createdAt:new Date().toISOString(), likes:0, likedBy:[], bookmarkedBy:[], featured:false };
      ns = { ...s, posts:[p,...s.posts], nPid:s.nPid+1 };
      break;
    }
    case "UPD_POST": ns = { ...s, posts: s.posts.map(p => p.id===a.p.id ? {...p,...a.p} : p) }; break;
    case "DEL_POST": ns = { ...s, posts:s.posts.filter(p=>p.id!==a.id), comments:s.comments.filter(c=>c.postId!==a.id) }; break;
    case "LIKE": {
      ns = { ...s, posts: s.posts.map(p => {
        if (p.id!==a.pid) return p;
        const has = p.likedBy.includes(a.uid);
        return { ...p, likes: has?p.likes-1:p.likes+1, likedBy: has?p.likedBy.filter(i=>i!==a.uid):[...p.likedBy,a.uid] };
      })};
      break;
    }
    case "BOOKMARK": {
      ns = { ...s, posts: s.posts.map(p => {
        if (p.id!==a.pid) return p;
        const has = p.bookmarkedBy.includes(a.uid);
        return { ...p, bookmarkedBy: has?p.bookmarkedBy.filter(i=>i!==a.uid):[...p.bookmarkedBy,a.uid] };
      })};
      break;
    }
    case "COMMENT": {
      const c = { ...a.p, id:s.nCid, createdAt:new Date().toISOString(), likes:0, likedBy:[] };
      ns = { ...s, comments:[...s.comments,c], nCid:s.nCid+1 };
      break;
    }
    case "LIKE_CMT": {
      ns = { ...s, comments: s.comments.map(c => {
        if (c.id!==a.cid) return c;
        const has = c.likedBy.includes(a.uid);
        return { ...c, likes: has?c.likes-1:c.likes+1, likedBy: has?c.likedBy.filter(i=>i!==a.uid):[...c.likedBy,a.uid] };
      })};
      break;
    }
    case "DEL_CMT": ns = { ...s, comments: s.comments.filter(c=>c.id!==a.id) }; break;
    case "FOLLOW": ns = { ...s, users: s.users.map(u => {
      if (u.id===a.fid) return {...u, following:[...u.following,a.tid]};
      if (u.id===a.tid) return {...u, followers:[...u.followers,a.fid]};
      return u;
    })}; break;
    case "UNFOLLOW": ns = { ...s, users: s.users.map(u => {
      if (u.id===a.fid) return {...u, following:u.following.filter(i=>i!==a.tid)};
      if (u.id===a.tid) return {...u, followers:u.followers.filter(i=>i!==a.fid)};
      return u;
    })}; break;
    default: return s;
  }
  saveStore(ns);
  return ns;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const tAgo = iso => { const d=Date.now()-new Date(iso), m=Math.floor(d/60000), h=Math.floor(m/60), days=Math.floor(h/24); if(days>30)return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric"}); if(days>0)return`${days}d`; if(h>0)return`${h}h`; if(m>0)return`${m}m`; return"now"; };
const fmtDate = iso => new Date(iso).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
const fmtJoin = iso => new Date(iso).toLocaleDateString("en-US",{month:"long",year:"numeric"});
const nFmt = n => n>=1000?`${(n/1000).toFixed(1)}k`:String(n);
const AV_COLS = ["#6C4FE8","#E84FA0","#3DD6C0","#F5C842","#E67E22","#2ECC71"];
const avC = name => AV_COLS[name.charCodeAt(0) % AV_COLS.length];

// ── Local AI Writing Helpers ──────────────────────────────────────────────────
function analyzeWriting(title, body, category) {
  const words = body.trim().split(/\s+/).filter(Boolean);
  const sentences = body.split(/[.!?]+/).filter(s=>s.trim().length>3);
  const avgSentenceLen = sentences.length ? Math.round(words.length/sentences.length) : 0;
  const paragraphs = body.split(/\n+/).filter(p=>p.trim());
  const hasDialogue = /[""]/.test(body);
  const hasNumbers = /\b\d{3,}\b/.test(body);
  const longestPara = Math.max(0, ...paragraphs.map(p=>p.split(/\s+/).length));
  const strengths = [];
  const improvements = [];
  if (words.length >= 250) strengths.push("Solid length — there's enough room here for the idea to breathe and develop.");
  else improvements.push("This reads a little short for the category. A few more concrete details or an extra beat in the story would deepen it.");
  if (paragraphs.length >= 4) strengths.push("Good paragraph rhythm — the piece is broken into digestible chunks rather than one dense block.");
  else improvements.push("Consider breaking this into more paragraphs. Long unbroken blocks are harder to read on screen.");
  if (hasDialogue) strengths.push("Nice use of dialogue or quoted speech — it adds a human voice and breaks up exposition.");
  if (hasNumbers && category==="science") strengths.push("Concrete figures and dates ground the science nicely and add credibility.");
  if (avgSentenceLen > 28) improvements.push(`Average sentence length is around ${avgSentenceLen} words — try splitting a few of the longer ones for easier reading.`);
  if (longestPara > 150) improvements.push("One paragraph runs quite long — readers on mobile will likely skim or lose the thread there.");
  if (!/[!?]/.test(body)) improvements.push("Every sentence reads fairly even in tone. A question or an exclamation here or there can vary the rhythm.");
  if (title.length < 12) improvements.push("The title is short — a more specific, evocative title tends to pull readers in faster.");
  if (strengths.length===0) strengths.push("The piece has a clear, consistent voice throughout.");
  if (improvements.length===0) improvements.push("This is in strong shape — a final read-aloud pass is the main thing left to catch any stray phrasing.");
  const voiceLines = { story:"The voice leans literary and scene-driven — lean into sensory detail.", biopic:"The voice is biographical and reflective — strong use of specific, verifiable detail.", science:"The voice is explanatory and precise — keep technical claims tightly sourced.", history:"The voice is narrative-historical — the mix of fact and storytelling reads well.", travel:"The voice is observational and personal — first-person texture works in your favor.", mystery:"The voice leans curious and exploratory — the unresolved questions are doing real work.", life:"The voice is reflective and personal — clarity of feeling is the strength here.", tech:"The voice is analytical — keep jargon explained for a general reader." };
  return { strengths: strengths.slice(0,2), improvements: improvements.slice(0,2), voice: voiceLines[category] || "The voice is consistent and readable throughout.", wordCount: words.length };
}

function suggestTitles(body, category) {
  const text = body.replace(/\n/g," ").trim();
  const firstSentence = (text.split(/[.!?]/)[0] || "").trim();
  const capitalized = [...new Set(text.match(/\b[A-Z][a-z]{3,}\b/g) || [])].slice(0,3);
  const keyPhrase = capitalized.length ? capitalized.join(" & ") : "This Story";
  const templates = { story:["The Night [X] Happened","What [X] Left Behind","A Quiet Story About [X]"], biopic:["The Life [X] Almost Lived","[X]: A Life Reconsidered","The Untold Side of [X]"], science:["The Discovery Behind [X]","What [X] Reveals About Us","The Hidden Science of [X]"], history:["The Forgotten Story of [X]","[X]: History's Quiet Chapter","What History Left Out About [X]"], travel:["A Few Hours in [X]","What [X] Taught Me About Slowing Down","Notes From [X]"], mystery:["The Unsolved Riddle of [X]","[X] and the Question No One Answered","What [X] Still Hides"], life:["On [X] and What Stays With Us","The Small Truth About [X]","[X]: A Quiet Reflection"], tech:["What [X] Means for the Future","Inside the Logic of [X]","[X], Explained Simply"] };
  const set = templates[category] || templates.life;
  const filler = keyPhrase.length>3 ? keyPhrase : (firstSentence.split(" ").slice(0,2).join(" ") || "This");
  return set.map(t=>t.replace("[X]", filler));
}

// ── Offline Translation ────────────────────────────────────────────────────────
const TRANSLATE_DICTS = {
  hi: { the:"यह", a:"एक", and:"और", was:"था", were:"थे", he:"वह", she:"वह", his:"उसका", her:"उसकी", in:"में", of:"का", to:"को", for:"के लिए", with:"साथ", on:"पर", at:"पर", is:"है", are:"हैं", not:"नहीं", but:"लेकिन", this:"यह", that:"वह", years:"साल", year:"साल", died:"मृत्यु हो गई", born:"जन्म हुआ", story:"कहानी", love:"प्यार", life:"जीवन", world:"दुनिया", time:"समय", people:"लोग" },
  ta: { the:"அந்த", a:"ஒரு", and:"மற்றும்", was:"இருந்தது", were:"இருந்தன", he:"அவன்", she:"அவள்", his:"அவனுடைய", her:"அவளுடைய", in:"இல்", of:"இன்", to:"க்கு", for:"க்காக", with:"உடன்", on:"மீது", at:"இடத்தில்", is:"ஆகும்", are:"ஆகின்றன", not:"இல்லை", but:"ஆனால்", this:"இது", that:"அது", years:"ஆண்டுகள்", year:"ஆண்டு", died:"இறந்தார்", born:"பிறந்தார்", story:"கதை", love:"அன்பு", life:"வாழ்க்கை", world:"உலகம்", time:"நேரம்", people:"மக்கள்" },
  te: { the:"ఆ", a:"ఒక", and:"మరియు", was:"ఉంది", were:"ఉన్నాయి", he:"అతను", she:"ఆమె", his:"అతని", her:"ఆమె", in:"లో", of:"యొక్క", to:"కు", for:"కోసం", with:"తో", on:"పై", at:"వద్ద", is:"ఉంది", are:"ఉన్నాయి", not:"కాదు", but:"కానీ", this:"ఇది", that:"అది", years:"సంవత్సరాలు", year:"సంవత్సరం", died:"మరణించాడు", born:"జన్మించాడు", story:"కథ", love:"ప్రేమ", life:"జీవితం", world:"ప్రపంచం", time:"సమయం", people:"ప్రజలు" },
  kn: { the:"ಆ", a:"ಒಂದು", and:"ಮತ್ತು", was:"ಇತ್ತು", were:"ಇದ್ದವು", he:"ಅವನು", she:"ಅವಳು", his:"ಅವನ", her:"ಅವಳ", in:"ನಲ್ಲಿ", of:"ನ", to:"ಗೆ", for:"ಗಾಗಿ", with:"ಜೊತೆ", on:"ಮೇಲೆ", at:"ನಲ್ಲಿ", is:"ಇದೆ", are:"ಇವೆ", not:"ಇಲ್ಲ", but:"ಆದರೆ", this:"ಇದು", that:"ಅದು", years:"ವರ್ಷಗಳು", year:"ವರ್ಷ", died:"ನಿಧನರಾದರು", born:"ಜನಿಸಿದರು", story:"ಕಥೆ", love:"ಪ್ರೀತಿ", life:"ಜೀವನ", world:"ಜಗತ್ತು", time:"ಸಮಯ", people:"ಜನರು" },
  ml: { the:"ആ", a:"ഒരു", and:"ഒപ്പം", was:"ആയിരുന്നു", were:"ആയിരുന്നു", he:"അവൻ", she:"അവൾ", his:"അവന്റെ", her:"അവളുടെ", in:"ൽ", of:"ന്റെ", to:"ലേക്ക്", for:"വേണ്ടി", with:"കൂടെ", on:"മേൽ", at:"ൽ", is:"ആണ്", are:"ആണ്", not:"അല്ല", but:"പക്ഷേ", this:"ഇത്", that:"അത്", years:"വർഷങ്ങൾ", year:"വർഷം", died:"മരിച്ചു", born:"ജനിച്ചു", story:"കഥ", love:"സ്നേഹം", life:"ജീവിതം", world:"ലോകം", time:"സമയം", people:"ആളുകൾ" },
  mr: { the:"तो", a:"एक", and:"आणि", was:"होता", were:"होते", he:"तो", she:"ती", his:"त्याचे", her:"तिचे", in:"मध्ये", of:"चा", to:"ला", for:"साठी", with:"सोबत", on:"वर", at:"येथे", is:"आहे", are:"आहेत", not:"नाही", but:"पण", this:"हे", that:"ते", years:"वर्षे", year:"वर्ष", died:"मरण पावला", born:"जन्म झाला", story:"कथा", love:"प्रेम", life:"जीवन", world:"जग", time:"वेळ", people:"लोक" },
  gu: { the:"તે", a:"એક", and:"અને", was:"હતું", were:"હતા", he:"તે", she:"તેણી", his:"તેનું", her:"તેણીનું", in:"માં", of:"નું", to:"ને", for:"માટે", with:"સાથે", on:"પર", at:"પર", is:"છે", are:"છે", not:"નથી", but:"પણ", this:"આ", that:"તે", years:"વર્ષો", year:"વર્ષ", died:"મૃત્યુ પામ્યા", born:"જન્મ થયો", story:"વાર્તા", love:"પ્રેમ", life:"જીવન", world:"દુનિયા", time:"સમય", people:"લોકો" },
  bn: { the:"এই", a:"একটি", and:"এবং", was:"ছিল", were:"ছিল", he:"তিনি", she:"তিনি", his:"তার", her:"তার", in:"মধ্যে", of:"এর", to:"কে", for:"জন্য", with:"সাথে", on:"উপর", at:"এ", is:"হয়", are:"হয়", not:"না", but:"কিন্তু", this:"এই", that:"যে", years:"বছর", year:"বছর", died:"মৃত্যুবরণ করেন", born:"জন্মগ্রহণ করেন", story:"গল্প", love:"ভালোবাসা", life:"জীবন", world:"বিশ্ব", time:"সময়", people:"মানুষ" },
  pa: { the:"ਇਹ", a:"ਇੱਕ", and:"ਅਤੇ", was:"ਸੀ", were:"ਸਨ", he:"ਉਹ", she:"ਉਹ", his:"ਉਸਦਾ", her:"ਉਸਦੀ", in:"ਵਿੱਚ", of:"ਦਾ", to:"ਨੂੰ", for:"ਲਈ", with:"ਨਾਲ", on:"ਉੱਤੇ", at:"ਤੇ", is:"ਹੈ", are:"ਹਨ", not:"ਨਹੀਂ", but:"ਪਰ", this:"ਇਹ", that:"ਉਹ", years:"ਸਾਲ", year:"ਸਾਲ", died:"ਮੌਤ ਹੋ ਗਈ", born:"ਜਨਮ ਹੋਇਆ", story:"ਕਹਾਣੀ", love:"ਪਿਆਰ", life:"ਜ਼ਿੰਦਗੀ", world:"ਦੁਨੀਆ", time:"ਸਮਾਂ", people:"ਲੋਕ" },
  ur: { the:"یہ", a:"ایک", and:"اور", was:"تھا", were:"تھے", he:"وہ", she:"وہ", his:"اس کا", her:"اس کی", in:"میں", of:"کا", to:"کو", for:"کے لیے", with:"کے ساتھ", on:"پر", at:"پر", is:"ہے", are:"ہیں", not:"نہیں", but:"لیکن", this:"یہ", that:"وہ", years:"سال", year:"سال", died:"وفات ہو گئی", born:"پیدا ہوا", story:"کہانی", love:"محبت", life:"زندگی", world:"دنیا", time:"وقت", people:"لوگ" },
  or: { the:"ସେହି", a:"ଏକ", and:"ଏବଂ", was:"ଥିଲା", were:"ଥିଲେ", he:"ସେ", she:"ସେ", his:"ତାଙ୍କର", her:"ତାଙ୍କର", in:"ରେ", of:"ର", to:"କୁ", for:"ପାଇଁ", with:"ସହିତ", on:"ଉପରେ", at:"ରେ", is:"ଅଛି", are:"ଅଛନ୍ତି", not:"ନାହିଁ", but:"କିନ୍ତୁ", this:"ଏହା", that:"ତାହା", years:"ବର୍ଷ", year:"ବର୍ଷ", died:"ମୃତ୍ୟୁ ହେଲା", born:"ଜନ୍ମ ହେଲା", story:"କାହାଣୀ", love:"ପ୍ରେମ", life:"ଜୀବନ", world:"ଦୁନିଆ", time:"ସମୟ", people:"ଲୋକମାନେ" },
  es: { the:"el", a:"un", and:"y", was:"era", were:"eran", he:"él", she:"ella", his:"su", her:"su", in:"en", of:"de", to:"a", for:"para", with:"con", on:"en", at:"en", is:"es", are:"son", not:"no", but:"pero", this:"esto", that:"eso", years:"años", year:"año", died:"murió", born:"nació", story:"historia", love:"amor", life:"vida", world:"mundo", time:"tiempo", people:"gente" },
  fr: { the:"le", a:"un", and:"et", was:"était", were:"étaient", he:"il", she:"elle", his:"son", her:"sa", in:"dans", of:"de", to:"à", for:"pour", with:"avec", on:"sur", at:"à", is:"est", are:"sont", not:"ne pas", but:"mais", this:"ceci", that:"cela", years:"ans", year:"an", died:"est mort", born:"est né", story:"histoire", love:"amour", life:"vie", world:"monde", time:"temps", people:"gens" },
  de: { the:"der", a:"ein", and:"und", was:"war", were:"waren", he:"er", she:"sie", his:"sein", her:"ihr", in:"in", of:"von", to:"zu", for:"für", with:"mit", on:"auf", at:"bei", is:"ist", are:"sind", not:"nicht", but:"aber", this:"dies", that:"das", years:"Jahre", year:"Jahr", died:"starb", born:"wurde geboren", story:"Geschichte", love:"Liebe", life:"Leben", world:"Welt", time:"Zeit", people:"Menschen" },
  pt: { the:"o", a:"um", and:"e", was:"era", were:"eram", he:"ele", she:"ela", his:"seu", her:"sua", in:"em", of:"de", to:"para", for:"para", with:"com", on:"em", at:"em", is:"é", are:"são", not:"não", but:"mas", this:"isto", that:"aquilo", years:"anos", year:"ano", died:"morreu", born:"nasceu", story:"história", love:"amor", life:"vida", world:"mundo", time:"tempo", people:"pessoas" },
  it: { the:"il", a:"un", and:"e", was:"era", were:"erano", he:"lui", she:"lei", his:"suo", her:"sua", in:"in", of:"di", to:"a", for:"per", with:"con", on:"su", at:"a", is:"è", are:"sono", not:"non", but:"ma", this:"questo", that:"quello", years:"anni", year:"anno", died:"morì", born:"nacque", story:"storia", love:"amore", life:"vita", world:"mondo", time:"tempo", people:"persone" },
  ru: { the:"это", a:"один", and:"и", was:"было", were:"были", he:"он", she:"она", his:"его", her:"её", in:"в", of:"из", to:"к", for:"для", with:"с", on:"на", at:"у", is:"есть", are:"есть", not:"не", but:"но", this:"это", that:"то", years:"лет", year:"год", died:"умер", born:"родился", story:"история", love:"любовь", life:"жизнь", world:"мир", time:"время", people:"люди" },
  ja: { the:"その", a:"一つの", and:"そして", was:"だった", were:"だった", he:"彼", she:"彼女", his:"彼の", her:"彼女の", in:"に", of:"の", to:"へ", for:"のために", with:"と", on:"に", at:"で", is:"です", are:"です", not:"ない", but:"しかし", this:"これ", that:"それ", years:"年", year:"年", died:"死んだ", born:"生まれた", story:"物語", love:"愛", life:"人生", world:"世界", time:"時間", people:"人々" },
  ko: { the:"그", a:"하나의", and:"그리고", was:"였다", were:"였다", he:"그", she:"그녀", his:"그의", her:"그녀의", in:"에서", of:"의", to:"에게", for:"위해", with:"와", on:"위에", at:"에서", is:"이다", are:"이다", not:"아니다", but:"그러나", this:"이것", that:"저것", years:"년", year:"년", died:"죽었다", born:"태어났다", story:"이야기", love:"사랑", life:"삶", world:"세계", time:"시간", people:"사람들" },
  zh: { the:"这", a:"一个", and:"和", was:"是", were:"是", he:"他", she:"她", his:"他的", her:"她的", in:"在", of:"的", to:"到", for:"为了", with:"与", on:"在", at:"在", is:"是", are:"是", not:"不", but:"但是", this:"这", that:"那", years:"年", year:"年", died:"去世了", born:"出生了", story:"故事", love:"爱", life:"生活", world:"世界", time:"时间", people:"人们" },
  ar: { the:"ال", a:"واحد", and:"و", was:"كان", were:"كانوا", he:"هو", she:"هي", his:"له", her:"لها", in:"في", of:"من", to:"إلى", for:"لـ", with:"مع", on:"على", at:"عند", is:"هو", are:"هم", not:"ليس", but:"لكن", this:"هذا", that:"ذلك", years:"سنوات", year:"سنة", died:"توفي", born:"وُلد", story:"قصة", love:"حب", life:"حياة", world:"عالم", time:"وقت", people:"الناس" },
};

function translateOffline(text, langCode) {
  const dict = TRANSLATE_DICTS[langCode];
  if (!dict) return null;
  return text.replace(/\b[A-Za-z']+\b/g, (w) => {
    const t = dict[w.toLowerCase()];
    return t || w;
  });
}

// ── Base UI Components ─────────────────────────────────────────────────────────
function Av({user, size=40}) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:avC(user.name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.34,fontWeight:700,color:"#fff",flexShrink:0,fontFamily:"Inter,sans-serif",border:`2px solid ${TH.border2}`,letterSpacing:"0.02em",boxShadow:`0 2px 12px ${avC(user.name)}40`}}>
      {user.avatar}
    </div>
  );
}

function CatBadge({cat}) {
  const m = CATS[cat] || {label:cat,icon:"📝",color:"#888"};
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:m.color+"20",color:m.color,fontFamily:"Inter,sans-serif",border:`1px solid ${m.color}35`,letterSpacing:"0.04em"}}>
      {m.icon} {m.label}
    </span>
  );
}

function Tag({label}) {
  return <span style={{display:"inline-block",padding:"2px 9px",borderRadius:14,fontSize:11,fontWeight:500,background:TH.card2,color:TH.muted,fontFamily:"Inter,sans-serif",border:`1px solid ${TH.border}`}}>#{label}</span>;
}

function Btn({v="primary",children,style:sx,...p}) {
  const base = {padding:"9px 20px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"Inter,sans-serif",cursor:"pointer",border:"none",transition:"all 0.18s",display:"inline-flex",alignItems:"center",gap:6,letterSpacing:"0.01em"};
  const vs = {
    primary:{background:TH.grad1,color:"#fff",boxShadow:"0 4px 20px rgba(108,79,232,0.4)"},
    secondary:{background:TH.accentBg,color:TH.accentL,border:`1px solid ${TH.accent}40`},
    ghost:{background:"transparent",color:TH.muted,border:"none"},
    danger:{background:"rgba(220,50,50,0.12)",color:"#ff6060",border:"1px solid rgba(220,50,50,0.2)"},
    outline:{background:"transparent",border:`1.5px solid ${TH.accent}`,color:TH.accentL},
    gold:{background:"linear-gradient(135deg,#F5C842,#E07030)",color:"#1a1008",boxShadow:"0 4px 20px rgba(245,200,66,0.3)"},
  };
  return <button style={{...base,...(vs[v]||vs.primary),...sx}} {...p}>{children}</button>;
}

function Modal({onClose,children,wide=false,noPad=false}) {
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(10px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:TH.card,borderRadius:24,padding:noPad?0:28,width:"100%",maxWidth:wide?800:540,maxHeight:"92vh",overflowY:"auto",border:`1px solid ${TH.border2}`,boxShadow:`0 32px 80px rgba(0,0,0,0.7), ${TH.glowPurple}`}}>
        {children}
      </div>
    </div>
  );
}

function Inp({label,hint,...p}) {
  return (
    <div style={{marginBottom:14}}>
      {label && <label style={{display:"block",fontSize:11,fontWeight:700,color:TH.muted,marginBottom:5,fontFamily:"Inter,sans-serif",letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</label>}
      <input {...p} style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${TH.border2}`,borderRadius:10,fontSize:14,fontFamily:"Inter,sans-serif",background:TH.card2,color:TH.text,outline:"none",boxSizing:"border-box",transition:"border-color 0.15s",...(p.style||{})}}
        onFocus={e=>{e.target.style.borderColor=TH.accent;p.onFocus&&p.onFocus(e);}} onBlur={e=>{e.target.style.borderColor=TH.border2;p.onBlur&&p.onBlur(e);}}/>
      {hint && <p style={{margin:"4px 0 0",fontSize:11,color:TH.muted,fontFamily:"Inter,sans-serif"}}>{hint}</p>}
    </div>
  );
}

function Txta({label,...p}) {
  return (
    <div style={{marginBottom:14}}>
      {label && <label style={{display:"block",fontSize:11,fontWeight:700,color:TH.muted,marginBottom:5,fontFamily:"Inter,sans-serif",letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</label>}
      <textarea {...p} style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${TH.border2}`,borderRadius:10,fontSize:14,fontFamily:"Inter,sans-serif",background:TH.card2,color:TH.text,outline:"none",resize:"vertical",minHeight:100,boxSizing:"border-box",lineHeight:1.65,...(p.style||{})}}
        onFocus={e=>{e.target.style.borderColor=TH.accent;}} onBlur={e=>{e.target.style.borderColor=TH.border2;}}/>
    </div>
  );
}

function Sel({label,options,...p}) {
  return (
    <div style={{marginBottom:14}}>
      {label && <label style={{display:"block",fontSize:11,fontWeight:700,color:TH.muted,marginBottom:5,fontFamily:"Inter,sans-serif",letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</label>}
      <select {...p} style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${TH.border2}`,borderRadius:10,fontSize:14,fontFamily:"Inter,sans-serif",background:TH.card2,color:TH.text,outline:"none",boxSizing:"border-box",cursor:"pointer"}}>
        {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function Toast({msg}) {
  return (
    <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:TH.grad1,color:"#fff",padding:"12px 28px",borderRadius:40,fontSize:13,fontWeight:600,fontFamily:"Inter,sans-serif",zIndex:9999,boxShadow:"0 8px 32px rgba(108,79,232,0.5)",whiteSpace:"nowrap",animation:"slideUp 0.3s ease"}}>
      {msg}
    </div>
  );
}

// ── Translate Bar ─────────────────────────────────────────────────────────────
function TranslateBar({text}) {
  const [lang, setLang] = useState("en");
  const [result, setResult] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [translatedCount, setTranslatedCount] = useState(0);
  const [mode, setMode] = useState("offline"); // "online" | "offline"
  const chosen = LANGS.find(l=>l.code===lang);

  const handleLangChange = (e) => {
    const nextLang = e.target.value;
    setLang(nextLang);
    setResult("");
    setOpen(false);
    setErrMsg("");
    setTranslatedCount(0);
  };

  const translate = async () => {
    if (lang==="en" || !text) return;
    setErrMsg("");
    setLoading(true);
    setOpen(true);
    setResult("");
    setTranslatedCount(0);
    setMode("offline");

    try {
      // Clean up body text and split into paragraphs to respect API length constraints
      const segments = text.split("\n");
      const promises = segments.map(async (segment) => {
        const line = segment.trim();
        if (!line) return "";
        
        // MyMemory keyless translation service
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(line)}&langpair=en|${lang}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Translation request failed");
        
        const data = await res.json();
        if (data && data.responseData && data.responseData.translatedText) {
          // Decode common HTML entity formatting returned by API
          return data.responseData.translatedText
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
        }
        throw new Error("Translation response was invalid");
      });

      const results = await Promise.all(promises);
      const translatedStory = results.join("\n");
      setResult(translatedStory);
      setMode("online");
    } catch (err) {
      console.warn("Online translation failed, falling back to local dictionary:", err);
      // Fallback: local keyword translation
      const out = translateOffline(text, lang);
      if (out) {
        setResult(out);
        setMode("offline");
        // Count translated keywords
        const dict = TRANSLATE_DICTS[lang];
        let count = 0;
        if (dict) {
          const words = text.match(/\b[A-Za-z']+\b/g) || [];
          words.forEach(w => {
            if (dict[w.toLowerCase()]) count++;
          });
        }
        setTranslatedCount(count);
      } else {
        setErrMsg("Translation not available for this language yet.");
        setResult("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{margin:"24px 0",padding:16,borderRadius:14,border:`1px solid ${TH.border2}`,background:TH.card2}}>
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:12,fontWeight:600,color:TH.muted,fontFamily:"Inter,sans-serif"}}>🌐 Read in:</span>
        <select value={lang} onChange={handleLangChange} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${TH.border2}`,background:TH.card,color:TH.text,fontSize:13,fontFamily:"Inter,sans-serif",cursor:"pointer"}}>
          {LANGS.map(l=><option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
        </select>
        <Btn 
          v={lang === "en" ? "ghost" : "secondary"} 
          style={{padding:"6px 16px",fontSize:12}} 
          onClick={translate} 
          disabled={lang==="en" || loading}
        >
          {loading ? "Translating..." : lang === "en" ? "Select a language" : "Translate Story"}
        </Btn>
        {open && !loading && <Btn v="ghost" style={{padding:"6px 12px",fontSize:12}} onClick={()=>{setOpen(false);setResult("");setTranslatedCount(0);}}>✕ Clear</Btn>}
      </div>
      {errMsg && <p style={{margin:"10px 0 0",fontSize:13,color:"#ff6060",fontFamily:"Inter,sans-serif"}}>{errMsg}</p>}
      {open && (
        <div style={{marginTop:14,padding:14,borderRadius:10,background:TH.card,border:`1px solid ${TH.border}`,direction:RTL.includes(lang)?"rtl":"ltr",lineHeight:1.8,fontSize:15,fontFamily:"Inter,sans-serif",color:TH.text,position:"relative"}}>
          {loading ? (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 0",color:TH.muted,fontSize:13}}>
              <span style={{display:"inline-block",width:16,height:16,border:`2px solid ${TH.muted}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.6s linear infinite",marginRight:8}}></span>
              Translating entire story...
            </div>
          ) : result ? (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:TH.muted,marginBottom:8,fontWeight:600,direction:"ltr"}}>
                <span>{chosen?.flag} {chosen?.label} ({mode === "online" ? "Full Translation" : "Keyword Translation"})</span>
                {mode === "online" ? (
                  <span style={{background:"rgba(74,232,128,0.15)",color:TH.green,padding:"2px 8px",borderRadius:12,fontSize:10}}>
                    ✓ AI Translated
                  </span>
                ) : (
                  <span style={{background:TH.accentBg,color:TH.accentL,padding:"2px 8px",borderRadius:12,fontSize:10}}>
                    {translatedCount} keywords translated
                  </span>
                )}
              </div>
              <div style={{maxHeight:"400px",overflowY:"auto",paddingRight:8,whiteSpace:"pre-wrap"}}>
                {result}
              </div>
              {mode === "offline" && (
                <div style={{marginTop:12,fontSize:11,color:TH.muted,fontFamily:"Inter,sans-serif",borderTop:`1px solid ${TH.border}`,paddingTop:8,fontStyle:"italic",direction:"ltr"}}>
                  💡 <strong>Note:</strong> Currently offline or rate-limited. Only common keywords are translated; complex phrases remain in English.
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ── AI Writing Assistant ──────────────────────────────────────────────────────
function WritingAssistant({title, body, category, onTitleSelect}) {
  const [tab, setTab] = useState("feedback");
  const [open, setOpen] = useState(false);
  const analysis = open ? analyzeWriting(title, body, category) : null;
  const titles = open && tab==="titles" ? suggestTitles(body, category) : [];

  return (
    <div style={{margin:"16px 0",borderRadius:14,border:`1px solid ${TH.accent}40`,background:TH.accentBg,overflow:"hidden"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",color:TH.accentL,fontFamily:"Inter,sans-serif",fontSize:13,fontWeight:600}}>
        <span>✨ AI Writing Assistant</span>
        <span style={{opacity:0.7,fontSize:11}}>{open?"▲ Hide":"▼ Analyse"}</span>
      </button>
      {open && (
        <div style={{padding:"0 16px 16px"}}>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {["feedback","titles"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"5px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"Inter,sans-serif",background:tab===t?TH.accent:"transparent",color:tab===t?"#fff":TH.muted}}>
                {t==="feedback"?"📊 Feedback":"💡 Title Ideas"}
              </button>
            ))}
          </div>
          {tab==="feedback" && analysis && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontSize:12,color:TH.muted,fontFamily:"Inter,sans-serif"}}>{analysis.wordCount} words · {analysis.voice}</div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:TH.green,marginBottom:6,fontFamily:"Inter,sans-serif"}}>✓ STRENGTHS</div>
                {analysis.strengths.map((s,i)=><div key={i} style={{fontSize:13,color:TH.text,fontFamily:"Inter,sans-serif",marginBottom:4,paddingLeft:8,borderLeft:`2px solid ${TH.green}`}}>{s}</div>)}
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:TH.gold,marginBottom:6,fontFamily:"Inter,sans-serif"}}>↗ SUGGESTIONS</div>
                {analysis.improvements.map((s,i)=><div key={i} style={{fontSize:13,color:TH.text,fontFamily:"Inter,sans-serif",marginBottom:4,paddingLeft:8,borderLeft:`2px solid ${TH.gold}`}}>{s}</div>)}
              </div>
            </div>
          )}
          {tab==="titles" && (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {suggestTitles(body, category).map((t,i)=>(
                <button key={i} onClick={()=>{onTitleSelect&&onTitleSelect(t);}} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${TH.border2}`,background:TH.card,color:TH.text,fontFamily:"Playfair Display,serif",fontSize:14,cursor:"pointer",textAlign:"left",transition:"border-color 0.15s"}} onMouseEnter={e=>e.target.style.borderColor=TH.accent} onMouseLeave={e=>e.target.style.borderColor=TH.border2}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({post, users, currentUser, dispatch, onNav, compact=false}) {
  const author = users.find(u=>u.id===post.userId);
  if (!author) return null;
  const liked = currentUser && post.likedBy.includes(currentUser.id);
  const bookmarked = currentUser && post.bookmarkedBy.includes(currentUser.id);
  const [hov, setHov] = useState(false);

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:TH.card,border:`1px solid ${hov?TH.border2:TH.border}`,borderRadius:18,padding:compact?18:24,transition:"all 0.2s",boxShadow:hov?TH.glowPurple:"none",cursor:"pointer"}}
      onClick={()=>onNav("post",post.id)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}} onClick={e=>{e.stopPropagation();onNav("profile",author.id);}}>
          <Av user={author} size={36} />
          <div>
            <div style={{fontSize:13,fontWeight:600,color:TH.text,fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",gap:5}}>
              {author.name}{author.verified&&<span style={{color:TH.teal,fontSize:11}}>✓</span>}
            </div>
            <div style={{fontSize:11,color:TH.muted,fontFamily:"Inter,sans-serif"}}>@{author.username} · {tAgo(post.createdAt)}</div>
          </div>
        </div>
        <CatBadge cat={post.category} />
      </div>
      {post.featured && !compact && (
        <div style={{fontSize:10,fontWeight:700,color:TH.gold,letterSpacing:"0.1em",marginBottom:6,fontFamily:"Inter,sans-serif"}}>⭐ FEATURED</div>
      )}
      <h3 style={{margin:"0 0 8px",fontSize:compact?16:19,fontWeight:700,color:TH.text,fontFamily:"Playfair Display,serif",lineHeight:1.3,letterSpacing:"-0.01em"}}>{post.title}</h3>
      {!compact && <p style={{margin:"0 0 12px",fontSize:14,color:TH.muted,fontFamily:"Lora,serif",lineHeight:1.65,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.excerpt}</p>}
      {!compact && post.tags && (
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {post.tags.map(t=><Tag key={t} label={t}/>)}
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",gap:16,marginTop:compact?10:0}} onClick={e=>e.stopPropagation()}>
        <button onClick={()=>{if(!currentUser)return;dispatch({type:"LIKE",pid:post.id,uid:currentUser.id});}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:liked?TH.pink:TH.muted,fontSize:13,fontFamily:"Inter,sans-serif",fontWeight:500,padding:0,transition:"color 0.15s"}}>
          {liked?"❤️":"🤍"} {nFmt(post.likes)}
        </button>
        <button onClick={()=>onNav("post",post.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:TH.muted,fontSize:13,fontFamily:"Inter,sans-serif",fontWeight:500,padding:0}}>
          💬 {/* comments shown in detail */}
        </button>
        <button onClick={()=>{if(!currentUser)return;dispatch({type:"BOOKMARK",pid:post.id,uid:currentUser.id});}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:bookmarked?TH.gold:TH.muted,fontSize:13,fontFamily:"Inter,sans-serif",fontWeight:500,padding:0,transition:"color 0.15s",marginLeft:"auto"}}>
          {bookmarked?"🔖":"🏷️"}
        </button>
        <span style={{fontSize:12,color:TH.muted,fontFamily:"Inter,sans-serif"}}>⏱ {post.readTime} min</span>
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({currentUser, onNav, page, onSearch, onWrite, onLogout}) {
  const [sq, setSq] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (sq.trim()) { onSearch(sq.trim()); setSq(""); setShowSearch(false); }
  };

  return (
    <nav style={{position:"sticky",top:0,zIndex:200,background:TH.navBg,backdropFilter:"blur(20px)",borderBottom:`1px solid ${TH.border}`,padding:"0 24px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",height:64,gap:16,justifyContent:"space-between"}}>
        
        {/* Left Logo and Brand */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>onNav("home")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",padding:0}}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: TH.grad1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(108,79,232,0.3)",
              marginRight: 10
            }}>
              <span style={{fontSize:18}}>📖</span>
            </div>
            <span style={{
              fontFamily:"'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 900,
              color: TH.text,
              letterSpacing: "-0.03em"
            }}>
              Narratica
            </span>
          </button>
          <span style={{
            fontSize: 9,
            fontWeight: 800,
            color: "#9C7FFF",
            background: "rgba(108,79,232,0.15)",
            border: "1px solid rgba(108,79,232,0.3)",
            padding: "2px 8px",
            borderRadius: 12,
            letterSpacing: "0.1em",
            fontFamily: "Inter, sans-serif"
          }}>
            STORIES
          </span>
        </div>

        {/* Right side user section */}
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          {showSearch ? (
            <form onSubmit={handleSearch} style={{display:"flex",gap:6}}>
              <input autoFocus value={sq} onChange={e=>setSq(e.target.value)} placeholder="Search stories…" style={{padding:"7px 14px",borderRadius:10,border:`1.5px solid ${TH.accent}`,background:TH.card2,color:TH.text,fontSize:13,fontFamily:"Inter,sans-serif",outline:"none",width:180}} onBlur={()=>setTimeout(()=>setShowSearch(false),200)}/>
            </form>
          ) : (
            <button onClick={()=>setShowSearch(true)} style={{background:"none",border:"none",cursor:"pointer",color:TH.muted,fontSize:18,padding:"4px 8px"}}>🔍</button>
          )}

          {currentUser ? (
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>onNav("profile",currentUser.id)}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: currentUser.coverGrad || "linear-gradient(135deg,#2ecc71,#1abc9c)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
                }}>
                  {currentUser.avatar || "U"}
                </div>
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: TH.text,
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase"
                }}>
                  {currentUser.name ? currentUser.name.split(" ")[0] : "USER"}
                </span>
              </div>

              <button 
                onClick={onLogout} 
                style={{
                  background: "rgba(220,50,50,0.05)",
                  border: "1px solid rgba(220,50,50,0.25)",
                  borderRadius: 20,
                  padding: "6px 14px",
                  cursor: "pointer",
                  color: "#ff6060",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s"
                }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(220,50,50,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(220,50,50,0.05)"}
              >
                <span>⏻</span> Sign out
              </button>
            </div>
          ) : (
            <div style={{display:"flex",gap:8}}>
              <Btn v="ghost" style={{fontSize:13}} onClick={()=>onNav("auth","login")}>Sign in</Btn>
              <Btn v="primary" style={{padding:"7px 18px",fontSize:13}} onClick={()=>onNav("auth","signup")}>Join</Btn>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

// ── Home / Feed ───────────────────────────────────────────────────────────────
function HomePage({state, currentUser, dispatch, onNav}) {
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("latest");
  const { posts, users } = state;

  const filtered = posts
    .filter(p => cat==="all" || p.category===cat)
    .filter(p => {
      if (sort==="following" && currentUser) return currentUser.following.includes(p.userId) || p.userId===currentUser.id;
      return true;
    })
    .sort((a,b) => {
      if (sort==="popular") return b.likes - a.likes;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const featured = posts.filter(p=>p.featured).slice(0,2);

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 20px"}}>
      {/* Hero */}
      <div style={{textAlign:"left",marginBottom:40,padding:"32px 0 20px"}}>
        {/* Dynamic Stats Badge */}
        {(() => {
          const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
          const likesLabel = totalLikes >= 1000 ? `${(totalLikes/1000).toFixed(1)}K` : totalLikes;
          return (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 14px",
              borderRadius: 20,
              border: `1px solid rgba(108,79,232,0.25)`,
              background: "rgba(108,79,232,0.08)",
              color: "#3DD6C0",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.06em",
              marginBottom: 24
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#3DD6C0",
                display: "inline-block",
                marginRight: 8,
                boxShadow: "0 0 8px #3DD6C0"
              }}></span>
              {users.length} WRITERS · {posts.length} STORIES · {likesLabel} LIKES
            </div>
          );
        })()}

        {/* Cursive italic heading */}
        <h1 style={{
          margin: "0 0 20px",
          fontSize: "clamp(42px, 7vw, 76px)",
          fontWeight: 900,
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1.1,
          color: TH.text,
          letterSpacing: "-0.03em"
        }}>
          Stories that
          <span style={{
            display: "block",
            fontStyle: "italic",
            background: "linear-gradient(90deg, #9C7FFF, #E84FA0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            fontFamily: "'Playfair Display', Lora, serif",
            marginTop: 4
          }}>
            stay with you.
          </span>
        </h1>

        <p style={{
          fontSize: 16,
          color: "#8880AA",
          fontFamily: "Inter, sans-serif",
          maxWidth: 640,
          lineHeight: 1.6,
          margin: "20px 0 28px 0"
        }}>
          Narratica is a home for biopics, short fiction, science deep-dives, and travel dispatches — written by real people, readable in 21 languages, and discussed by a community that actually reads.
        </p>

        <button onClick={() => onNav("search", "")} style={{
          background: TH.grad1,
          color: "#fff",
          border: "none",
          borderRadius: "30px",
          padding: "12px 28px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 8px 24px rgba(108,79,232,0.4)",
          fontFamily: "Inter, sans-serif",
          transition: "transform 0.15s, box-shadow 0.15s"
        }}
        onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 32px rgba(108,79,232,0.6)"}
        onMouseLeave={e=>e.currentTarget.style.boxShadow="0 8px 24px rgba(108,79,232,0.4)"}
        >
          🔍 Explore Stories
        </button>
      </div>

      <hr style={{ border: "none", borderTop: `1px solid ${TH.border}`, margin: "24px 0 32px 0" }} />

      {/* Grid of 4 statistics cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 48
      }}>
        {(() => {
          const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
          const likesLabel = totalLikes >= 1000 ? `${(totalLikes/1000).toFixed(1)}K` : totalLikes;
          const stats = [
            { em: "✍️", val: users.length, lbl: "Writers" },
            { em: "📖", val: posts.length, lbl: "Stories" },
            { em: "💙", val: likesLabel, lbl: "Likes" },
            { em: "💬", val: state.comments.length, lbl: "Comments" }
          ];
          return stats.map((s, idx) => (
            <div key={idx} style={{
              background: TH.card,
              border: `1px solid ${TH.border}`,
              borderRadius: 18,
              padding: 24,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              borderBottom: `3px solid ${[TH.accent, TH.teal, TH.pink, TH.gold][idx % 4]}`
            }}>
              <span style={{ fontSize: 28 }}>{s.em}</span>
              <span style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Playfair Display', serif", color: TH.text }}>
                {s.val}
              </span>
              <span style={{ fontSize: 11, color: TH.muted, fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {s.lbl}
              </span>
            </div>
          ));
        })()}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div style={{marginBottom:40}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:TH.gold,fontFamily:"Inter,sans-serif",marginBottom:16,textTransform:"uppercase"}}>⭐ Featured Stories</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
            {featured.map(p=><PostCard key={p.id} post={p} users={users} currentUser={currentUser} dispatch={dispatch} onNav={onNav}/>)}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",flex:1}}>
          <button onClick={()=>setCat("all")} style={{padding:"6px 16px",borderRadius:20,border:`1px solid ${cat==="all"?TH.accent:TH.border}`,background:cat==="all"?TH.accentBg:"transparent",color:cat==="all"?TH.accentL:TH.muted,fontSize:12,fontWeight:600,fontFamily:"Inter,sans-serif",cursor:"pointer"}}>All</button>
          {Object.entries(CATS).map(([k,v])=>(
            <button key={k} onClick={()=>setCat(k)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${cat===k?v.color:TH.border}`,background:cat===k?v.color+"20":"transparent",color:cat===k?v.color:TH.muted,fontSize:12,fontWeight:600,fontFamily:"Inter,sans-serif",cursor:"pointer"}}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"6px 12px",borderRadius:10,border:`1px solid ${TH.border2}`,background:TH.card2,color:TH.text,fontSize:12,fontFamily:"Inter,sans-serif",cursor:"pointer"}}>
          <option value="latest">Latest</option>
          <option value="popular">Most Liked</option>
          {currentUser && <option value="following">Following</option>}
        </select>
      </div>

      {/* Feed */}
      <div style={{display:"grid",gap:16}}>
        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px",color:TH.muted,fontFamily:"Inter,sans-serif"}}>
            <div style={{fontSize:40,marginBottom:12}}>📭</div>
            <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>No stories here yet</div>
            <div style={{fontSize:14}}>Try a different category or be the first to write one!</div>
          </div>
        ) : filtered.map(p=>(
          <PostCard key={p.id} post={p} users={users} currentUser={currentUser} dispatch={dispatch} onNav={onNav}/>
        ))}
      </div>
    </div>
  );
}

// ── Post Detail ───────────────────────────────────────────────────────────────
function PostDetail({postId, state, currentUser, dispatch, onNav, showToast}) {
  const { posts, users, comments } = state;
  const post = posts.find(p=>p.id===postId);
  const [cmtBody, setCmtBody] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);

  if (!post) return <div style={{textAlign:"center",padding:60,color:TH.muted,fontFamily:"Inter,sans-serif"}}>Post not found.</div>;

  const author = users.find(u=>u.id===post.userId);
  if (!author) return null;
  const liked = currentUser && post.likedBy.includes(currentUser.id);
  const bookmarked = currentUser && post.bookmarkedBy.includes(currentUser.id);
  const postComments = comments.filter(c=>c.postId===post.id).sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
  const isOwn = currentUser && currentUser.id === post.userId;

  const submitComment = () => {
    if (!currentUser || !cmtBody.trim()) return;
    dispatch({type:"COMMENT", p:{postId:post.id, userId:currentUser.id, body:cmtBody.trim()}});
    setCmtBody("");
    showToast("Comment posted!");
  };

  const handleDelete = () => {
    dispatch({type:"DEL_POST", id:post.id});
    onNav("home");
    showToast("Post deleted.");
  };

  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"32px 20px"}}>
      <button onClick={()=>onNav("home")} style={{background:"none",border:"none",cursor:"pointer",color:TH.muted,fontSize:13,fontFamily:"Inter,sans-serif",marginBottom:24,padding:0,display:"flex",alignItems:"center",gap:6}}>
        ← Back to feed
      </button>

      <div style={{background:TH.card,borderRadius:20,padding:32,border:`1px solid ${TH.border2}`,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <CatBadge cat={post.category}/>
          {isOwn && (
            <div style={{display:"flex",gap:8}}>
              <Btn v="secondary" style={{padding:"6px 14px",fontSize:12}} onClick={()=>onNav("edit",post.id)}>✏️ Edit</Btn>
              <Btn v="danger" style={{padding:"6px 14px",fontSize:12}} onClick={()=>setConfirmDel(true)}>🗑 Delete</Btn>
            </div>
          )}
        </div>

        <h1 style={{margin:"0 0 20px",fontSize:"clamp(24px,4vw,36px)",fontWeight:900,fontFamily:"Playfair Display,serif",lineHeight:1.2,color:TH.text,letterSpacing:"-0.02em"}}>{post.title}</h1>

        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,paddingBottom:20,borderBottom:`1px solid ${TH.border}`}}>
          <div style={{cursor:"pointer"}} onClick={()=>onNav("profile",author.id)}>
            <Av user={author} size={44}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:TH.text,fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",gap:6}}>
              {author.name}{author.verified&&<span style={{color:TH.teal,fontSize:12}}>✓</span>}
            </div>
            <div style={{fontSize:12,color:TH.muted,fontFamily:"Inter,sans-serif"}}>@{author.username} · {fmtDate(post.createdAt)} · {post.readTime} min read</div>
          </div>
        </div>

        <div style={{fontSize:16,lineHeight:1.85,fontFamily:"Lora,serif",color:TH.text,whiteSpace:"pre-wrap",marginBottom:24}}>{post.body}</div>

        {post.tags && (
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
            {post.tags.map(t=><Tag key={t} label={t}/>)}
          </div>
        )}

        <TranslateBar text={post.body} />

        <div style={{display:"flex",gap:20,paddingTop:16,borderTop:`1px solid ${TH.border}`}}>
          <button onClick={()=>{if(!currentUser){showToast("Sign in to like!");return;}dispatch({type:"LIKE",pid:post.id,uid:currentUser.id});}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:7,color:liked?TH.pink:TH.muted,fontSize:15,fontFamily:"Inter,sans-serif",fontWeight:600,padding:0,transition:"color 0.15s"}}>
            {liked?"❤️":"🤍"} {nFmt(post.likes)} {liked?"Liked":"Like"}
          </button>
          <button onClick={()=>{if(!currentUser){showToast("Sign in to bookmark!");return;}dispatch({type:"BOOKMARK",pid:post.id,uid:currentUser.id});}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:7,color:bookmarked?TH.gold:TH.muted,fontSize:15,fontFamily:"Inter,sans-serif",fontWeight:600,padding:0,transition:"color 0.15s"}}>
            {bookmarked?"🔖":"🏷️"} {bookmarked?"Saved":"Save"}
          </button>
        </div>
      </div>

      {/* Comments */}
      <div style={{background:TH.card,borderRadius:20,padding:28,border:`1px solid ${TH.border2}`}}>
        <h3 style={{margin:"0 0 20px",fontSize:16,fontWeight:700,fontFamily:"Inter,sans-serif",color:TH.text}}>💬 {postComments.length} {postComments.length===1?"Comment":"Comments"}</h3>

        {currentUser ? (
          <div style={{marginBottom:20}}>
            <Txta value={cmtBody} onChange={e=>setCmtBody(e.target.value)} placeholder="Share your thoughts…" style={{minHeight:80}}/>
            <Btn v="primary" style={{fontSize:13}} onClick={submitComment} disabled={!cmtBody.trim()}>Post Comment</Btn>
          </div>
        ) : (
          <div style={{padding:16,borderRadius:12,background:TH.card2,marginBottom:20,textAlign:"center",fontFamily:"Inter,sans-serif",fontSize:13,color:TH.muted}}>
            <Btn v="outline" style={{fontSize:13}} onClick={()=>onNav("auth","login")}>Sign in to comment</Btn>
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {postComments.map(c=>{
            const cu = users.find(u=>u.id===c.userId);
            if(!cu) return null;
            const cLiked = currentUser && c.likedBy.includes(currentUser.id);
            const isOwnC = currentUser && currentUser.id===c.userId;
            return (
              <div key={c.id} style={{display:"flex",gap:12}}>
                <div style={{cursor:"pointer"}} onClick={()=>onNav("profile",cu.id)}>
                  <Av user={cu} size={34}/>
                </div>
                <div style={{flex:1,background:TH.card2,borderRadius:14,padding:"12px 16px",border:`1px solid ${TH.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontSize:13,fontWeight:600,color:TH.text,fontFamily:"Inter,sans-serif"}}>{cu.name} <span style={{fontWeight:400,color:TH.muted}}>· {tAgo(c.createdAt)}</span></div>
                    {isOwnC && <button onClick={()=>dispatch({type:"DEL_CMT",id:c.id})} style={{background:"none",border:"none",cursor:"pointer",color:TH.muted,fontSize:11,fontFamily:"Inter,sans-serif",padding:0}}>Delete</button>}
                  </div>
                  <p style={{margin:"0 0 8px",fontSize:14,color:TH.text,fontFamily:"Lora,serif",lineHeight:1.65}}>{c.body}</p>
                  <button onClick={()=>{if(!currentUser)return;dispatch({type:"LIKE_CMT",cid:c.id,uid:currentUser.id});}} style={{background:"none",border:"none",cursor:"pointer",color:cLiked?TH.pink:TH.muted,fontSize:12,fontFamily:"Inter,sans-serif",padding:0,display:"flex",alignItems:"center",gap:4}}>
                    {cLiked?"❤️":"🤍"} {c.likes}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {confirmDel && (
        <Modal onClose={()=>setConfirmDel(false)}>
          <h3 style={{margin:"0 0 12px",fontFamily:"Playfair Display,serif",color:TH.text}}>Delete this post?</h3>
          <p style={{color:TH.muted,fontFamily:"Inter,sans-serif",fontSize:14,marginBottom:20}}>This action cannot be undone. All comments will also be removed.</p>
          <div style={{display:"flex",gap:10}}>
            <Btn v="danger" onClick={handleDelete}>Yes, Delete</Btn>
            <Btn v="ghost" onClick={()=>setConfirmDel(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Write / Edit Post ─────────────────────────────────────────────────────────
function WritePost({state, currentUser, dispatch, onNav, showToast, editPostId}) {
  const existing = editPostId ? state.posts.find(p=>p.id===editPostId) : null;
  const [title, setTitle] = useState(existing?.title||"");
  const [excerpt, setExcerpt] = useState(existing?.excerpt||"");
  const [body, setBody] = useState(existing?.body||"");
  const [category, setCategory] = useState(existing?.category||"story");
  const [tags, setTags] = useState((existing?.tags||[]).join(", "));
  const [readTime, setReadTime] = useState(existing?.readTime||5);
  const [err, setErr] = useState("");

  const words = body.trim().split(/\s+/).filter(Boolean).length;

  const submit = () => {
    if (!title.trim() || !body.trim()) { setErr("Title and body are required."); return; }
    const tagArr = tags.split(",").map(t=>t.trim().toLowerCase().replace(/\s+/g,"_")).filter(Boolean);
    const payload = { title:title.trim(), excerpt:excerpt.trim()||body.trim().slice(0,160)+"…", body:body.trim(), category, tags:tagArr, readTime:Number(readTime), userId:currentUser.id };
    if (editPostId) {
      dispatch({type:"UPD_POST", p:{...payload, id:editPostId}});
      showToast("Post updated!");
    } else {
      dispatch({type:"CREATE_POST", p:payload});
      showToast("Post published! 🎉");
    }
    onNav("home");
  };

  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"32px 20px"}}>
      <button onClick={()=>onNav("home")} style={{background:"none",border:"none",cursor:"pointer",color:TH.muted,fontSize:13,fontFamily:"Inter,sans-serif",marginBottom:24,padding:0}}>← Cancel</button>
      <div style={{background:TH.card,borderRadius:20,padding:32,border:`1px solid ${TH.border2}`}}>
        <h2 style={{margin:"0 0 24px",fontFamily:"Playfair Display,serif",fontSize:28,fontWeight:900,color:TH.text}}>{editPostId?"Edit Story":"Write a Story"}</h2>
        {err && <div style={{padding:12,borderRadius:10,background:"rgba(220,50,50,0.1)",color:"#ff6060",fontSize:13,fontFamily:"Inter,sans-serif",marginBottom:16,border:"1px solid rgba(220,50,50,0.2)"}}>{err}</div>}
        <Inp label="Title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Give your story a great title…"/>
        <WritingAssistant title={title} body={body} category={category} onTitleSelect={t=>setTitle(t)}/>
        <Sel label="Category" value={category} onChange={e=>setCategory(e.target.value)}
          options={Object.entries(CATS).map(([k,v])=>({v:k,l:`${v.icon} ${v.label}`}))}/>
        <Txta label="Excerpt (optional)" value={excerpt} onChange={e=>setExcerpt(e.target.value)} placeholder="A short teaser shown in the feed…" style={{minHeight:70}}/>
        <Txta label="Story Body" value={body} onChange={e=>setBody(e.target.value)} placeholder="Tell your story…" style={{minHeight:300}}/>
        <div style={{fontSize:12,color:TH.muted,fontFamily:"Inter,sans-serif",marginTop:-8,marginBottom:14}}>{words} words</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Inp label="Tags (comma-separated)" value={tags} onChange={e=>setTags(e.target.value)} placeholder="inspiration, science, travel…"/>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:TH.muted,marginBottom:5,fontFamily:"Inter,sans-serif",letterSpacing:"0.08em",textTransform:"uppercase"}}>Read Time (min)</label>
            <input type="number" min={1} max={60} value={readTime} onChange={e=>setReadTime(e.target.value)} style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${TH.border2}`,borderRadius:10,fontSize:14,fontFamily:"Inter,sans-serif",background:TH.card2,color:TH.text,outline:"none",boxSizing:"border-box"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:12,marginTop:8}}>
          <Btn v="primary" onClick={submit}>{editPostId?"Save Changes":"Publish Story 🚀"}</Btn>
          <Btn v="ghost" onClick={()=>onNav("home")}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────
function ProfilePage({userId, state, currentUser, dispatch, onNav, showToast}) {
  const { users, posts } = state;
  const [tab, setTab] = useState("posts");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const profile = users.find(u=>u.id===userId);
  
  if (!profile) return <div style={{textAlign:"center",padding:60,color:TH.muted,fontFamily:"Inter,sans-serif"}}>User not found.</div>;

  const isOwn = currentUser && currentUser.id === userId;
  const isFollowing = currentUser && currentUser.following.includes(userId);
  const userPosts = posts.filter(p=>p.userId===userId).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const userLiked = posts.filter(p=>p.likedBy.includes(userId));
  
  // Calculate total likes on stories authored by this user
  const totalLikes = userPosts.reduce((s,p)=>s+p.likes,0);

  const handleFollow = () => {
    if (!currentUser) { showToast("Sign in to follow!"); return; }
    if (isFollowing) dispatch({type:"UNFOLLOW", fid:currentUser.id, tid:userId});
    else dispatch({type:"FOLLOW", fid:currentUser.id, tid:userId});
  };

  const handleResetAll = () => {
    if (window.confirm("⚠️ Are you sure you want to reset all data?\n\nThis will delete all locally saved posts, comments, account changes, and restore the original seed data. This page will reload.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{maxWidth:880,margin:"0 auto",padding:"0 20px 48px"}}>
      {/* Cover */}
      <div style={{height:180,borderRadius:"0 0 20px 20px",background:profile.coverGrad,position:"relative",boxShadow:TH.shadow}}>
      </div>
      
      {/* Profile Header Details block */}
      <div style={{paddingTop:68,paddingBottom:24,paddingLeft:28,borderBottom:`1px solid ${TH.border}`,position:"relative"}}>
        {/* Large Overlapping Avatar */}
        <div style={{position:"absolute",top:-60,left:28,border:`4px solid ${TH.bg}`,borderRadius:"50%",background:TH.bg,boxShadow:"0 8px 20px rgba(0,0,0,0.4)"}}>
          <Av user={profile} size={96}/>
        </div>

        {/* Username/Title Row alongside Action Buttons */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:12}}>
          <div>
            <h2 style={{margin:"0 0 4px",fontFamily:"Playfair Display,serif",fontSize:28,fontWeight:900,color:TH.text,display:"flex",alignItems:"center",gap:8}}>
              {profile.name}
              {profile.verified && (
                <span style={{
                  display:"inline-flex",
                  alignItems:"center",
                  justifyContent:"center",
                  width:18,
                  height:18,
                  borderRadius:"50%",
                  background:"#3DD6C0",
                  color:"#07070F",
                  fontSize:11,
                  fontWeight:800,
                  fontFamily:"Inter,sans-serif"
                }}>✓</span>
              )}
            </h2>
            <div style={{fontSize:13,color:TH.muted,fontFamily:"Inter,sans-serif"}}>@{profile.username}</div>
          </div>
          
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            {isOwn ? (
              <>
                <button onClick={()=>onNav("settings")} style={{
                  background:"rgba(255,255,255,0.03)",
                  border:`1px solid ${TH.border2}`,
                  borderRadius:12,
                  padding:"8px 16px",
                  color:TH.text,
                  fontSize:13,
                  fontWeight:600,
                  fontFamily:"Inter,sans-serif",
                  cursor:"pointer",
                  display:"inline-flex",
                  alignItems:"center",
                  gap:6,
                  transition:"border-color 0.15s"
                }} onMouseEnter={e=>e.currentTarget.style.borderColor=TH.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=TH.border2}>
                  ✏️ Edit Profile
                </button>
                <button onClick={()=>setShowAnalytics(true)} style={{
                  background:"rgba(255,255,255,0.03)",
                  border:`1px solid ${TH.border2}`,
                  borderRadius:12,
                  padding:"8px 16px",
                  color:TH.text,
                  fontSize:13,
                  fontWeight:600,
                  fontFamily:"Inter,sans-serif",
                  cursor:"pointer",
                  display:"inline-flex",
                  alignItems:"center",
                  gap:6,
                  transition:"border-color 0.15s"
                }} onMouseEnter={e=>e.currentTarget.style.borderColor=TH.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=TH.border2}>
                  📊 Analytics
                </button>
                <button onClick={()=>onNav("write")} style={{
                  background:TH.grad1,
                  border:"none",
                  borderRadius:12,
                  padding:"9px 18px",
                  color:"#fff",
                  fontSize:13,
                  fontWeight:700,
                  fontFamily:"Inter,sans-serif",
                  cursor:"pointer",
                  display:"inline-flex",
                  alignItems:"center",
                  gap:6,
                  boxShadow:"0 4px 14px rgba(108,79,232,0.4)"
                }}>
                  + Write Story
                </button>
              </>
            ) : (
              <>
                {currentUser && (
                  <Btn v={isFollowing?"secondary":"primary"} style={{fontSize:13,borderRadius:12}} onClick={handleFollow}>
                    {isFollowing?"✓ Following":"+ Follow"}
                  </Btn>
                )}
                {!currentUser && <Btn v="outline" style={{fontSize:13,borderRadius:12}} onClick={()=>onNav("auth","login")}>+ Follow</Btn>}
              </>
            )}
          </div>
        </div>

        {/* Bio Text */}
        {profile.bio && (
          <p style={{margin:"14px 0 16px",fontSize:15,color:TH.text,fontFamily:"Lora,serif",lineHeight:1.6,maxWidth:640}}>
            {profile.bio}
          </p>
        )}

        {/* Metadata Details Row */}
        <div style={{display:"flex",gap:20,flexWrap:"wrap",fontSize:12,color:TH.muted,fontFamily:"Inter,sans-serif",marginBottom:20}}>
          {profile.location && <span>📍 {profile.location}</span>}
          {profile.website && (
            <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" style={{color:TH.accentL,textDecoration:"none"}}>
              🔗 {profile.website}
            </a>
          )}
          <span>📅 Joined {fmtJoin(profile.joined)}</span>
        </div>

        {/* 4-Column Rule Statistics Cards block */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 16,
          background: "rgba(255,255,255,0.01)",
          border: `1px solid ${TH.border}`,
          borderRadius: 20,
          padding: "20px 10px",
          marginTop: 24
        }}>
          {[
            { em: "📝", val: userPosts.length, lbl: "STORIES" },
            { em: "👥", val: profile.followers.length, lbl: "FOLLOWERS" },
            { em: "👤", val: profile.following.length, lbl: "FOLLOWING" },
            { em: "❤️", val: totalLikes, lbl: "TOTAL LIKES" }
          ].map((s, idx) => (
            <div key={idx} style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderRight: idx < 3 ? `1px solid ${TH.border2}` : "none"
            }}>
              <span style={{ fontSize: 18 }}>{s.em}</span>
              <span style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Playfair Display', serif", color: TH.text }}>
                {s.val}
              </span>
              <span style={{ fontSize: 10, color: TH.muted, fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.08em" }}>
                {s.lbl}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Tabs list */}
      <div style={{display:"flex",gap:4,margin:"20px 0 24px",borderBottom:`1px solid ${TH.border}`,paddingBottom:0}}>
        {["posts","liked"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 20px",background:"none",border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:13,fontWeight:600,color:tab===t?TH.accentL:TH.muted,borderBottom:tab===t?`2px solid ${TH.accent}`:"2px solid transparent",transition:"all 0.15s"}}>
            {t==="posts"?"Stories":"Liked"}
          </button>
        ))}
      </div>

      {/* 2-Column Responsive Stories list Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: 16
      }}>
        {(tab==="posts"?userPosts:userLiked).map(p=>(
          <PostCard key={p.id} post={p} users={users} currentUser={currentUser} dispatch={dispatch} onNav={onNav} compact/>
        ))}
        {(tab==="posts"?userPosts:userLiked).length===0 && (
          <div style={{textAlign:"center",padding:"40px 20px",color:TH.muted,fontFamily:"Inter,sans-serif",gridColumn:"1 / -1"}}>
            {tab==="posts"?"No stories published yet.":"No liked stories yet."}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      {isOwn && (
        <div style={{
          marginTop: 48,
          padding: 24,
          borderRadius: 18,
          background: "rgba(220,50,50,0.02)",
          border: "1px solid rgba(220,50,50,0.2)",
          fontFamily: "Inter, sans-serif"
        }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: "#ff6060", display: "flex", alignItems: "center", gap: 8 }}>
            ⚠️ Danger Zone
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: TH.muted, lineHeight: 1.5 }}>
            Reset clears all locally saved data — every story, comment, and account created in this session — and restores the original demo content. This cannot be undone.
          </p>
          <button 
            onClick={handleResetAll} 
            style={{
              background: "rgba(220,50,50,0.06)",
              border: "1px solid rgba(220,50,50,0.3)",
              borderRadius: 10,
              padding: "8px 18px",
              color: "#ff6060",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s"
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(220,50,50,0.12)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(220,50,50,0.06)"}
          >
            🔄 Reset All Data
          </button>
        </div>
      )}

      {/* Analytics Modal popup */}
      {showAnalytics && (
        <Modal onClose={() => setShowAnalytics(false)} wide={true}>
          <h3 style={{ margin: "0 0 8px", fontFamily: "Playfair Display, serif", fontSize: 24, fontWeight: 900, color: TH.text }}>
            📊 Story Performance Analytics
          </h3>
          <p style={{ color: TH.muted, fontFamily: "Inter, sans-serif", fontSize: 13, marginBottom: 20 }}>
            Overview of engagement, read completion, and referral stats for your published stories.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
            <div style={{ background: TH.card2, border: `1px solid ${TH.border2}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TH.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Average Read Time</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TH.text, margin: "8px 0", fontFamily: "'Playfair Display', serif" }}>5.8 min</div>
              <div style={{ fontSize: 11, color: TH.green }}>↑ 14% vs last week</div>
            </div>
            
            <div style={{ background: TH.card2, border: `1px solid ${TH.border2}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TH.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Story Views</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TH.text, margin: "8px 0", fontFamily: "'Playfair Display', serif" }}>1,420</div>
              <div style={{ fontSize: 11, color: TH.green }}>↑ 22% vs last week</div>
            </div>
            
            <div style={{ background: TH.card2, border: `1px solid ${TH.border2}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TH.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Engagement Rate</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TH.text, margin: "8px 0", fontFamily: "'Playfair Display', serif" }}>72.4%</div>
              <div style={{ fontSize: 11, color: TH.teal }}>Steady reader retention</div>
            </div>
          </div>

          {/* Graphical views summary representation */}
          <div style={{ background: TH.card2, border: `1px solid ${TH.border2}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <h4 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: TH.text, fontFamily: "Inter, sans-serif" }}>Weekly View Distribution</h4>
            <div style={{ display: "flex", alignItems: "flex-end", height: 140, gap: 12, paddingBottom: 8, borderBottom: `1.5px solid ${TH.border2}` }}>
              {[
                { day: "Mon", val: 40 },
                { day: "Tue", val: 65 },
                { day: "Wed", val: 80 },
                { day: "Thu", val: 45 },
                { day: "Fri", val: 95 },
                { day: "Sat", val: 120 },
                { day: "Sun", val: 110 }
              ].map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "100%",
                    height: `${d.val}px`,
                    background: i === 5 ? TH.grad1 : TH.accent,
                    borderRadius: "4px 4px 0 0",
                    position: "relative"
                  }}>
                    <span style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: TH.text, fontWeight: 700 }}>
                      {d.val * 10}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, color: TH.muted, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  {d}
                </div>
              ))}
            </div>
          </div>

          <Btn v="primary" onClick={() => setShowAnalytics(false)} style={{ width: "100%", justifyContent: "center" }}>
            Close Analytics
          </Btn>
        </Modal>
      )}

    </div>
  );
}

// ── Bookmarks ─────────────────────────────────────────────────────────────────
function BookmarksPage({state, currentUser, dispatch, onNav}) {
  if (!currentUser) return (
    <div style={{maxWidth:600,margin:"80px auto",textAlign:"center",padding:"0 20px"}}>
      <div style={{fontSize:48,marginBottom:16}}>🔖</div>
      <h2 style={{fontFamily:"Playfair Display,serif",color:TH.text,marginBottom:8}}>Your Bookmarks</h2>
      <p style={{color:TH.muted,fontFamily:"Inter,sans-serif",marginBottom:20}}>Sign in to save stories to read later.</p>
      <Btn v="primary" onClick={()=>onNav("auth","login")}>Sign In</Btn>
    </div>
  );
  const saved = state.posts.filter(p=>p.bookmarkedBy.includes(currentUser.id));
  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"32px 20px"}}>
      <h2 style={{fontFamily:"Playfair Display,serif",fontSize:28,fontWeight:900,color:TH.text,marginBottom:24}}>🔖 Saved Stories</h2>
      {saved.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 20px",color:TH.muted,fontFamily:"Inter,sans-serif"}}>
          <div style={{fontSize:40,marginBottom:12}}>📭</div>
          <p>You haven't saved any stories yet. Tap 🏷️ on any story to save it.</p>
        </div>
      ) : (
        <div style={{display:"grid",gap:14}}>
          {saved.map(p=><PostCard key={p.id} post={p} users={state.users} currentUser={currentUser} dispatch={dispatch} onNav={onNav}/>)}
        </div>
      )}
    </div>
  );
}

// ── Search ────────────────────────────────────────────────────────────────────
function SearchPage({query, state, currentUser, dispatch, onNav}) {
  const q = query.toLowerCase();
  const posts = state.posts.filter(p=>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q) ||
    p.body.toLowerCase().includes(q) ||
    (p.tags||[]).some(t=>t.includes(q)) ||
    p.category.includes(q)
  );
  const users = state.users.filter(u=>
    u.name.toLowerCase().includes(q) ||
    u.username.toLowerCase().includes(q) ||
    (u.bio||"").toLowerCase().includes(q)
  );

  return (
    <div style={{maxWidth:880,margin:"0 auto",padding:"32px 20px"}}>
      <h2 style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:900,color:TH.text,marginBottom:4}}>Search results for</h2>
      <div style={{fontSize:28,fontWeight:900,fontFamily:"Playfair Display,serif",background:TH.grad1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:28}}>"{query}"</div>

      {users.length > 0 && (
        <div style={{marginBottom:32}}>
          <div style={{fontSize:11,fontWeight:700,color:TH.muted,letterSpacing:"0.1em",fontFamily:"Inter,sans-serif",marginBottom:14,textTransform:"uppercase"}}>Writers</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
            {users.map(u=>(
              <div key={u.id} onClick={()=>onNav("profile",u.id)} style={{background:TH.card,borderRadius:14,padding:16,border:`1px solid ${TH.border}`,cursor:"pointer",display:"flex",gap:12,alignItems:"center",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=TH.border2} onMouseLeave={e=>e.currentTarget.style.borderColor=TH.border}>
                <Av user={u} size={40}/>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:TH.text,fontFamily:"Inter,sans-serif"}}>{u.name}{u.verified&&<span style={{color:TH.teal,marginLeft:4,fontSize:11}}>✓</span>}</div>
                  <div style={{fontSize:12,color:TH.muted,fontFamily:"Inter,sans-serif"}}>@{u.username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{fontSize:11,fontWeight:700,color:TH.muted,letterSpacing:"0.1em",fontFamily:"Inter,sans-serif",marginBottom:14,textTransform:"uppercase"}}>Stories ({posts.length})</div>
      {posts.length===0 && users.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 20px",color:TH.muted,fontFamily:"Inter,sans-serif"}}>
          <div style={{fontSize:40,marginBottom:12}}>🔍</div>
          <p>No results found for "{query}"</p>
        </div>
      ) : (
        <div style={{display:"grid",gap:14}}>
          {posts.map(p=><PostCard key={p.id} post={p} users={state.users} currentUser={currentUser} dispatch={dispatch} onNav={onNav}/>)}
        </div>
      )}
    </div>
  );
}

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage({mode, state, dispatch, onLogin, onNav}) {
  const [m, setM] = useState(mode||"login");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    setErr("");
    if (m==="login") {
      const u = state.users.find(u=>u.email===email && u.password===pass);
      if (!u) { setErr("Invalid email or password."); return; }
      onLogin(u);
    } else {
      if (!name.trim()||!username.trim()||!email.trim()||!pass.trim()) { setErr("All fields are required."); return; }
      if (state.users.find(u=>u.email===email)) { setErr("Email already registered."); return; }
      if (state.users.find(u=>u.username===username)) { setErr("Username already taken."); return; }
      if (pass.length < 6) { setErr("Password must be at least 6 characters."); return; }
      const newU = { name:name.trim(), username:username.trim().toLowerCase(), email:email.trim().toLowerCase(), password:pass, bio:"", location:"", website:"" };
      dispatch({type:"REGISTER", p:newU});
      const created = {...newU, id:state.nUid, avatar:name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(), followers:[], following:[], joined:new Date().toISOString(), coverGrad:"linear-gradient(135deg,#6C4FE8,#E84FA0)", verified:false};
      onLogin(created);
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:TH.grad3}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:36,fontWeight:900,color:TH.text,letterSpacing:"-0.03em",marginBottom:8}}>
            N<span style={{background:TH.grad1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>arrática</span>
          </div>
          <p style={{color:TH.muted,fontFamily:"Lora,serif",fontStyle:"italic",fontSize:15}}>Where stories find their home</p>
        </div>
        <div style={{background:TH.card,borderRadius:24,padding:32,border:`1px solid ${TH.border2}`,boxShadow:TH.glowPurple}}>
          <div style={{display:"flex",gap:4,marginBottom:24,background:TH.card2,borderRadius:12,padding:4}}>
            {["login","signup"].map(t=>(
              <button key={t} onClick={()=>{setM(t);setErr("");}} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"Inter,sans-serif",background:m===t?TH.accent:"transparent",color:m===t?"#fff":TH.muted,transition:"all 0.2s"}}>
                {t==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>
          {err && <div style={{padding:10,borderRadius:10,background:"rgba(220,50,50,0.1)",color:"#ff6060",fontSize:13,fontFamily:"Inter,sans-serif",marginBottom:16,border:"1px solid rgba(220,50,50,0.2)"}}>{err}</div>}
          {m==="signup" && (
            <>
              <Inp label="Full Name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/>
              <Inp label="Username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="your_handle"/>
            </>
          )}
          <Inp label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
          <Inp label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/>
          <Btn v="primary" style={{width:"100%",justifyContent:"center",marginTop:8,padding:"12px 0"}} onClick={submit}>
            {m==="login"?"Sign In →":"Create Account →"}
          </Btn>
          {m==="login" && (
            <div style={{marginTop:16,padding:14,borderRadius:12,background:TH.card2,border:`1px solid ${TH.border}`,fontSize:12,color:TH.muted,fontFamily:"Inter,sans-serif",textAlign:"center"}}>
              <div style={{fontWeight:600,marginBottom:6,color:TH.text}}>Demo accounts</div>
              <div>priya@narratica.io / demo123</div>
              <div>leila@narratica.io / demo123</div>
            </div>
          )}
          <div style={{textAlign:"center",marginTop:16,fontSize:13,color:TH.muted,fontFamily:"Inter,sans-serif"}}>
            {m==="login"?"Don't have an account? ":"Already have an account? "}
            <button onClick={()=>{setM(m==="login"?"signup":"login");setErr("");}} style={{background:"none",border:"none",cursor:"pointer",color:TH.accentL,fontWeight:600,fontFamily:"Inter,sans-serif",fontSize:13}}>
              {m==="login"?"Sign up":"Sign in"}
            </button>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:20}}>
          <button onClick={()=>onNav("home")} style={{background:"none",border:"none",cursor:"pointer",color:TH.muted,fontSize:13,fontFamily:"Inter,sans-serif"}}>← Browse without signing in</button>
        </div>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsPage({currentUser, state, dispatch, onNav, showToast, onUpdateUser}) {
  const [name, setName] = useState(currentUser?.name||"");
  const [bio, setBio] = useState(currentUser?.bio||"");
  const [location, setLocation] = useState(currentUser?.location||"");
  const [website, setWebsite] = useState(currentUser?.website||"");

  if (!currentUser) { onNav("auth","login"); return null; }

  const save = () => {
    const updated = {...currentUser, name:name.trim(), bio:bio.trim(), location:location.trim(), website:website.trim()};
    dispatch({type:"UPD_USER", p:updated});
    onUpdateUser(updated);
    showToast("Profile updated!");
    onNav("profile", currentUser.id);
  };

  return (
    <div style={{maxWidth:560,margin:"0 auto",padding:"32px 20px"}}>
      <button onClick={()=>onNav("profile",currentUser.id)} style={{background:"none",border:"none",cursor:"pointer",color:TH.muted,fontSize:13,fontFamily:"Inter,sans-serif",marginBottom:24,padding:0}}>← Back to profile</button>
      <div style={{background:TH.card,borderRadius:20,padding:32,border:`1px solid ${TH.border2}`}}>
        <h2 style={{margin:"0 0 24px",fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:900,color:TH.text}}>Edit Profile</h2>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,padding:16,background:TH.card2,borderRadius:14,border:`1px solid ${TH.border}`}}>
          <Av user={currentUser} size={56}/>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:TH.text,fontFamily:"Inter,sans-serif"}}>{currentUser.name}</div>
            <div style={{fontSize:12,color:TH.muted,fontFamily:"Inter,sans-serif"}}>@{currentUser.username}</div>
          </div>
        </div>
        <Inp label="Display Name" value={name} onChange={e=>setName(e.target.value)}/>
        <Txta label="Bio" value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell readers about yourself…" style={{minHeight:80}}/>
        <Inp label="Location" value={location} onChange={e=>setLocation(e.target.value)} placeholder="City, Country"/>
        <Inp label="Website" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="yourwebsite.com"/>
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <Btn v="primary" onClick={save}>Save Changes</Btn>
          <Btn v="ghost" onClick={()=>onNav("profile",currentUser.id)}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Challenges Page ───────────────────────────────────────────────────────────
function ChallengesPage({state, currentUser, onNav}) {
  const challenges = [
    {
      id: 1,
      title: "The Flow of Time",
      description: "Write a short story about a cartographer mapping a river that remembers the past. Must be under 1000 words.",
      participants: 12,
      daysLeft: 3,
      tag: "fiction",
      points: 50,
      reward: "📝 Story Teller Badge"
    },
    {
      id: 2,
      title: "Science & Stardust",
      description: "Explain a complex astronomical phenomenon (like Henrietta Leavitt's work on variable stars) using a personal, narrative tone.",
      participants: 8,
      daysLeft: 5,
      tag: "science",
      points: 100,
      reward: "🌌 Cosmic Communicator Badge"
    },
    {
      id: 3,
      title: "Letters to the Future",
      description: "Begin a story with a message that was meant for an audience that no longer exists.",
      participants: 19,
      daysLeft: 1,
      tag: "mystery",
      points: 75,
      reward: "🔑 Cryptographer Badge"
    }
  ];

  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"32px 20px 48px"}}>
      <h1 style={{margin:"0 0 8px",fontFamily:"Playfair Display,serif",fontSize:32,fontWeight:900,color:TH.text}}>🏆 Writing Challenges</h1>
      <p style={{color:TH.muted,fontFamily:"Inter,sans-serif",fontSize:14,marginBottom:28}}>Participate in weekly community prompts, build your streak, and earn unique profile badges.</p>
      
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {challenges.map(c => (
          <div key={c.id} style={{background:TH.card,border:`1px solid ${TH.border2}`,borderRadius:18,padding:24,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,right:0,background:TH.grad1,color:"#fff",padding:"4px 14px",fontSize:11,fontWeight:700,borderBottomLeftRadius:14,fontFamily:"Inter,sans-serif"}}>
              +{c.points} PTS
            </div>
            <span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(108,79,232,0.15)",color:TH.accentL,fontFamily:"Inter,sans-serif",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.05em"}}>
              {c.tag} prompt
            </span>
            <h3 style={{margin:"0 0 8px",fontSize:18,fontWeight:700,color:TH.text,fontFamily:"Playfair Display,serif"}}>{c.title}</h3>
            <p style={{margin:"0 0 16px",fontSize:13,color:TH.muted,fontFamily:"Inter,sans-serif",lineHeight:1.5}}>{c.description}</p>
            
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${TH.border}`,paddingTop:14,flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",gap:14,fontSize:12,color:TH.muted,fontFamily:"Inter,sans-serif"}}>
                <span>👥 <strong>{c.participants}</strong> writers participating</span>
                <span>⏱ <strong>{c.daysLeft}d</strong> remaining</span>
              </div>
              <Btn v="secondary" style={{padding:"6px 16px",fontSize:12}} onClick={() => {
                if (!currentUser) { onNav("auth", "login"); return; }
                onNav("write");
              }}>
                Join Challenge
              </Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Global CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:${TH.bg};color:${TH.text};min-height:100vh;line-height:1.6;-webkit-font-smoothing:antialiased}
  @keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:${TH.bg}}
  ::-webkit-scrollbar-thumb{background:${TH.subtle};border-radius:3px}
  ::-webkit-scrollbar-thumb:hover{background:${TH.accent}}
`;

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, null, initState);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = loadUser();
    if (saved) return saved;
    const defaultUser = {
      id: 10,
      name: "SARABHOJI M",
      username: "sarabhoji",
      email: "sarabhoji@narratica.io",
      avatar: "SM",
      bio: "Avid reader & storyteller. Exploring narrative history and deep science. 📝",
      location: "Chennai, India",
      website: "",
      joined: "2026-06-17T00:00:00Z",
      coverGrad: "linear-gradient(135deg,#2ecc71,#1abc9c)",
      verified: true,
      followers: [],
      following: [1, 2, 3]
    };
    saveUser(defaultUser);
    return defaultUser;
  });
  const [page, setPage] = useState({name:"home"});
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToast(null), 3000);
  },[]);

  const onNav = useCallback((name, param) => {
    setPage({name, param});
    window.scrollTo({top:0, behavior:"smooth"});
  },[]);

  const onLogin = useCallback((u) => {
    const fresh = state.users.find(x=>x.id===u.id)||u;
    setCurrentUser(fresh);
    saveUser(fresh);
    setPage({name:"home"});
    showToast(`Welcome back, ${fresh.name.split(" ")[0]}! 👋`);
  },[state.users, showToast]);

  const onLogout = useCallback(() => {
    setCurrentUser(null);
    saveUser(null);
    setPage({name:"home"});
    showToast("Signed out.");
  },[showToast]);

  const onUpdateUser = useCallback((u) => {
    setCurrentUser(u);
    saveUser(u);
  },[]);

  // Keep currentUser in sync with state changes (follows, etc.)
  useEffect(() => {
    if (currentUser) {
      const fresh = state.users.find(u=>u.id===currentUser.id);
      if (fresh) { setCurrentUser(fresh); saveUser(fresh); }
    }
  }, [state.users]);

  const handleSearch = useCallback((q) => onNav("search", q), [onNav]);
  const handleWrite = useCallback(() => {
    if (!currentUser) { onNav("auth","login"); return; }
    onNav("write");
  },[currentUser, onNav]);

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {page.name !== "auth" && (
        <Nav currentUser={currentUser} onNav={onNav} page={page} onSearch={handleSearch} onWrite={handleWrite} onLogout={onLogout}/>
      )}

      <main style={{minHeight:"100vh", animation:"fadeIn 0.3s ease", paddingBottom: page.name !== "auth" ? "80px" : 0}}>
        {page.name==="home" && (
          <HomePage state={state} currentUser={currentUser} dispatch={dispatch} onNav={onNav}/>
        )}
        {page.name==="challenges" && (
          <ChallengesPage state={state} currentUser={currentUser} onNav={onNav}/>
        )}
        {page.name==="post" && (
          <PostDetail postId={page.param} state={state} currentUser={currentUser} dispatch={dispatch} onNav={onNav} showToast={showToast}/>
        )}
        {page.name==="write" && (
          <WritePost state={state} currentUser={currentUser} dispatch={dispatch} onNav={onNav} showToast={showToast}/>
        )}
        {page.name==="edit" && (
          <WritePost state={state} currentUser={currentUser} dispatch={dispatch} onNav={onNav} showToast={showToast} editPostId={page.param}/>
        )}
        {page.name==="profile" && (
          <ProfilePage userId={page.param} state={state} currentUser={currentUser} dispatch={dispatch} onNav={onNav} showToast={showToast}/>
        )}
        {page.name==="bookmarks" && (
          <BookmarksPage state={state} currentUser={currentUser} dispatch={dispatch} onNav={onNav}/>
        )}
        {page.name==="search" && (
          <SearchPage query={page.param||""} state={state} currentUser={currentUser} dispatch={dispatch} onNav={onNav}/>
        )}
        {page.name==="auth" && (
          <AuthPage mode={page.param} state={state} dispatch={dispatch} onLogin={onLogin} onNav={onNav}/>
        )}
        {page.name==="settings" && (
          <SettingsPage currentUser={currentUser} state={state} dispatch={dispatch} onNav={onNav} showToast={showToast} onUpdateUser={onUpdateUser}/>
        )}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      {page.name !== "auth" && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "rgba(13,13,26,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${TH.border}`,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 199,
          padding: "0 12px",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.5)"
        }}>
          {[
            { n: "home", l: "Home", i: "🏠" },
            { n: "search", l: "Explore", i: "🔍", p: "" },
            { n: "write", l: "Write", i: "✍️" },
            { n: "challenges", l: "Challenges", i: "🏆" },
            { n: "profile", l: "Profile", i: "👤", p: currentUser?.id }
          ].map(item => {
            const isActive = page.name === item.n || (item.n === "profile" && page.name === "profile" && page.param === currentUser?.id) || (item.n === "search" && page.name === "search");
            return (
              <button 
                key={item.n} 
                onClick={() => {
                  if (item.n === "write" && !currentUser) { onNav("auth", "login"); }
                  else if (item.n === "profile") {
                    if (currentUser) onNav("profile", currentUser.id);
                    else onNav("auth", "login");
                  }
                  else { onNav(item.n, item.p); }
                }} 
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  padding: "4px 12px",
                  color: isActive ? TH.accentL : TH.muted,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  transition: "all 0.15s",
                  minWidth: 64
                }}
              >
                <span style={{ 
                  fontSize: 18, 
                  filter: isActive ? `drop-shadow(0 0 6px ${TH.accentL}80)` : "none",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  transition: "transform 0.15s"
                }}>{item.i}</span>
                <span style={{ color: isActive ? TH.text : TH.muted }}>{item.l}</span>
              </button>
            );
          })}
        </div>
      )}

      {toast && <Toast msg={toast}/>}
    </>
  );
}
