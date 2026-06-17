const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

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
    coverGrad:"linear-gradient(135deg,#2ecc71,#1abc9c)", verified:true, followers:[], following:[1,2,3] }
];

const SEED_POSTS = [
  { id:1, userId:1, category:"biopic", featured:true,
    title:"The Last Lecture: Randy Pausch and the Art of Living Fully",
    excerpt:"On September 18, 2007, a dying professor walked onto a stage at Carnegie Mellon and delivered a talk that 20 million people would watch. He had pancreatic cancer. He was the happiest man in the room.",
    body: `On September 18, 2007, a dying professor walked onto a stage at Carnegie Mellon and delivered a talk that 20 million people would watch. He had pancreatic cancer. Three to six months to live. And he was the happiest man in the room.

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
    body: `In the village of Miren, there was a woman who mapped rivers that no longer existed. Ninety-one years old, half-blind, the most precise person Ezra had ever met.

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
    body: `In 1912, Henrietta Swan Leavitt published one of the most important measurements in the history of astronomy. She was never credited in her lifetime. She didn't even have a telescope.

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
    body: `Somewhere in Yale's Beinecke Library sits a book that no one can read.

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
    body: `The capital of Georgia sits at the intersection of Europe and Asia in a way that is not metaphorical. Standing in the old town: Persian balconies across from Soviet brutalism, a 4th-century church beside a 21st-century glass bridge.

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
    body: `In his final years, Nikola Tesla lived alone in Room 3327 of the New Yorker Hotel, feeding pigeons from his window. He had once lit 200 light bulbs wirelessly from 40 kilometres away.

Now he was broke, alone, and devoted to a single white bird with grey-tipped wings.

He wrote: "I loved that pigeon as a man loves a woman, and she loved me. As long as I had her, there was a purpose to my life."

Born 1856 in Serbia. Photographic memory. Could visualize machines complete in his head and run them mentally. Arrived in New York with four cents in his pocket.

He won the War of Currents against Edison. Then, when Westinghouse faced financial difficulties, Tesla tore up the royalty contract that would have made him the world's first billionaire — out of loyalty.

He died alone on January 7, 1943. Age 86.

The honest lesson isn't "history will vindicate your genius." That's too comfortable. It's this: to be a full human being is to need something that reflects back at you — a person, an animal, a work — that says "you are here."

Tesla found it in a bird he fed from a hotel window.

It is not a triumphant ending. It is a true one.`,
    tags:["genius","loneliness","invention"], readTime:9, likes:521, likedBy:[1,2,3,4,7,8], bookmarkedBy:[1,8], createdAt:"2026-06-02T10:00:00Z" }
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
  { id:17, postId:6, userId:3, body:"I come back to this piece every few months. The pigeon detail humanizes him in a way no list of patents ever could.", createdAt:"2026-06-05T11:00:00Z", likes:23, likedBy:[1,8] }
];

// ── Database Controller ───────────────────────────────────────────────────────
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: SEED_USERS,
      posts: SEED_POSTS,
      comments: SEED_COMMENTS,
      nUid: 11,
      nPid: 7,
      nCid: 18
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readDb() {
  initDb();
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── Authentication Endpoints ──────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = readDb();
  if (db.users.find(u => u.email === email.toLowerCase())) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  if (db.users.find(u => u.username === username.toLowerCase())) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  const newUser = {
    id: db.nUid,
    name: name.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password, // Stored in plain text for demo mock purposes
    avatar: name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(),
    bio: '',
    location: '',
    website: '',
    joined: new Date().toISOString(),
    coverGrad: 'linear-gradient(135deg,#6C4FE8,#E84FA0)',
    verified: false,
    followers: [],
    following: []
  };

  db.users.push(newUser);
  db.nUid += 1;
  writeDb(db);

  res.status(201).json(newUser);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDb();
  const user = db.users.find(u => u.email === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json(user);
});

// ── User Endpoints ────────────────────────────────────────────────────────────
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, bio, location, website } = req.body;

  const db = readDb();
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.users[userIndex] = {
    ...db.users[userIndex],
    name: name !== undefined ? name.trim() : db.users[userIndex].name,
    bio: bio !== undefined ? bio.trim() : db.users[userIndex].bio,
    location: location !== undefined ? location.trim() : db.users[userIndex].location,
    website: website !== undefined ? website.trim() : db.users[userIndex].website
  };

  writeDb(db);
  res.json(db.users[userIndex]);
});

app.post('/api/users/:id/follow', (req, res) => {
  const targetId = parseInt(req.params.id);
  const followerId = parseInt(req.body.followerId);

  const db = readDb();
  const target = db.users.find(u => u.id === targetId);
  const follower = db.users.find(u => u.id === followerId);

  if (!target || !follower) {
    return res.status(404).json({ error: 'User(s) not found' });
  }

  const followingIndex = follower.following.indexOf(targetId);
  if (followingIndex === -1) {
    // Follow
    follower.following.push(targetId);
    target.followers.push(followerId);
  } else {
    // Unfollow
    follower.following.splice(followingIndex, 1);
    const followerIndex = target.followers.indexOf(followerId);
    if (followerIndex !== -1) {
      target.followers.splice(followerIndex, 1);
    }
  }

  writeDb(db);
  res.json({ target, follower });
});

// ── Stories (Posts) Endpoints ─────────────────────────────────────────────────
app.get('/api/posts', (req, res) => {
  const db = readDb();
  res.json(db.posts);
});

app.post('/api/posts', (req, res) => {
  const { userId, category, title, excerpt, body, tags, readTime } = req.body;
  if (!userId || !category || !title || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = readDb();
  const author = db.users.find(u => u.id === userId);
  if (!author) {
    return res.status(404).json({ error: 'Author not found' });
  }

  const newPost = {
    id: db.nPid,
    userId,
    category,
    title: title.trim(),
    excerpt: excerpt ? excerpt.trim() : body.trim().slice(0, 150) + '...',
    body,
    tags: tags || [],
    readTime: readTime || Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    likes: 0,
    likedBy: [],
    bookmarkedBy: [],
    featured: false,
    createdAt: new Date().toISOString()
  };

  db.posts.unshift(newPost);
  db.nPid += 1;
  writeDb(db);

  res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, excerpt, body, category, tags } = req.body;

  const db = readDb();
  const postIndex = db.posts.findIndex(p => p.id === postId);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Story not found' });
  }

  db.posts[postIndex] = {
    ...db.posts[postIndex],
    title: title !== undefined ? title.trim() : db.posts[postIndex].title,
    excerpt: excerpt !== undefined ? excerpt.trim() : db.posts[postIndex].excerpt,
    body: body !== undefined ? body : db.posts[postIndex].body,
    category: category !== undefined ? category : db.posts[postIndex].category,
    tags: tags !== undefined ? tags : db.posts[postIndex].tags
  };

  writeDb(db);
  res.json(db.posts[postIndex]);
});

app.delete('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);

  const db = readDb();
  const postIndex = db.posts.findIndex(p => p.id === postId);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Story not found' });
  }

  db.posts.splice(postIndex, 1);
  db.comments = db.comments.filter(c => c.postId !== postId);
  
  writeDb(db);
  res.json({ message: 'Story deleted successfully' });
});

app.post('/api/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = parseInt(req.body.userId);

  const db = readDb();
  const post = db.posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: 'Story not found' });
  }

  const likeIndex = post.likedBy.indexOf(userId);
  if (likeIndex === -1) {
    post.likedBy.push(userId);
    post.likes += 1;
  } else {
    post.likedBy.splice(likeIndex, 1);
    post.likes = Math.max(0, post.likes - 1);
  }

  writeDb(db);
  res.json(post);
});

app.post('/api/posts/:id/bookmark', (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = parseInt(req.body.userId);

  const db = readDb();
  const post = db.posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: 'Story not found' });
  }

  const bookmarkIndex = post.bookmarkedBy.indexOf(userId);
  if (bookmarkIndex === -1) {
    post.bookmarkedBy.push(userId);
  } else {
    post.bookmarkedBy.splice(bookmarkIndex, 1);
  }

  writeDb(db);
  res.json(post);
});

// ── Comments Endpoints ────────────────────────────────────────────────────────
app.get('/api/comments/:postId', (req, res) => {
  const postId = parseInt(req.params.postId);
  const db = readDb();
  const results = db.comments.filter(c => c.postId === postId);
  res.json(results);
});

app.post('/api/comments', (req, res) => {
  const { postId, userId, body } = req.body;
  if (!postId || !userId || !body) {
    return res.status(400).json({ error: 'Missing comment parameters' });
  }

  const db = readDb();
  const newComment = {
    id: db.nCid,
    postId,
    userId,
    body: body.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: []
  };

  db.comments.push(newComment);
  db.nCid += 1;
  writeDb(db);

  res.status(201).json(newComment);
});

app.delete('/api/comments/:id', (req, res) => {
  const commentId = parseInt(req.params.id);

  const db = readDb();
  const commentIndex = db.comments.findIndex(c => c.id === commentId);
  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  db.comments.splice(commentIndex, 1);
  writeDb(db);
  res.json({ message: 'Comment deleted successfully' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Narratica API Server running on port ${PORT}`);
  console.log(`📁 Local database stored at: ${DB_FILE}`);
  console.log(`==================================================\n`);
});
