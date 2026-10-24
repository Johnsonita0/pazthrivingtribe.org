import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { isSupabaseStub, supabase } from '../supabaseClient';
import './solution-chat-page.css';

const suggestedQuestions = [
  'I feel anxious about the future',
  'How can I forgive someone who hurt me?',
  'I need strength during a difficult season'
];

const bibleTranslations = [
  { id: 'kjv', name: 'King James Version', language: 'English', shortName: 'KJV' },
  { id: 'web', name: 'World English Bible', language: 'English', shortName: 'WEB' },
  { id: 'asv', name: 'American Standard Version', language: 'English', shortName: 'ASV' },
  { id: 'bbe', name: 'Bible in Basic English', language: 'English', shortName: 'BBE' },
  { id: 'darby', name: 'Darby Bible', language: 'English', shortName: 'Darby' },
  { id: 'dra', name: 'Douay-Rheims 1899', language: 'English', shortName: 'DRA' },
  { id: 'ylt', name: 'Young’s Literal Translation', language: 'English · New Testament', shortName: 'YLT' },
  { id: 'oeb-cw', name: 'Open English Bible', language: 'English · Commonwealth', shortName: 'OEB-CW' },
  { id: 'webbe', name: 'WEB British Edition', language: 'English', shortName: 'WEBBE' },
  { id: 'oeb-us', name: 'Open English Bible', language: 'English · US', shortName: 'OEB-US' },
  { id: 'cherokee', name: 'Cherokee New Testament', language: 'Cherokee · New Testament', shortName: 'CHEROKEE' },
  { id: 'cuv', name: 'Chinese Union Version', language: 'Chinese', shortName: 'CUV' },
  { id: 'bkr', name: 'Bible kralická', language: 'Czech', shortName: 'BKR' },
  { id: 'almeida', name: 'João Ferreira de Almeida', language: 'Portuguese', shortName: 'ALMEIDA' },
  { id: 'rccv', name: 'Romanian Corrected Cornilescu', language: 'Romanian', shortName: 'RCCV' },
  { id: 'synodal', name: 'Russian Synodal', language: 'Russian', shortName: 'SYNODAL' },
  { id: 'clementine', name: 'Clementine Latin Vulgate', language: 'Latin', shortName: 'CLEMENTINE' },
  {
    id: 'yor_bib',
    name: 'Biblica® Open Yoruba Contemporary Bible™',
    language: 'Yoruba',
    shortName: 'YOR',
    provider: 'helloao',
    attribution: 'Biblica® Open Yoruba Contemporary Bible™. Copyright © 2009, 2017 Biblica, Inc. Used under CC BY-SA 4.0.',
    licenseUrl: 'https://ebible.org/Scriptures/details.php?id=yor'
  },
  {
    id: 'hau_bib',
    name: 'Biblica® Open Hausa Contemporary Bible™',
    language: 'Hausa',
    shortName: 'HAU',
    provider: 'helloao',
    attribution: 'Biblica® Open Hausa Contemporary Bible™. Copyright © 2009, 2020 Biblica, Inc. Used under CC BY-SA 4.0.',
    licenseUrl: 'https://ebible.org/Scriptures/details.php?id=hausa'
  }
];
const appSections = [
  { id: 'home', label: 'Home', icon: 'fa-house' },
  { id: 'chat', label: 'Chat', icon: 'fa-comments' },
  { id: 'coach', label: 'Coach', icon: 'fa-user-group' },
  { id: 'bible', label: 'Bible', icon: 'fa-book-bible' },
  { id: 'notes', label: 'My Note', icon: 'fa-bookmark' }
];
const homeFeatures = [
  { id: 'chat', title: 'AI Mentor Charles', description: 'Get thoughtful encouragement and Bible references for what is on your heart.', icon: 'fa-comments', tone: 'blue', chatTab: 'mentor' },
  { id: 'chat', title: 'Community Room', description: 'Find conversations around faith, encouragement, family and purpose.', icon: 'fa-people-group', tone: 'green', chatTab: 'community' },
  { id: 'coach', title: 'One on One Coach', description: 'Explore personal coaching and support for your goals and challenges.', icon: 'fa-user-group', tone: 'orange' },
  { id: 'bible', title: 'Bible', description: 'Read, reflect and grow with scripture and Bible study tools.', icon: 'fa-book-bible', tone: 'purple' },
  { id: 'bible', bibleTab: 'Devotional', title: 'Daily Devotional', description: 'Spend a moment with today’s Bible verse, reflection and prayer.', icon: 'fa-sun', tone: 'orange' },
  { id: 'notes', title: 'My Note', description: 'Capture your prayers, ideas, plans and reflections in one place.', icon: 'fa-bookmark', tone: 'pink' }
];
const communityCategories = ['All', 'Encouragement', 'Faith', 'Life & Purpose'];
const communityEmojis = [
  { emoji: '😊', label: 'Smiling face' },
  { emoji: '😂', label: 'Laughing face' },
  { emoji: '❤️', label: 'Red heart' },
  { emoji: '🙏', label: 'Prayer' },
  { emoji: '👍', label: 'Thumbs up' },
  { emoji: '👏', label: 'Clapping hands' },
  { emoji: '😍', label: 'Heart eyes' },
  { emoji: '😢', label: 'Crying face' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💪', label: 'Flexed biceps' },
  { emoji: '🎉', label: 'Party popper' },
  { emoji: '✨', label: 'Sparkles' }
];
const communityConversations = [
  { id: 'faith-growth', title: 'Faith & Growth', name: 'Grace', message: 'God’s timing is always perfect. Keep trusting!', time: '10:24 AM', unread: 3, category: 'Faith', initials: 'G', color: 'rose' },
  { id: 'life-challenges', title: 'Life Challenges', name: 'Tunde', message: 'Just keep praying, it will be alright.', time: '9:18 AM', unread: 5, category: 'Encouragement', initials: 'T', color: 'blue' },
  { id: 'purpose-destiny', title: 'Purpose & Destiny', name: 'Blessing', message: 'You are not alone. Keep moving forward.', time: '8:47 AM', unread: 2, category: 'Life & Purpose', initials: 'B', color: 'pink' },
  { id: 'prayer-requests', title: 'Prayer Requests', name: 'Amaka', message: 'Please keep my family in your prayers.', time: 'Yesterday', unread: 7, category: 'Faith', initials: 'A', color: 'green' },
  { id: 'relationship-family', title: 'Relationship & Family', name: 'Daniel', message: 'Communication is key. Be patient with one another.', time: 'Yesterday', unread: 4, category: 'Encouragement', initials: 'D', color: 'orange' },
  { id: 'career-skills', title: 'Career & Skills', name: 'Esther', message: 'God will open the right doors at the right time.', time: 'Mon', unread: 1, category: 'Life & Purpose', initials: 'E', color: 'brown' }
];
const coachSessions = [
  { id: 'career', title: 'Career Direction', date: 'Oct 18, 2025', status: 'Completed', tone: 'green', icon: 'fa-comments' },
  { id: 'growth', title: 'Personal Growth', date: 'Oct 25, 2025', status: 'Upcoming', tone: 'blue', icon: 'fa-award' },
  { id: 'relationship', title: 'Relationship', date: 'Nov 1, 2025', status: 'Scheduled', tone: 'orange', icon: 'fa-book-open' }
];
const bibleBooks = [
  { title: 'Genesis', chapters: 50 }, { title: 'Exodus', chapters: 40 }, { title: 'Leviticus', chapters: 27 },
  { title: 'Numbers', chapters: 36 }, { title: 'Deuteronomy', chapters: 34 }, { title: 'Joshua', chapters: 24 },
  { title: 'Judges', chapters: 21 }, { title: 'Ruth', chapters: 4 }, { title: '1 Samuel', chapters: 31 },
  { title: '2 Samuel', chapters: 24 }, { title: '1 Kings', chapters: 22 }, { title: '2 Kings', chapters: 25 },
  { title: '1 Chronicles', chapters: 29 }, { title: '2 Chronicles', chapters: 36 }, { title: 'Ezra', chapters: 10 },
  { title: 'Nehemiah', chapters: 13 }, { title: 'Esther', chapters: 10 }, { title: 'Job', chapters: 42 },
  { title: 'Psalms', chapters: 150 }, { title: 'Proverbs', chapters: 31 }, { title: 'Ecclesiastes', chapters: 12 },
  { title: 'Song of Solomon', chapters: 8 }, { title: 'Isaiah', chapters: 66 }, { title: 'Jeremiah', chapters: 52 },
  { title: 'Lamentations', chapters: 5 }, { title: 'Ezekiel', chapters: 48 }, { title: 'Daniel', chapters: 12 },
  { title: 'Hosea', chapters: 14 }, { title: 'Joel', chapters: 3 }, { title: 'Amos', chapters: 9 },
  { title: 'Obadiah', chapters: 1 }, { title: 'Jonah', chapters: 4 }, { title: 'Micah', chapters: 7 },
  { title: 'Nahum', chapters: 3 }, { title: 'Habakkuk', chapters: 3 }, { title: 'Zephaniah', chapters: 3 },
  { title: 'Haggai', chapters: 2 }, { title: 'Zechariah', chapters: 14 }, { title: 'Malachi', chapters: 4 },
  { title: 'Matthew', chapters: 28 }, { title: 'Mark', chapters: 16 }, { title: 'Luke', chapters: 24 },
  { title: 'John', chapters: 21 }, { title: 'Acts', chapters: 28 }, { title: 'Romans', chapters: 16 },
  { title: '1 Corinthians', chapters: 16 }, { title: '2 Corinthians', chapters: 13 }, { title: 'Galatians', chapters: 6 },
  { title: 'Ephesians', chapters: 6 }, { title: 'Philippians', chapters: 4 }, { title: 'Colossians', chapters: 4 },
  { title: '1 Thessalonians', chapters: 5 }, { title: '2 Thessalonians', chapters: 3 }, { title: '1 Timothy', chapters: 6 },
  { title: '2 Timothy', chapters: 4 }, { title: 'Titus', chapters: 3 }, { title: 'Philemon', chapters: 1 },
  { title: 'Hebrews', chapters: 13 }, { title: 'James', chapters: 5 }, { title: '1 Peter', chapters: 5 },
  { title: '2 Peter', chapters: 3 }, { title: '1 John', chapters: 5 }, { title: '2 John', chapters: 1 },
  { title: '3 John', chapters: 1 }, { title: 'Jude', chapters: 1 }, { title: 'Revelation', chapters: 22 }
];
const bibleBookAliases = {
  psalm: 'Psalms',
  ps: 'Psalms',
  jn: 'John',
  rev: 'Revelation',
  'song of songs': 'Song of Solomon'
};
const bibleCacheDatabase = 'paz-world-bible';
const bibleCacheStore = 'passages';
const bibleReaderStateKey = 'paz-world-bible-reader';
let bundledKjvPromise;
const starterNotes = [
  { title: 'My Goals', description: 'Build my skills, grow my career, make an impact.', category: 'Goals', icon: 'fa-bullseye', tone: 'green' },
  { title: 'Ideas', description: 'Start a tech project to help my community.', category: 'Ideas', icon: 'fa-lightbulb', tone: 'purple' },
  { title: 'Journal', description: 'Grateful for today. I’m learning to trust God more.', category: 'Journal', icon: 'fa-book-open', tone: 'blue' },
  { title: 'Prayer', description: 'Pray for my family, my future, and the people I care about.', category: 'Prayer', icon: 'fa-person-praying', tone: 'orange' }
];

function openBibleCache() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(bibleCacheDatabase, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(bibleCacheStore, { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open the offline Bible store.'));
  });
}

async function readCachedBiblePassage(key) {
  try {
    const database = await openBibleCache();
    const passage = await new Promise((resolve, reject) => {
      const request = database.transaction(bibleCacheStore, 'readonly').objectStore(bibleCacheStore).get(key);
      request.onsuccess = () => resolve(request.result?.passage ?? null);
      request.onerror = () => reject(request.error ?? new Error('Could not read the offline Bible store.'));
    });
    database.close();
    return passage ? { ...passage, offline: true } : null;
  } catch (error) {
    console.warn('Could not read a cached PAZ World Bible passage:', error);
    return null;
  }
}

async function cacheBiblePassage(key, passage) {
  try {
    const database = await openBibleCache();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(bibleCacheStore, 'readwrite');
      transaction.objectStore(bibleCacheStore).put({ key, passage, cachedAt: Date.now() });
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error ?? new Error('Could not save the offline Bible passage.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Saving the offline Bible passage was aborted.'));
    });
    database.close();
  } catch (error) {
    console.warn('Could not save a PAZ World Bible passage for offline reading:', error);
  }
}

async function fetchBundledKjvPassage(reference) {
  const match = reference.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) throw new Error('Enter a Bible reference such as John 3:16.');

  bundledKjvPromise ??= fetch('/paz-world/bible-kjv.json')
    .then((response) => {
      if (!response.ok) throw new Error('The offline KJV Bible could not be opened.');
      return response.json();
    })
    .catch((error) => {
      bundledKjvPromise = undefined;
      throw error;
    });

  const books = await bundledKjvPromise;
  const book = books.find(({ book: name }) => name.toLowerCase() === match[1].toLowerCase());
  const chapter = book?.chapters.find(({ chapter: number }) => Number(number) === Number(match[2]));
  if (!chapter) throw new Error('That book or chapter could not be found.');

  const firstVerse = match[3] ? Number(match[3]) : null;
  const lastVerse = match[4] ? Number(match[4]) : firstVerse;
  const verses = chapter.verses
    .filter(({ verse }) => firstVerse === null || (Number(verse) >= firstVerse && Number(verse) <= lastVerse))
    .map(({ verse, text }) => ({ book_name: book.book, chapter: Number(match[2]), verse: Number(verse), text }));
  if (!verses.length) throw new Error('No verses were found for this passage.');

  const passageReference = firstVerse === null
    ? `${book.book} ${match[2]}`
    : `${book.book} ${match[2]}:${firstVerse}${lastVerse === firstVerse ? '' : `-${lastVerse}`}`;
  const passage = {
    reference: passageReference,
    book_name: book.book,
    translation_id: 'kjv',
    translation_name: 'King James Version',
    verses,
    text: verses.map(({ text }) => text).join(' '),
    offline: !navigator.onLine
  };
  await cacheBiblePassage(`kjv:${passageReference.toLowerCase()}`, passage);
  return passage;
}

async function fetchHelloAoBiblePassage(reference, translation, signal) {
  const match = reference.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) throw new Error('Enter a Bible reference such as John 3:16.');

  const requestedBook = bibleBooks.find(({ title }) => title.toLowerCase() === match[1].toLowerCase());
  if (!requestedBook) throw new Error('That book could not be found.');

  const booksResponse = await fetch(`https://bible.helloao.org/api/${translation}/books.json`, { signal });
  if (!booksResponse.ok) throw new Error('Could not load this Bible version. Please try again.');
  const booksData = await booksResponse.json();
  const bookOrder = bibleBooks.findIndex(({ title }) => title === requestedBook.title) + 1;
  const translatedBook = booksData.books?.find(({ order }) => order === bookOrder);
  if (!translatedBook) throw new Error(`${requestedBook.title} is not available in this Bible version.`);

  const chapterNumber = Number(match[2]);
  const chapterResponse = await fetch(
    `https://bible.helloao.org/api/${translation}/${translatedBook.id}/${chapterNumber}.json`,
    { signal }
  );
  if (!chapterResponse.ok) throw new Error('Could not load this chapter. Check the reference and try again.');
  const chapterData = await chapterResponse.json();
  const allVerses = chapterData.chapter?.content
    ?.filter(({ type }) => type === 'verse')
    .map(({ number, content }) => ({
      book_name: requestedBook.title,
      chapter: chapterNumber,
      verse: number,
      text: content.map((part) => typeof part === 'string' ? part : part?.text ?? '').join('').trim()
    }))
    .filter(({ text }) => text);

  if (!allVerses?.length) throw new Error('No verses were found for this passage.');

  const chapterReference = `${requestedBook.title} ${chapterNumber}`;
  const chapterPassage = {
    reference: chapterReference,
    book_name: requestedBook.title,
    translation_id: translation,
    translation_name: bibleTranslations.find(({ id }) => id === translation)?.name ?? translation,
    verses: allVerses,
    text: allVerses.map(({ text }) => text).join(' ')
  };
  await cacheBiblePassage(`${translation}:${chapterReference.toLowerCase()}`, chapterPassage);

  const firstVerse = match[3] ? Number(match[3]) : null;
  const lastVerse = match[4] ? Number(match[4]) : firstVerse;
  const verses = allVerses.filter(({ verse }) => firstVerse === null
    || (verse >= firstVerse && verse <= lastVerse));
  if (!verses.length) throw new Error('No verses were found for this passage.');

  const passageReference = firstVerse === null
    ? chapterReference
    : `${chapterReference}:${firstVerse}${lastVerse === firstVerse ? '' : `-${lastVerse}`}`;
  return {
    ...chapterPassage,
    reference: passageReference,
    verses,
    text: verses.map(({ text }) => text).join(' ')
  };
}

async function fetchBiblePassage(reference, translation, signal) {
  const key = `${translation.toLowerCase()}:${reference.toLowerCase()}`;
  if (translation.toLowerCase() === 'kjv') {
    try {
      return await fetchBundledKjvPassage(reference);
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      console.error('Could not load the bundled PAZ World KJV passage:', error);
    }
  }

  if (bibleTranslations.find(({ id }) => id === translation)?.provider === 'helloao') {
    try {
      const passage = await fetchHelloAoBiblePassage(reference, translation, signal);
      await cacheBiblePassage(key, passage);
      return { ...passage, offline: false };
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      const cachedPassage = await readCachedBiblePassage(key);
      if (cachedPassage) return cachedPassage;
      const chapterMatch = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
      if (chapterMatch) {
        const chapterPassage = await readCachedBiblePassage(
          `${translation.toLowerCase()}:${chapterMatch[1].toLowerCase()} ${chapterMatch[2]}`
        );
        if (chapterPassage) {
          const firstVerse = Number(chapterMatch[3]);
          const lastVerse = Number(chapterMatch[4] || firstVerse);
          const verses = chapterPassage.verses.filter(({ verse }) => verse >= firstVerse && verse <= lastVerse);
          if (verses.length) {
            return {
              ...chapterPassage,
              reference,
              verses,
              text: verses.map(({ text }) => text).join(' '),
              offline: true
            };
          }
        }
      }
      throw error;
    }
  }

  const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${translation.toLowerCase()}`;
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error('Could not load this passage. Check the reference and try again.');
    const passage = await response.json();
    if (!Array.isArray(passage.verses) || passage.verses.length === 0) {
      throw new Error('No verses were found for this passage.');
    }
    await cacheBiblePassage(key, passage);
    return { ...passage, offline: false };
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    const cachedPassage = await readCachedBiblePassage(key);
    if (cachedPassage) return cachedPassage;
    const chapterMatch = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (chapterMatch) {
      const chapterPassage = await readCachedBiblePassage(`${translation.toLowerCase()}:${chapterMatch[1].toLowerCase()} ${chapterMatch[2]}`);
      if (chapterPassage) {
        const firstVerse = Number(chapterMatch[3]);
        const lastVerse = Number(chapterMatch[4] || firstVerse);
        const verses = chapterPassage.verses.filter(({ verse }) => verse >= firstVerse && verse <= lastVerse);
        if (verses.length) {
          return {
            ...chapterPassage,
            reference,
            verses,
            text: verses.map(({ text }) => text).join(' '),
            offline: true
          };
        }
      }
    }
    throw error;
  }
}

function normalizeBibleReference(input) {
  const query = input.trim().replace(/[.,]/g, ' ').replace(/\s+/g, ' ');
  const bookNames = [...bibleBooks.map(({ title }) => title), ...Object.keys(bibleBookAliases)]
    .sort((first, second) => second.length - first.length);
  const bookPattern = bookNames.map((title) => title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')).join('|');
  const match = query.match(new RegExp(`^(${bookPattern})\\s+(?:chapter\\s+|chap\\s+|ch\\s+)?(\\d+)(?:\\s*(?::|\\s)\\s*(?:verses?\\s+|vesr\\s+|v\\s*)?(\\d+)(?:\\s*[-–]\\s*(\\d+))?)?$`, 'i'));
  if (!match) return query;

  const matchedBookName = match[1].toLowerCase();
  const canonicalTitle = bibleBookAliases[matchedBookName] ?? match[1];
  const book = bibleBooks.find(({ title }) => title.toLowerCase() === canonicalTitle.toLowerCase());
  if (!book) return query;
  const chapter = Number(match[2]);
  if (chapter < 1 || chapter > book.chapters) return query;
  if (!match[3]) return `${book.title} ${chapter}`;
  const verse = Number(match[3]);
  const endVerse = match[4] ? Number(match[4]) : null;
  if (verse < 1 || (endVerse !== null && endVerse < verse)) return query;
  return `${book.title} ${chapter}:${verse}${endVerse === null ? '' : `-${endVerse}`}`;
}

function getSavedBibleReader() {
  try {
    const savedReader = JSON.parse(window.localStorage.getItem(bibleReaderStateKey) || 'null');
    const book = bibleBooks.find(({ title }) => title === savedReader?.book);
    const chapter = Number(savedReader?.chapter);
    if (book && Number.isInteger(chapter) && chapter >= 1 && chapter <= book.chapters) return { book: book.title, chapter };
  } catch (error) {
    console.warn('Could not restore the last PAZ World Bible location:', error);
  }
  return { book: '', chapter: 1 };
}

function getBibleNotes(storageKey) {
  try {
    const savedNotes = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    return Array.isArray(savedNotes)
      ? savedNotes.filter((note) => typeof note?.reference === 'string'
        && typeof note?.note === 'string'
        && typeof note?.updatedAt === 'string')
      : [];
  } catch (error) {
    console.error('Could not restore your PAZ World Bible notes:', error);
    return null;
  }
}

function isPwaInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

const getLagosDateKey = (date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  return parts.filter(({ type }) => ['year', 'month', 'day'].includes(type)).map(({ value }) => value).join('-');
};

const formatBibleNoteTimestamp = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Saved time unavailable';
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const dailyDevotionalContent = [
  { reference: 'Psalm 23:1', story: 'David knew what it meant to care for sheep in open country. Remembering that work helped him describe God as a shepherd who guides, provides, and stays near.', prayer: 'Shepherd God, guide my choices today. Help me trust Your care and notice the people who need kindness along the way. Amen.' },
  { reference: 'Isaiah 41:10', story: 'Isaiah spoke to people facing uncertainty and change. His message reminded them that they did not have to face the future alone.', prayer: 'God, steady my heart when I feel afraid. Remind me that You are with me and help me take the next right step. Amen.' },
  { reference: 'Matthew 11:28', story: 'Jesus welcomed people who were worn down by burdens. He offered them rest, compassion, and a gentler way forward.', prayer: 'Jesus, I bring You what is weighing on me. Give me rest, and show me how to move through today with grace. Amen.' },
  { reference: 'Philippians 4:6', story: 'From prison, Paul wrote to the believers in Philippi with encouragement. He invited them to bring their worries to God and keep practicing gratitude.', prayer: 'God, hear the concerns I carry today. Help me name what I need, give thanks for what is good, and receive Your peace. Amen.' },
  { reference: 'John 14:27', story: 'As Jesus prepared His friends for a difficult time, He comforted them with a promise of peace that would remain with them.', prayer: 'Prince of Peace, quiet the noise in my mind. Help me carry Your calm into every conversation and challenge today. Amen.' },
  { reference: 'Psalm 46:1', story: 'When trouble surrounded the people, this song pictured God as a safe place they could reach for help and strength.', prayer: 'God, be my refuge in the middle of today’s pressure. Give me courage to ask for help and wisdom to offer it. Amen.' },
  { reference: 'Romans 8:28', story: 'Paul encouraged a young Christian community living through hardship. He pointed them toward hope that God could work through even painful seasons.', prayer: 'God, meet me in the parts of life I cannot yet understand. Use my choices for good, and keep hope alive in me. Amen.' },
  { reference: 'Joshua 1:9', story: 'Joshua faced the enormous task of leading the people into a new land. He was urged to be courageous and remember that God would go with him.', prayer: 'God, give me courage for the responsibility in front of me. Help me act with integrity and remember I am not alone. Amen.' },
  { reference: 'Psalm 27:1', story: 'David’s song holds both fear and confidence together. In uncertain circumstances, he looked to God as his light and strength.', prayer: 'Light of my life, help me face what feels uncertain. Make my next step clear and strengthen me to take it. Amen.' },
  { reference: '1 Peter 5:7', story: 'Peter wrote to believers experiencing pressure and rejection. He reminded them that their worries mattered to God and could be brought to Him.', prayer: 'God, I place my worries in Your care. Help me receive support from others and show the same care to someone today. Amen.' },
  { reference: 'Proverbs 3:5', story: 'The wisdom of Proverbs teaches that a good life is shaped by trust in God, humility, and choices made with care.', prayer: 'God, guide me where I cannot see the whole path. Give me humility to listen and wisdom to choose well. Amen.' },
  { reference: '2 Corinthians 12:9', story: 'Paul described asking God to remove a painful struggle. Instead, he found that divine grace could sustain him in weakness.', prayer: 'God, meet me where I feel limited. Let Your grace be enough for today, and help me receive help without shame. Amen.' },
  { reference: 'Psalm 118:24', story: 'This psalm was sung in community as an act of gratitude. Its words invite people to recognize the gift of the day they have been given.', prayer: 'Thank You for this day, God. Open my eyes to small gifts, and help me bring patience and joy to what I do. Amen.' },
  { reference: 'Matthew 6:34', story: 'Jesus taught people not to let tomorrow’s unknowns consume today. He called them to meet the present day with trust.', prayer: 'God, bring my attention back to what I can do today. Help me plan wisely without carrying tomorrow’s fears too soon. Amen.' },
  { reference: 'Romans 12:12', story: 'Paul described a community shaped by hope, patience, and prayer, even as its members faced real difficulties together.', prayer: 'God, keep hope alive in me. Give me patience in difficulty and a faithful heart when I pray. Amen.' },
  { reference: 'Philippians 4:13', story: 'Paul wrote about learning contentment through changing circumstances. His strength came from the One who stayed with him in every season.', prayer: 'Christ, strengthen me for the work and relationships before me. Keep me humble in success and hopeful in difficulty. Amen.' },
  { reference: 'Isaiah 40:31', story: 'Isaiah offered renewed hope to people tired from a long season of waiting. He pictured strength returning, step by step.', prayer: 'God, renew my strength when I grow weary. Teach me to wait with hope and keep moving with kindness. Amen.' },
  { reference: 'John 16:33', story: 'Jesus spoke honestly to His disciples about trouble ahead, while assuring them that fear and hardship would not have the final word.', prayer: 'Jesus, stay close when today is hard. Give me courage to face trouble honestly and peace to keep going. Amen.' },
  { reference: 'Psalm 34:8', story: 'David’s song grew out of a frightening time. Looking back, he invited others to discover God’s goodness for themselves.', prayer: 'God, help me notice Your goodness in ordinary moments. Let gratitude shape how I speak and treat others today. Amen.' },
  { reference: 'Hebrews 11:1', story: 'The writer of Hebrews remembered people who kept trusting through uncertainty. Their stories show that faith can keep us moving before every answer is clear.', prayer: 'God, give me faith for the part of the journey I cannot yet see. Help me act with love while I wait for clarity. Amen.' },
  { reference: 'Galatians 6:9', story: 'Paul urged the community in Galatia not to give up doing good. Even when results take time, steady care can bear fruit.', prayer: 'God, renew my energy for doing good. Help me serve faithfully, set wise limits, and trust You with the results. Amen.' },
  { reference: 'Ephesians 2:10', story: 'Paul reminded the church that each person is made with purpose. Good work grows from grace and becomes a way to care for the world.', prayer: 'Creator God, show me one meaningful way to use my gifts today. Help me serve others with generosity and care. Amen.' },
  { reference: 'Psalm 121:1', story: 'Travelers sang this psalm on the road, looking toward the hills and remembering that their help came from the Maker of all things.', prayer: 'God, watch over my going out and coming in. Be near to everyone I love, wherever they are today. Amen.' },
  { reference: 'Colossians 3:23', story: 'Paul encouraged believers to bring sincerity and care to their everyday work, treating even ordinary tasks as meaningful.', prayer: 'God, help me do today’s work with care rather than resentment. Let my effort be honest, useful, and balanced. Amen.' },
  { reference: '1 John 4:18', story: 'The early Christian community was reminded that love is stronger than fear. Being loved by God can help people meet one another with courage.', prayer: 'God of love, soften the fears that make me pull away. Help me speak truthfully, set healthy boundaries, and choose compassion. Amen.' },
  { reference: 'Psalm 55:22', story: 'In a song of distress, the writer brought a heavy burden into prayer and trusted God to keep holding them up.', prayer: 'God, help me carry only what is mine to carry. Give me the courage to ask for support and the wisdom to release the rest. Amen.' },
  { reference: 'Matthew 5:16', story: 'Jesus taught His followers that everyday acts of goodness can point beyond themselves and help others recognize God’s care.', prayer: 'God, let my actions bring light today. Make my kindness practical and sincere, without seeking praise for myself. Amen.' },
  { reference: 'Romans 15:13', story: 'Paul prayed for a community learning to live together across differences. He wished them joy and peace rooted in hope.', prayer: 'God of hope, fill me with joy and peace. Help me make room for people whose experiences differ from mine. Amen.' },
  { reference: 'Lamentations 3:22', story: 'Written amid grief and loss, Lamentations pauses to remember that mercy can meet people again with the morning.', prayer: 'Merciful God, meet me in whatever this morning brings. Help me begin again and offer others the patience I need. Amen.' },
  { reference: 'Psalm 91:1', story: 'This psalm uses the image of shelter to describe the comfort of staying close to God through danger and uncertainty.', prayer: 'God, be my shelter today. Protect those who are vulnerable, and show me how to make others feel safe and welcome. Amen.' },
  { reference: 'Micah 6:8', story: 'The prophet Micah challenged people who thought faith was only about grand religious gestures. He called them to justice, mercy, and humility in daily life.', prayer: 'God, guide me to act justly, love mercy, and walk humbly today. Show me where I can repair harm and offer care. Amen.' }
];

const getDailyDevotionalIndex = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const dayOfYear = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86_400_000);
  return dayOfYear % dailyDevotionalContent.length;
};

const dailyDevotionalChallenges = [
  'Offer practical kindness to one person today.',
  'Take five quiet minutes to pray and listen.',
  'Encourage someone who may be carrying a heavy day.',
  'Write down one thing you are grateful for and why.',
  'Take one small step toward a task you have been avoiding.'
];
const devotionalLanguages = [
  { id: 'en', name: 'English', detail: 'Original devotional' },
  { id: 'yo', name: 'Yoruba', detail: 'Bible and devotional text' },
  { id: 'ha', name: 'Hausa', detail: 'Bible and devotional text' },
  { id: 'efi', name: 'Efik / Ibibio', detail: 'Translation availability may vary' }
];

async function translateDevotionalText(text, language, signal) {
  const query = new URLSearchParams({ q: text, langpair: `en|${language}` });
  const response = await fetch(`https://api.mymemory.translated.net/get?${query}`, { signal });
  if (!response.ok) throw new Error('The translation service could not be reached.');
  const payload = await response.json();
  const translatedText = payload.responseData?.translatedText;
  if (payload.responseStatus !== 200 || typeof translatedText !== 'string' || !translatedText.trim()) {
    throw new Error('A translation is not available right now.');
  }
  return new DOMParser().parseFromString(translatedText, 'text/html').documentElement.textContent || translatedText;
}

async function createCroppedAvatar(source, zoom, positionX, positionY) {
  const image = new Image();
  image.src = source;
  await image.decode();

  const cropSize = Math.min(image.naturalWidth, image.naturalHeight) / zoom;
  const sourceX = (image.naturalWidth - cropSize) * (positionX / 100);
  const sourceY = (image.naturalHeight - cropSize) * (positionY / 100);
  let outputSize = Math.min(512, Math.round(cropSize));

  while (outputSize >= 64) {
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Photo editing is not available in this browser.');
    context.drawImage(image, sourceX, sourceY, cropSize, cropSize, 0, 0, outputSize, outputSize);

    for (const quality of [0.86, 0.72, 0.58, 0.44, 0.3]) {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
      if (blob && blob.size <= 13 * 1024) {
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('The cropped photo could not be prepared.'));
          reader.readAsDataURL(blob);
        });
      }
    }
    outputSize = Math.floor(outputSize * 0.8);
  }

  throw new Error('This photo could not be compressed below 13 KB. Try a different image.');
}

export default function SolutionChatPage() {
  const installPromptRef = useRef(null);
  const [showSplash, setShowSplash] = useState(true);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(isPwaInstalled);
  const [showInstallPrompt, setShowInstallPrompt] = useState(!isPwaInstalled());
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [translation, setTranslation] = useState('kjv');
  const [devotionalLanguage, setDevotionalLanguage] = useState('en');
  const [translatedDevotional, setTranslatedDevotional] = useState(null);
  const [devotionalTranslationStatus, setDevotionalTranslationStatus] = useState('');
  const [translationSearch, setTranslationSearch] = useState('');
  const [isTranslationPickerOpen, setIsTranslationPickerOpen] = useState(false);
  const [isDevotionalLanguagePickerOpen, setIsDevotionalLanguagePickerOpen] = useState(false);
  const translationPickerRef = useRef(null);
  const translationMenuRef = useRef(null);
  const translationSearchInputRef = useRef(null);
  const devotionalLanguagePickerRef = useRef(null);
  const devotionalLanguageMenuRef = useRef(null);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const notificationMenuRef = useRef(null);
  const [dailyJourney, setDailyJourney] = useState({ reflection: '', challengeComplete: false, puzzleSolved: false });
  const [dailyJourneyMessage, setDailyJourneyMessage] = useState('');
  const [dailyPuzzleAnswer, setDailyPuzzleAnswer] = useState('');
  const [dailyPuzzleMessage, setDailyPuzzleMessage] = useState('');
  const [bibleBookSearch, setBibleBookSearch] = useState('');
  const [isBibleBookPickerOpen, setIsBibleBookPickerOpen] = useState(false);
  const verseElementsRef = useRef(new Map());
  const bibleReaderRef = useRef(null);
  const mainContentRef = useRef(null);
  const bibleChapterPickerRef = useRef(null);
  const bibleVersePickerRef = useRef(null);
  const scrollBibleReaderOnLoadRef = useRef(false);
  const scrollBiblePickerOnBookSelectRef = useRef(false);
  const searchTranslationRef = useRef(translation);
  const [activeSection, setActiveSection] = useState('home');
  const [activeChatTab, setActiveChatTab] = useState('mentor');
  const [profileSession, setProfileSession] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAvatarSource, setProfileAvatarSource] = useState('');
  const [profileAvatarData, setProfileAvatarData] = useState('');
  const [profileAvatarZoom, setProfileAvatarZoom] = useState(1);
  const [profileAvatarPositionX, setProfileAvatarPositionX] = useState(50);
  const [profileAvatarPositionY, setProfileAvatarPositionY] = useState(50);
  const [profileAvatarBusy, setProfileAvatarBusy] = useState(false);
  const [profileAvatarError, setProfileAvatarError] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileNotice, setProfileNotice] = useState('');
  const [appNotifications, setAppNotifications] = useState([]);
  const [appNotificationsLoading, setAppNotificationsLoading] = useState(false);
  const [appNotificationsError, setAppNotificationsError] = useState('');
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const [dailyDevotionalError, setDailyDevotionalError] = useState(null);
  const [clockNow, setClockNow] = useState(() => new Date());
  const [dailyNotificationStatus, setDailyNotificationStatus] = useState(() => {
    const dateKey = getLagosDateKey(new Date());
    return {
      dateKey,
      read: window.localStorage.getItem(`paz-world-daily-notification:${dateKey}`) === 'true'
    };
  });
  const [homePromoIndex, setHomePromoIndex] = useState(0);
  const [communityCategory, setCommunityCategory] = useState('All');
  const [communitySearch, setCommunitySearch] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [communityMessage, setCommunityMessage] = useState('');
  const [showCommunityEmojiPicker, setShowCommunityEmojiPicker] = useState(false);
  const [communityRecording, setCommunityRecording] = useState(false);
  const [communityAudioUrl, setCommunityAudioUrl] = useState('');
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const discardCommunityRecordingRef = useRef(false);
  const selectedBibleTranslation = bibleTranslations.find(({ id }) => id === translation) ?? bibleTranslations[0];
  const matchingBibleTranslations = bibleTranslations.filter(({ name, language }) => (
    `${name} ${language}`.toLowerCase().includes(translationSearch.trim().toLowerCase())
  ));
  const selectedCommunityConversation = communityConversations.find(({ id }) => id === selectedCommunityId);
  const isMobileViewport = window.matchMedia('(max-width: 640px)').matches;
  const chooseBibleBook = (book) => {
    scrollBibleReaderOnLoadRef.current = false;
    scrollBiblePickerOnBookSelectRef.current = true;
    setSelectedBibleBook(book);
    setSelectedBibleChapter(1);
    setSelectedBibleVerse(null);
    setBiblePickerMode('chapter');
    setBibleBookSearch('');
    setIsBibleBookPickerOpen(false);
    setBibleError('');
    setBibleTab('Read');
  };
  const searchBibleReference = async (event) => {
    event.preventDefault();
    if (!bibleReferenceSearch.trim()) return;
    const reference = normalizeBibleReference(bibleReferenceSearch);
    setBibleReferenceSearch(reference);
    setBibleTab('Search');
    setBibleLoading(true);
    setBibleError('');
    setBiblePassage(null);
    setSelectedBibleVerse(null);
    setHighlightedBibleVerse(null);
    try {
      const passage = await fetchBiblePassage(reference, translation);
      setBiblePassage(passage);
      const verseMatch = reference.match(/\s(\d+):(\d+)/);
      const verseReference = verseMatch ? `${verseMatch[1]}:${verseMatch[2]}` : null;
      setSelectedBibleVerse(verseReference);
      setHighlightedBibleVerse(verseReference);
    } catch (error) {
      setBiblePassage(null);
      setBibleError(error instanceof Error ? error.message : 'Could not load this passage. Please try again.');
    } finally {
      setBibleLoading(false);
    }
  };
  const clearBibleSearch = () => {
    setBibleReferenceSearch('');
    setBiblePassage(null);
    setBibleError('');
    setBibleLoading(false);
    setSelectedBibleVerse(null);
    setHighlightedBibleVerse(null);
  };
  const clearBibleSelection = () => {
    scrollBibleReaderOnLoadRef.current = false;
    setSelectedBibleBook('');
    setSelectedBibleChapter(1);
    setBiblePickerMode('chapter');
    setBibleBookSearch('');
    setIsBibleBookPickerOpen(false);
    setBiblePassage(null);
    setBibleError('');
    setBibleLoading(false);
    setSelectedBibleVerse(null);
    setHighlightedBibleVerse(null);
    try {
      window.localStorage.removeItem(bibleReaderStateKey);
    } catch (error) {
      console.warn('Could not clear the saved PAZ World Bible location:', error);
    }
  };
  const [bibleTab, setBibleTab] = useState('Read');
  const [savedBibleReader] = useState(getSavedBibleReader);
  const [selectedBibleBook, setSelectedBibleBook] = useState(savedBibleReader.book);
  const [selectedBibleChapter, setSelectedBibleChapter] = useState(savedBibleReader.chapter);
  const [biblePickerMode, setBiblePickerMode] = useState('chapter');
  const [biblePassage, setBiblePassage] = useState(null);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState('');
  const [bibleReferenceSearch, setBibleReferenceSearch] = useState('');
  const [selectedBibleVerse, setSelectedBibleVerse] = useState(null);
  const [isBiblePickerInView, setIsBiblePickerInView] = useState(null);
  const [highlightedBibleVerse, setHighlightedBibleVerse] = useState(null);
  const [verseOfDay, setVerseOfDay] = useState(null);
  const [noteCategory, setNoteCategory] = useState('All');
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [bibleNotes, setBibleNotes] = useState([]);
  const [loadedBibleNotesKey, setLoadedBibleNotesKey] = useState('');
  const [editingBibleNoteReference, setEditingBibleNoteReference] = useState('');
  const [draftBibleNote, setDraftBibleNote] = useState('');
  const [bibleNoteStatus, setBibleNoteStatus] = useState('');
  const [bibleNoteError, setBibleNoteError] = useState('');
  const [question, setQuestion] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const todayDateKey = getLagosDateKey(clockNow);
  const dailyDevotional = dailyDevotionalContent[getDailyDevotionalIndex(todayDateKey)];
  const dailyDevotionalReference = dailyDevotional.reference;
  const dailyDevotionalChallenge = dailyDevotionalChallenges[getDailyDevotionalIndex(todayDateKey) % dailyDevotionalChallenges.length];
  const devotionalCopy = translatedDevotional?.reference === dailyDevotionalReference
    && translatedDevotional.language === devotionalLanguage
    ? translatedDevotional
    : {
      ...dailyDevotional,
      reflection: 'Read this verse slowly. What does it show you about God, and how can you carry its truth into one moment of your day?',
      challenge: dailyDevotionalChallenge
    };
  const hasCurrentDailyVerse = verseOfDay?.dailyReference === dailyDevotionalReference;
  const puzzleWords = (verseOfDay?.text || '').match(/[\p{L}]{5,}/gu) || [];
  const dailyPuzzleWord = puzzleWords.length
    ? puzzleWords[getDailyDevotionalIndex(todayDateKey) % puzzleWords.length].normalize('NFC').toLowerCase()
    : '';
  const dailyPuzzleLetters = Array.from(dailyPuzzleWord);
  const dailyPuzzleScramble = dailyPuzzleLetters.length > 1
    ? [...dailyPuzzleLetters.slice(1), dailyPuzzleLetters[0]].join('')
    : dailyPuzzleWord;
  const formattedDate = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(clockNow);
  const formattedTime = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: 'numeric',
    minute: '2-digit'
  }).format(clockNow);
  const profileUser = profileSession?.user || null;
  const profileUserId = profileUser?.id;
  const bibleNotesStorageKey = `paz-world-bible-notes:v1:${profileUserId || 'guest'}`;
  const dailyNotificationRead = dailyNotificationStatus.dateKey === todayDateKey && dailyNotificationStatus.read;
  const profileDisplayName = customerProfile?.full_name
    || [customerProfile?.first_name, customerProfile?.last_name].filter(Boolean).join(' ')
    || profileUser?.user_metadata?.full_name
    || profileUser?.user_metadata?.name
    || profileUser?.email
    || 'PAZ World member';
  const profileAvatarDisplayUrl = profileAvatarData
    || customerProfile?.avatar_url
    || profileUser?.user_metadata?.avatar_url
    || profileUser?.user_metadata?.picture;
  const unreadNotificationCount = appNotifications.filter((notification) => !notification.read_at).length
    + (dailyNotificationRead ? 0 : 1);
  const isSelectedBibleChapterLoaded = biblePassage?.reference.toLowerCase()
    === `${selectedBibleBook} ${selectedBibleChapter}`.toLowerCase();
  const getBibleNoteForReference = (reference) => bibleNotes.find((note) => note.reference === reference);
  const getVerseReference = (passage, verse) => (
    `${verse.book_name || passage.book_name || selectedBibleBook} ${verse.chapter}:${verse.verse}`
  );
  const startBibleNote = (reference) => {
    const location = reference.match(/\s(\d+):(\d+)$/);
    if (location) {
      setSelectedBibleVerse(`${location[1]}:${location[2]}`);
      setHighlightedBibleVerse(`${location[1]}:${location[2]}`);
    }
    setEditingBibleNoteReference(reference);
    setDraftBibleNote(getBibleNoteForReference(reference)?.note || '');
    setBibleNoteStatus('');
    setBibleNoteError('');
  };
  const saveBibleNote = (reference) => {
    if (loadedBibleNotesKey !== bibleNotesStorageKey) return;
    const text = draftBibleNote.trim();
    if (!text) return;
    const nextNotes = [
      ...bibleNotes.filter((note) => note.reference !== reference),
      { reference, note: text, updatedAt: new Date().toISOString() }
    ].sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
    try {
      window.localStorage.setItem(bibleNotesStorageKey, JSON.stringify(nextNotes));
      setBibleNotes(nextNotes);
      setEditingBibleNoteReference('');
      setDraftBibleNote('');
      setBibleNoteStatus(`Note saved for ${reference}.`);
      setBibleNoteError('');
    } catch (error) {
      console.error('Could not save your PAZ World Bible note:', error);
      setBibleNoteError('Your note could not be saved on this device. Check available storage and try again.');
      setBibleNoteStatus('');
    }
  };
  const deleteBibleNote = (reference) => {
    if (loadedBibleNotesKey !== bibleNotesStorageKey) return;
    const nextNotes = bibleNotes.filter((note) => note.reference !== reference);
    try {
      window.localStorage.setItem(bibleNotesStorageKey, JSON.stringify(nextNotes));
      setBibleNotes(nextNotes);
      setEditingBibleNoteReference('');
      setDraftBibleNote('');
      setBibleNoteStatus(`Note removed for ${reference}.`);
      setBibleNoteError('');
    } catch (error) {
      console.error('Could not remove your PAZ World Bible note:', error);
      setBibleNoteError('Your note could not be removed. Check available storage and try again.');
      setBibleNoteStatus('');
    }
  };
  const openBibleNoteInReader = (note) => {
    const match = note.reference.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (!match) return;
    setActiveSection('bible');
    setBibleTab('Read');
    setSelectedBibleBook(match[1]);
    setSelectedBibleChapter(Number(match[2]));
    setSelectedBibleVerse(`${match[2]}:${match[3]}`);
    setHighlightedBibleVerse(`${match[2]}:${match[3]}`);
    setBiblePickerMode('verse');
    setEditingBibleNoteReference('');
    setBibleError('');
  };
  const renderBibleVerse = (passage, verse, trackElement = false) => {
    const verseReference = `${verse.chapter}:${verse.verse}`;
    const fullReference = getVerseReference(passage, verse);
    const note = getBibleNoteForReference(fullReference);
    const isEditing = editingBibleNoteReference === fullReference;
    const noteId = `solution-chat-bible-note-${verse.chapter}-${verse.verse}`;
    return (
      <div className={`solution-chat-bible-verse-row${note ? ' has-note' : ''}`} key={`${verse.chapter}-${verse.verse}`}>
        <button
          type="button"
          className={`solution-chat-bible-verse-text${highlightedBibleVerse === verseReference ? ' temporary-highlight' : selectedBibleVerse === verseReference ? ' selected' : ''}`}
          ref={trackElement ? (element) => {
            const key = `${verse.chapter}-${verse.verse}`;
            if (element) verseElementsRef.current.set(key, element);
            else verseElementsRef.current.delete(key);
          } : undefined}
          onClick={() => {
            setSelectedBibleVerse(verseReference);
            setHighlightedBibleVerse(verseReference);
          }}
          aria-pressed={selectedBibleVerse === verseReference}
        >
          <sup>{verse.verse}</sup>{verse.text.trim()}
        </button>
        <button
          className={`solution-chat-bible-note-action${note ? ' has-note' : ''}`}
          type="button"
          onClick={() => startBibleNote(fullReference)}
          disabled={loadedBibleNotesKey !== bibleNotesStorageKey}
          aria-label={`${note ? 'Edit' : 'Add'} note for ${fullReference}`}
          title={note ? 'Edit verse note' : 'Add a note to this verse'}
        >
          <i className={`fa-solid ${note ? 'fa-note-sticky' : 'fa-plus'}`} aria-hidden="true"></i>
          <span>{note ? 'Edit note' : 'Add note'}</span>
        </button>
        {note && !isEditing && (
          <aside className="solution-chat-bible-saved-note">
            <i className="fa-solid fa-note-sticky" aria-hidden="true"></i>
            <div><strong>Your reflection</strong><p>{note.note}</p></div>
            <time dateTime={note.updatedAt}>{formatBibleNoteTimestamp(note.updatedAt)}</time>
          </aside>
        )}
        {isEditing && (
          <form className="solution-chat-bible-note-editor" onSubmit={(event) => {
            event.preventDefault();
            saveBibleNote(fullReference);
          }}>
            <label htmlFor={noteId}>Your note for {fullReference}</label>
            <textarea
              id={noteId}
              value={draftBibleNote}
              onChange={(event) => setDraftBibleNote(event.target.value)}
              placeholder="What stands out to you in this verse?"
              rows={3}
              maxLength={5000}
              autoFocus
            />
            <div>
              <button type="submit" disabled={!draftBibleNote.trim() || loadedBibleNotesKey !== bibleNotesStorageKey}>Save note</button>
              {note && <button type="button" onClick={() => deleteBibleNote(fullReference)}>Delete</button>}
              <button type="button" onClick={() => { setEditingBibleNoteReference(''); setDraftBibleNote(''); }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    );
  };

  useEffect(() => {
    const timer = window.setInterval(() => setClockNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const updateSession = (session) => {
      setProfileSession(session);
      if (!session?.user) {
        setCustomerProfile(null);
        setProfileName('');
        setProfilePhone('');
        setAppNotifications([]);
        setAppNotificationsLoading(false);
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSession(session);
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error('Could not load the PAZ World account session:', error);
        setProfileError('Your account could not be checked. Please try again.');
        return;
      }
      updateSession(data.session);
    }).catch((error) => {
      if (active) {
        console.error('Could not load the PAZ World account session:', error);
        setProfileError('Your account could not be checked. Please try again.');
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const user = profileSession?.user;
    if (!user?.id) return undefined;
    let active = true;
    supabase.from('customer_profiles')
      .select('first_name,last_name,full_name,email,phone,avatar_url')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error('Could not load the PAZ World customer profile:', error);
          setProfileError('Your profile details could not be loaded. Please retry.');
          return;
        }
        setCustomerProfile(data || null);
        setProfileName(
          data?.full_name
          || [data?.first_name, data?.last_name].filter(Boolean).join(' ')
          || user.user_metadata?.full_name
          || user.user_metadata?.name
          || ''
        );
        setProfilePhone(data?.phone || user.phone || '');
      })
      .catch((error) => {
        if (active) {
          console.error('Could not load the PAZ World customer profile:', error);
          setProfileError('Your profile details could not be loaded. Please retry.');
        }
      });
    return () => { active = false; };
  }, [profileSession?.user]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => getBibleNotes(bibleNotesStorageKey)).then((savedNotes) => {
      if (!active) return;
      if (savedNotes === null) {
        setBibleNoteError('Your saved Bible notes could not be loaded. Check this device’s storage settings and retry.');
      } else {
        setBibleNotes(savedNotes);
        setBibleNoteError('');
      }
      setLoadedBibleNotesKey(bibleNotesStorageKey);
    });
    return () => { active = false; };
  }, [bibleNotesStorageKey]);

  useEffect(() => {
    if (!profileUserId) return undefined;
    let active = true;
    const loadNotifications = async () => {
      setAppNotificationsLoading(true);
      setAppNotificationsError('');
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session?.access_token) throw new Error('Sign in again to view your notifications.');
        const response = await fetch('/api/customer-notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.session.access_token}`
          },
          body: JSON.stringify({ action: 'list' })
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || 'Notifications could not be loaded.');
        if (active) setAppNotifications(Array.isArray(payload.notifications) ? payload.notifications : []);
      } catch (error) {
        if (active) {
          console.error('Could not load PAZ World notifications:', error);
          setAppNotificationsError(error?.message || 'Notifications could not be loaded. Please retry.');
        }
      } finally {
        if (active) setAppNotificationsLoading(false);
      }
    };
    void loadNotifications();
    return () => { active = false; };
  }, [profileUserId, notificationRefreshKey]);

  const handleProfileSignIn = async (event) => {
    event.preventDefault();
    setProfileBusy(true);
    setProfileError('');
    setProfileNotice('');
    try {
      if (isSupabaseStub) throw new Error('Account sign-in is temporarily unavailable.');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profileEmail.trim(),
        password: profilePassword
      });
      if (error) throw error;
      if (!data.session) throw new Error('Please verify your email address, then sign in again.');
      setProfilePassword('');
      setProfileNotice('You are signed in to PAZ World.');
    } catch (error) {
      setProfileError(error?.message || 'Sign-in failed. Please check your details and try again.');
    } finally {
      setProfileBusy(false);
    }
  };

  const handleProfileSignOut = async () => {
    setProfileBusy(true);
    setProfileError('');
    setProfileNotice('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfileEditOpen(false);
      setProfileNotice('You have signed out.');
    } catch (error) {
      setProfileError(error?.message || 'You could not be signed out. Please try again.');
    } finally {
      setProfileBusy(false);
    }
  };

  const handleProfileAvatarFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setProfileAvatarError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProfileAvatarError('Choose an image file to crop.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setProfileAvatarError('Choose an image smaller than 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setProfileAvatarError('The selected image could not be opened.');
        return;
      }
      setProfileAvatarSource(reader.result);
      setProfileAvatarZoom(1);
      setProfileAvatarPositionX(50);
      setProfileAvatarPositionY(50);
      setProfileAvatarError('');
    };
    reader.onerror = () => setProfileAvatarError('The selected image could not be opened.');
    reader.readAsDataURL(file);
  };

  const cropProfileAvatar = async () => {
    if (!profileAvatarSource) return;
    setProfileAvatarBusy(true);
    setProfileAvatarError('');
    try {
      const compressedAvatar = await createCroppedAvatar(
        profileAvatarSource,
        profileAvatarZoom,
        profileAvatarPositionX,
        profileAvatarPositionY
      );
      setProfileAvatarData(compressedAvatar);
      setProfileAvatarSource('');
      setProfileNotice('Photo cropped and compressed to 13 KB or less. Save your profile to apply it.');
    } catch (error) {
      setProfileAvatarError(error?.message || 'The photo could not be cropped. Please try another image.');
    } finally {
      setProfileAvatarBusy(false);
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    if (!profileUser) return;
    const fullName = profileName.trim();
    if (!fullName) {
      setProfileError('Enter your name before saving your profile.');
      return;
    }
    setProfileBusy(true);
    setProfileError('');
    setProfileNotice('');
    try {
      const { error } = await supabase.from('customer_profiles').upsert({
        id: profileUser.id,
        email: profileUser.email || null,
        full_name: fullName,
        phone: profilePhone.trim() || null,
        avatar_url: profileAvatarData || customerProfile?.avatar_url || profileUser.user_metadata?.avatar_url || profileUser.user_metadata?.picture || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) throw error;
      setCustomerProfile((current) => ({
        ...current,
        id: profileUser.id,
        email: profileUser.email || null,
        full_name: fullName,
        phone: profilePhone.trim() || null,
        avatar_url: profileAvatarData || customerProfile?.avatar_url || profileUser.user_metadata?.avatar_url || profileUser.user_metadata?.picture || null
      }));
      setProfileAvatarData('');
      setProfileAvatarSource('');
      setProfileEditOpen(false);
      setProfileNotice('Your PAZ World profile has been updated.');
    } catch (error) {
      console.error('Could not save the PAZ World customer profile:', error);
      setProfileError(error?.message || 'Your profile could not be saved. Please try again.');
    } finally {
      setProfileBusy(false);
    }
  };

  const markNotificationRead = async (notification) => {
    if (!profileUser || notification.read_at) return;
    setAppNotificationsError('');
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!data.session?.access_token) throw new Error('Sign in again to update your notifications.');
      const response = await fetch('/api/customer-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.session.access_token}`
        },
        body: JSON.stringify({ action: 'mark_read', id: notification.id })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Notification could not be marked as read.');
      setAppNotifications((current) => current.map((item) => (
        item.id === notification.id ? { ...item, read_at: new Date().toISOString() } : item
      )));
    } catch (error) {
      console.error('Could not update a PAZ World notification:', error);
      setAppNotificationsError(error?.message || 'Notification could not be marked as read.');
    }
  };

  const openNotification = (notification) => {
    if (notification) void markNotificationRead(notification);
    setIsNotificationMenuOpen(false);
    openSection({ id: 'notifications' });
  };

  const saveDailyJourney = (event) => {
    event.preventDefault();
    window.localStorage.setItem(`paz-world-devotional-journey:${todayDateKey}`, JSON.stringify(dailyJourney));
    setDailyJourneyMessage('Your devotional journey has been saved.');
  };

  const submitDailyPuzzle = (event) => {
    event.preventDefault();
    const answer = dailyPuzzleAnswer.trim().normalize('NFC').toLowerCase();
    if (!answer) {
      setDailyPuzzleMessage('Enter your answer to check it.');
      return;
    }
    if (answer === dailyPuzzleWord) {
      setDailyJourney((current) => ({ ...current, puzzleSolved: true }));
      setDailyPuzzleMessage('Correct. You found a word from today’s verse.');
      return;
    }
    setDailyPuzzleMessage('Not quite. Try another arrangement of the letters.');
  };

  useEffect(() => {
    if (devotionalLanguage === 'en') return undefined;

    const controller = new AbortController();
    Promise.all([
      translateDevotionalText(dailyDevotional.story, devotionalLanguage, controller.signal),
      translateDevotionalText('Read this verse slowly. What does it show you about God, and how can you carry its truth into one moment of your day?', devotionalLanguage, controller.signal),
      translateDevotionalText(dailyDevotional.prayer, devotionalLanguage, controller.signal),
      translateDevotionalText(dailyDevotionalChallenges[getDailyDevotionalIndex(todayDateKey) % dailyDevotionalChallenges.length], devotionalLanguage, controller.signal)
    ]).then(([story, reflection, prayer, challenge]) => {
      setTranslatedDevotional({
        reference: dailyDevotionalReference,
        language: devotionalLanguage,
        story,
        reflection,
        prayer,
        challenge
      });
      setDevotionalTranslationStatus('Machine-translated devotional text. Please review important wording.');
    }).catch((error) => {
      if (error.name !== 'AbortError') {
        setDevotionalTranslationStatus(devotionalLanguage === 'efi'
          ? 'Efik / Ibibio devotional translation is not available from the free source yet. The text remains in English.'
          : 'Translation is temporarily unavailable. The devotional text remains in English.');
      }
    });
    return () => controller.abort();
  }, [dailyDevotional.prayer, dailyDevotional.reference, dailyDevotional.story, dailyDevotionalReference, devotionalLanguage, todayDateKey]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const savedJourney = window.localStorage.getItem(`paz-world-devotional-journey:${todayDateKey}`);
        setDailyJourney(savedJourney
          ? { ...{ reflection: '', challengeComplete: false, puzzleSolved: false }, ...JSON.parse(savedJourney) }
          : { reflection: '', challengeComplete: false, puzzleSolved: false });
      } catch {
        setDailyJourney({ reflection: '', challengeComplete: false, puzzleSolved: false });
      }
      setDailyJourneyMessage('');
      setDailyPuzzleAnswer('');
      setDailyPuzzleMessage('');
    });
    return () => { active = false; };
  }, [todayDateKey]);

  useEffect(() => {
    if (!isNotificationMenuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!notificationMenuRef.current?.contains(event.target)) setIsNotificationMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsNotificationMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isNotificationMenuOpen]);

  useEffect(() => {
    const handleInstallPrompt = (event) => {
      event.preventDefault();
      installPromptRef.current = event;
      setCanInstall(true);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setShowInstallPrompt(false);
      setShowInstallHelp(false);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/paz-world/service-worker.js', { scope: '/paz-world/' })
        .then(async (registration) => {
          await navigator.serviceWorker.ready;
          const worker = registration.active;
          if (!worker) throw new Error('The PAZ World offline worker is not active.');
          const urls = performance.getEntriesByType('resource')
            .map((entry) => entry.name)
            .filter((value) => {
              const url = new URL(value, window.location.href);
              return url.origin === window.location.origin
                && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/paz-world/'));
            });
          worker.postMessage({ type: 'CACHE_PAZ_WORLD_ASSETS', urls });
        })
        .catch((error) => console.error('PAZ World service worker registration failed:', error));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!isTranslationPickerOpen) return undefined;
    translationSearchInputRef.current?.focus();
    const closeOnOutsidePointer = (event) => {
      if (!translationPickerRef.current?.contains(event.target)
        && !translationMenuRef.current?.contains(event.target)) {
        setIsTranslationPickerOpen(false);
        setTranslationSearch('');
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsTranslationPickerOpen(false);
        setTranslationSearch('');
      }
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isTranslationPickerOpen]);

  useEffect(() => {
    if (!isDevotionalLanguagePickerOpen) return undefined;
    const closeOnOutsidePointer = (event) => {
      if (!devotionalLanguagePickerRef.current?.contains(event.target)
        && !devotionalLanguageMenuRef.current?.contains(event.target)) {
        setIsDevotionalLanguagePickerOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsDevotionalLanguagePickerOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isDevotionalLanguagePickerOpen]);

  useEffect(() => {
    if (showSplash || activeSection !== 'home') return undefined;
    const promoTimer = window.setInterval(() => {
      setHomePromoIndex((index) => (index + 1) % homeFeatures.length);
    }, 7000);
    return () => window.clearInterval(promoTimer);
  }, [activeSection, showSplash]);

  useEffect(() => () => {
    discardCommunityRecordingRef.current = true;
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    if (!communityAudioUrl) return undefined;
    return () => URL.revokeObjectURL(communityAudioUrl);
  }, [communityAudioUrl]);

  useEffect(() => {
    if (!['home', 'bible', 'notifications'].includes(activeSection)) return undefined;
    const controller = new AbortController();
    fetchBiblePassage(dailyDevotionalReference, translation, controller.signal)
      .then((passage) => {
        setVerseOfDay({ ...passage.verses[0], dailyReference: dailyDevotionalReference });
        setDailyDevotionalError(null);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Could not load today’s PAZ World devotional verse:', error);
          setDailyDevotionalError({
            reference: dailyDevotionalReference,
            message: error instanceof Error ? error.message : 'Today’s Bible verse could not be loaded.'
          });
        }
      });
    return () => controller.abort();
  }, [activeSection, dailyDevotionalReference, translation]);

  useEffect(() => {
    if (searchTranslationRef.current === translation) return;
    searchTranslationRef.current = translation;
    if (activeSection !== 'bible' || bibleTab !== 'Search' || !bibleReferenceSearch.trim()) return;
    const controller = new AbortController();
    setBibleLoading(true);
    setBibleError('');
    fetchBiblePassage(bibleReferenceSearch, translation, controller.signal)
      .then(setBiblePassage)
      .catch((error) => {
        if (error.name !== 'AbortError') setBibleError(error instanceof Error ? error.message : 'Could not load this translation. Please try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setBibleLoading(false);
      });
    return () => controller.abort();
  }, [activeSection, bibleReferenceSearch, bibleTab, translation]);

  useEffect(() => {
    if (!selectedBibleBook || bibleTab !== 'Read') return undefined;
    const controller = new AbortController();
    setBibleLoading(true);
    setBibleError('');
    fetchBiblePassage(`${selectedBibleBook} ${selectedBibleChapter}`, translation, controller.signal)
      .then(setBiblePassage)
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setBiblePassage(null);
          setBibleError(error instanceof Error ? error.message : 'Could not load this chapter. Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setBibleLoading(false);
      });
    return () => controller.abort();
  }, [bibleTab, selectedBibleBook, selectedBibleChapter, translation]);

  useEffect(() => {
    if (selectedBibleVerse === null || !biblePassage) return;
    const isMobileViewport = window.matchMedia('(max-width: 640px)').matches;
    verseElementsRef.current.get(selectedBibleVerse.replace(':', '-'))?.scrollIntoView({
      behavior: 'smooth',
      block: isMobileViewport ? 'center' : 'start',
      inline: 'nearest'
    });
  }, [biblePassage, selectedBibleVerse]);

  useEffect(() => {
    if (highlightedBibleVerse === null) return undefined;
    const highlightTimer = window.setTimeout(() => {
      setHighlightedBibleVerse(null);
    }, 12000);
    return () => window.clearTimeout(highlightTimer);
  }, [highlightedBibleVerse]);

  useEffect(() => {
    const expectedReference = `${selectedBibleBook} ${selectedBibleChapter}`.toLowerCase();
    if (!scrollBibleReaderOnLoadRef.current
      || selectedBibleVerse !== null
      || bibleLoading
      || biblePassage?.reference.toLowerCase() !== expectedReference) return;
    scrollBibleReaderOnLoadRef.current = false;
    (bibleVersePickerRef.current ?? bibleReaderRef.current)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [bibleLoading, biblePassage, selectedBibleBook, selectedBibleChapter, selectedBibleVerse]);

  useEffect(() => {
    if (!scrollBiblePickerOnBookSelectRef.current) return;
    scrollBiblePickerOnBookSelectRef.current = false;
    bibleChapterPickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [bibleBookSearch, isBibleBookPickerOpen, selectedBibleBook, selectedBibleChapter, bibleTab]);

  useEffect(() => {
    const picker = bibleChapterPickerRef.current;
    const scrollContainer = mainContentRef.current;
    if (activeSection !== 'bible' || bibleTab !== 'Read' || !picker || !scrollContainer) {
      setIsBiblePickerInView(null);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsBiblePickerInView(entry.isIntersecting);
    }, {
      root: scrollContainer,
      threshold: 0.05
    });
    observer.observe(picker);
    return () => observer.disconnect();
  }, [activeSection, bibleTab, selectedBibleBook]);

  useEffect(() => {
    if (!selectedBibleBook) return;
    try {
      window.localStorage.setItem(bibleReaderStateKey, JSON.stringify({ book: selectedBibleBook, chapter: selectedBibleChapter }));
    } catch (error) {
      console.warn('Could not save the last PAZ World Bible location:', error);
    }
  }, [selectedBibleBook, selectedBibleChapter]);

  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousDocumentOverflow = documentElement.style.overflow;
    body.style.overflow = 'hidden';
    documentElement.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousDocumentOverflow;
    };
  }, []);

  const handleInstall = async () => {
    const installPrompt = installPromptRef.current;
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    installPromptRef.current = null;
    setCanInstall(false);
    if (choice.outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setStatusMessage(navigator.onLine
      ? 'AI Mentor Charles is not connected yet, so your message was not sent. Please check back soon.'
      : 'Connect to the internet to use AI Mentor Charles. Your message has not been sent.');
  };

  const selectQuestion = (prompt) => {
    setActiveSection('chat');
    setQuestion(prompt);
    setStatusMessage('');
    document.querySelector('.solution-chat-composer textarea')?.focus();
  };

  const openSection = (section) => {
    setIsNotificationMenuOpen(false);
    setActiveSection(section.id);
    if (section.id === 'bible' && section.bibleTab) setBibleTab(section.bibleTab);
    if (section.id === 'notifications') {
      setDailyNotificationStatus({ dateKey: todayDateKey, read: true });
      window.localStorage.setItem(`paz-world-daily-notification:${todayDateKey}`, 'true');
      setNotificationRefreshKey((key) => key + 1);
    }
    if (section.id === 'chat' && section.chatTab) setActiveChatTab(section.chatTab);
    setStatusMessage('');
  };
  const openDailyDevotional = () => {
    setBibleTab('Devotional');
    openSection({ id: 'bible' });
  };
  const openDailyVerseInReader = () => {
    if (!hasCurrentDailyVerse) return;
    const book = bibleBooks.find(({ title }) => title.toLowerCase() === verseOfDay.book_name.toLowerCase());
    if (!book) return;
    scrollBibleReaderOnLoadRef.current = true;
    setSelectedBibleBook(book.title);
    setSelectedBibleChapter(verseOfDay.chapter);
    setSelectedBibleVerse(`${verseOfDay.chapter}:${verseOfDay.verse}`);
    setHighlightedBibleVerse(`${verseOfDay.chapter}:${verseOfDay.verse}`);
    setBiblePickerMode('verse');
    setBibleTab('Read');
    openSection({ id: 'bible' });
  };
  const renderDailyDevotional = () => (
    <article className="solution-chat-daily-devotional">
      <div className="solution-chat-daily-devotional-heading">
        <div>
          <span className="solution-chat-daily-verse-label">DAILY DEVOTIONAL</span>
          <h2>{formattedDate}</h2>
        </div>
        <div className="solution-chat-translation solution-chat-devotional-language-picker" ref={devotionalLanguagePickerRef}>
          <button
            className="solution-chat-translation-trigger solution-chat-devotional-language-trigger"
            type="button"
            aria-label={`Devotional language: ${devotionalLanguages.find(({ id }) => id === devotionalLanguage)?.name || 'English'}`}
            aria-haspopup="listbox"
            aria-expanded={isDevotionalLanguagePickerOpen}
            aria-controls="solution-chat-devotional-language-options"
            onClick={() => setIsDevotionalLanguagePickerOpen((open) => !open)}
          >
            <span>Devotional language</span>
            <strong>{devotionalLanguages.find(({ id }) => id === devotionalLanguage)?.name || 'English'}</strong>
            <i className={`fa-solid ${isDevotionalLanguagePickerOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true"></i>
          </button>
          {isDevotionalLanguagePickerOpen && (() => {
            const menu = (
              <div
                className={`solution-chat-translation-menu devotional-language-menu${isMobileViewport ? ' mobile-overlay' : ''}`}
                id="solution-chat-devotional-language-options"
                ref={devotionalLanguageMenuRef}
                role="listbox"
                aria-label="Devotional languages"
              >
                <div className="solution-chat-translation-options">
                  {devotionalLanguages.map((language) => (
                    <button
                      key={language.id}
                      type="button"
                      role="option"
                      aria-selected={devotionalLanguage === language.id}
                      onClick={() => {
                        setDevotionalLanguage(language.id);
                        setDevotionalTranslationStatus('');
                        setTranslation(language.id === 'yo' ? 'yor_bib' : language.id === 'ha' ? 'hau_bib' : 'kjv');
                        setIsDevotionalLanguagePickerOpen(false);
                      }}
                    >
                      <span>{language.name}<small>{language.detail}</small></span>
                      {devotionalLanguage === language.id && <i className="fa-solid fa-check" aria-hidden="true"></i>}
                    </button>
                  ))}
                </div>
              </div>
            );
            return isMobileViewport ? createPortal(menu, document.body) : menu;
          })()}
        </div>
      </div>
      <section className="solution-chat-daily-devotional-scripture" aria-label="Bible verse for today">
        <span>VERSE FOR TODAY</span>
        {hasCurrentDailyVerse
          ? <blockquote>“{verseOfDay.text.trim()}”</blockquote>
          : dailyDevotionalError?.reference === dailyDevotionalReference
            ? <p className="solution-chat-profile-error" role="alert">{dailyDevotionalError.message}</p>
            : <p className="solution-chat-notifications-status" role="status">Loading today’s Bible verse…</p>}
        {hasCurrentDailyVerse && <strong>{verseOfDay.book_name} {verseOfDay.chapter}:{verseOfDay.verse} · {selectedBibleTranslation.shortName}</strong>}
      </section>
      <section className="solution-chat-daily-devotional-story">
        <h3>Today’s story</h3>
        <p>{devotionalCopy.story}</p>
      </section>
      <section className="solution-chat-daily-devotional-reflection">
        <h3>Reflect</h3>
        <p>{devotionalCopy.reflection}</p>
      </section>
      <section className="solution-chat-daily-devotional-prayer">
        <h3>Prayer for today</h3>
        <p>{devotionalCopy.prayer}</p>
      </section>
      {devotionalLanguage !== 'en' && !devotionalTranslationStatus
        && (translatedDevotional?.reference !== dailyDevotionalReference || translatedDevotional?.language !== devotionalLanguage)
        && <p className="solution-chat-daily-devotional-language-note" role="status">Translating today’s devotional…</p>}
      {devotionalTranslationStatus && <p className="solution-chat-daily-devotional-language-note" role="status">{devotionalTranslationStatus}</p>}
      <section className="solution-chat-daily-devotional-activity" aria-labelledby="solution-chat-daily-puzzle-title">
        <div className="solution-chat-daily-devotional-activity-heading">
          <span className="solution-chat-daily-devotional-activity-icon" aria-hidden="true"><i className="fa-solid fa-puzzle-piece"></i></span>
          <div>
            <h3 id="solution-chat-daily-puzzle-title">Daily puzzle</h3>
            <p>Unscramble a word from today’s verse.</p>
          </div>
        </div>
        <form className="solution-chat-daily-puzzle-form" onSubmit={submitDailyPuzzle}>
          <strong>{hasCurrentDailyVerse && dailyPuzzleScramble ? dailyPuzzleScramble.toUpperCase() : '…'}</strong>
          <input
            aria-label="Your puzzle answer"
            autoComplete="off"
            disabled={!hasCurrentDailyVerse || dailyJourney.puzzleSolved}
            onChange={(event) => setDailyPuzzleAnswer(event.target.value)}
            placeholder="Your answer"
            value={dailyPuzzleAnswer}
          />
          <button type="submit" disabled={!hasCurrentDailyVerse || dailyJourney.puzzleSolved}>
            {dailyJourney.puzzleSolved ? 'Solved' : 'Check'}
          </button>
        </form>
        {dailyPuzzleMessage && <p className="solution-chat-daily-puzzle-message" role="status">{dailyPuzzleMessage}</p>}
      </section>
      <section className="solution-chat-daily-devotional-activity" aria-labelledby="solution-chat-daily-challenge-title">
        <div className="solution-chat-daily-devotional-activity-heading">
          <span className="solution-chat-daily-devotional-activity-icon challenge" aria-hidden="true"><i className="fa-solid fa-route"></i></span>
          <div>
            <h3 id="solution-chat-daily-challenge-title">Today’s challenge</h3>
            <p>{devotionalCopy.challenge}</p>
          </div>
        </div>
      </section>
      <form className="solution-chat-daily-journey" onSubmit={saveDailyJourney}>
        <label htmlFor="solution-chat-daily-journey-reflection">My journey</label>
        <textarea
          id="solution-chat-daily-journey-reflection"
          onChange={(event) => setDailyJourney((current) => ({ ...current, reflection: event.target.value }))}
          placeholder="Write a thought, prayer, or step you want to remember…"
          rows={3}
          value={dailyJourney.reflection}
        />
        <label className="solution-chat-daily-challenge-check">
          <input
            checked={dailyJourney.challengeComplete}
            onChange={(event) => setDailyJourney((current) => ({ ...current, challengeComplete: event.target.checked }))}
            type="checkbox"
          />
          <span>I completed today’s challenge</span>
        </label>
        <button className="solution-chat-secondary-action" type="submit">
          <i className="fa-solid fa-floppy-disk" aria-hidden="true"></i>
          Save journey
        </button>
        {dailyJourneyMessage && <p className="solution-chat-daily-puzzle-message" role="status">{dailyJourneyMessage}</p>}
      </form>
      <button className="solution-chat-primary-action" type="button" onClick={openDailyVerseInReader} disabled={!hasCurrentDailyVerse}>
        <i className="fa-solid fa-book-bible" aria-hidden="true"></i>
        Read today’s verse in the Bible
      </button>
    </article>
  );
  const showPromo = (index) => {
    setHomePromoIndex((index + homeFeatures.length) % homeFeatures.length);
  };
  const startCommunityRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setStatusMessage('Voice recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      });
      recorder.addEventListener('stop', () => {
        if (chunks.length && !discardCommunityRecordingRef.current) {
          const audioUrl = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
          setCommunityAudioUrl(audioUrl);
        }
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        discardCommunityRecordingRef.current = false;
        setCommunityRecording(false);
      });
      mediaRecorderRef.current = recorder;
      discardCommunityRecordingRef.current = false;
      recorder.start();
      setCommunityRecording(true);
      setStatusMessage('');
    } catch (error) {
      setStatusMessage(error instanceof Error ? `Could not access your microphone: ${error.message}` : 'Could not access your microphone.');
    }
  };
  const stopCommunityRecording = (discard = false) => {
    discardCommunityRecordingRef.current = discard;
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
  };
  const filteredConversations = communityConversations.filter((conversation) => {
    const matchesCategory = communityCategory === 'All' || conversation.category === communityCategory;
    const search = communitySearch.trim().toLowerCase();
    const matchesSearch = !search || [conversation.title, conversation.name, conversation.message].some((value) => value.toLowerCase().includes(search));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className={`solution-chat-app ${selectedCommunityConversation ? 'group-chat-open' : ''}`}>
      {showSplash && (
        <section className="solution-chat-splash" role="status" aria-label="Opening PAZ World">
          <div className="solution-chat-splash-content">
            <img className="solution-chat-splash-logo" src="/paz-world/PAZZ_icon_transparent_corners.png" alt="PAZZ Thriving Tribe" />
            <p className="solution-chat-splash-community">— &nbsp; Community Room &nbsp; —</p>
            <p className="solution-chat-splash-features">One on One Coach Session<br />Bible with My Note</p>
            <p className="solution-chat-splash-tagline">Real People <i>•</i> Real Talk <i>•</i> Real Solutions</p>
            <button className="solution-chat-splash-start" type="button" onClick={() => setShowSplash(false)}>
              Get Started
            </button>
          </div>
          <svg className="solution-chat-splash-waves" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="splash-wave-a" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#05bce9" />
                <stop offset="52%" stopColor="#1458e5" />
                <stop offset="100%" stopColor="#7418e8" />
              </linearGradient>
              <linearGradient id="splash-wave-b" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#087ce8" />
                <stop offset="52%" stopColor="#1538d0" />
                <stop offset="100%" stopColor="#5920db" />
              </linearGradient>
              <linearGradient id="splash-wave-c" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#083db1" />
                <stop offset="55%" stopColor="#122d9b" />
                <stop offset="100%" stopColor="#31188e" />
              </linearGradient>
            </defs>
            <path d="M0 108 C190 46 310 52 480 112 C650 173 769 177 930 115 C1110 45 1262 41 1440 100 V320 H0Z" fill="url(#splash-wave-a)" />
            <path d="M0 158 C172 105 332 93 503 151 C684 213 827 223 995 162 C1152 106 1292 100 1440 140 V320 H0Z" fill="url(#splash-wave-b)" />
            <path d="M0 207 C182 168 332 157 509 207 C674 254 843 275 1018 221 C1175 172 1309 168 1440 196 V320 H0Z" fill="url(#splash-wave-c)" />
          </svg>
        </section>
      )}
      <aside className="solution-chat-sidebar" aria-label="PAZ World">
        <a className="solution-chat-brand" href="/paz-world/" aria-label="PAZ World home">
          <img className="solution-chat-brand-mark" src="/paz-world/PAZZ_icon_transparent_corners.png" alt="" />
          <span>
            <strong>PAZ World</strong>
            <small>Faith for everyday life</small>
          </span>
        </a>

        <div className="solution-chat-sidebar-label">YOUR SPACE</div>
        <nav className="solution-chat-sidebar-nav" aria-label="PAZ World sections">
          {appSections.map((section) => (
            <button
              className={`solution-chat-side-link ${activeSection === section.id ? 'active' : ''}`}
              type="button"
              key={section.id}
              onClick={() => openSection(section)}
              aria-current={activeSection === section.id ? 'page' : undefined}
            >
              <i className={`fa-solid ${section.icon}`} aria-hidden="true"></i>
              <span>{section.label}</span>
              {section.message && <span className="solution-chat-coming-soon">Soon</span>}
            </button>
          ))}
        </nav>

        <div className="solution-chat-sidebar-bottom">
          <div className="solution-chat-sidebar-quote">“The Lord is near to all who call on him.”<br /><span>Psalm 145:18</span></div>
          <a className="solution-chat-back-link" href="/">
            <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            <span>Back to PAZ Thriving Tribe</span>
          </a>
        </div>
      </aside>

      <section className="solution-chat-workspace" id="solution-chat">
        <header className={`solution-chat-topbar ${activeSection === 'community' || selectedCommunityConversation ? 'community-mode' : ''} ${selectedCommunityConversation ? 'group-chat-mode' : ''}`}>
          {activeSection === 'chat' && selectedCommunityConversation ? (
            <div className="solution-chat-group-heading">
              <button className="solution-chat-back-button" type="button" onClick={() => { stopCommunityRecording(true); setSelectedCommunityId(null); setCommunityAudioUrl(''); setStatusMessage(''); }} aria-label="Back to Community Room">
                <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
              </button>
              <span className={`solution-chat-group-avatar ${selectedCommunityConversation.color}`} aria-hidden="true">
                <i className="fa-solid fa-people-group"></i>
              </span>
              <span className="solution-chat-group-title">
                <strong>{selectedCommunityConversation.title}</strong>
                <small>342 members</small>
              </span>
              <button className="solution-chat-group-menu" type="button" aria-label="Group options" onClick={() => setStatusMessage('Group options will be available soon.')}>
                <i className="fa-solid fa-ellipsis" aria-hidden="true"></i>
              </button>
            </div>
          ) : (
            <div className="solution-chat-page-heading">
              <div>
                <p className="solution-chat-eyebrow">PAZ WORLD</p>
                <h1>{activeSection === 'home' ? 'Good to see you!' : activeSection === 'notes' ? 'My Note' : activeSection === 'notifications' ? 'Notifications' : activeSection === 'profile' ? 'Profile' : appSections.find((section) => section.id === activeSection)?.label}</h1>
                {activeSection === 'home' && <span>{formattedDate} · {formattedTime}</span>}
              </div>
            </div>
          )}
          {!(activeSection === 'chat' && selectedCommunityConversation) && <div className="solution-chat-topbar-actions">
            {activeSection === 'bible' && (
              <div className="solution-chat-translation" ref={translationPickerRef}>
                <button
                  className="solution-chat-translation-trigger"
                  type="button"
                  aria-label={`Bible version: ${selectedBibleTranslation.name}`}
                  aria-haspopup="listbox"
                  aria-expanded={isTranslationPickerOpen}
                  aria-controls="solution-chat-translation-options"
                  onClick={() => {
                    setIsTranslationPickerOpen((open) => !open);
                    setTranslationSearch('');
                  }}
                >
                  <span>Bible version</span>
                  <strong>{selectedBibleTranslation.shortName}</strong>
                  <i className={`fa-solid ${isTranslationPickerOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true"></i>
                </button>
                {isTranslationPickerOpen && (() => {
                  const menu = (
                    <div
                      className={`solution-chat-translation-menu${isMobileViewport ? ' mobile-overlay' : ''}`}
                      id="solution-chat-translation-options"
                      ref={translationMenuRef}
                    >
                    <label className="solution-chat-translation-search">
                      <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                      <input
                        ref={translationSearchInputRef}
                        type="search"
                        value={translationSearch}
                        onChange={(event) => setTranslationSearch(event.target.value)}
                        placeholder="Search versions or languages"
                        aria-label="Search Bible versions"
                      />
                    </label>
                    <div className="solution-chat-translation-options" role="listbox" aria-label="Bible versions">
                      {matchingBibleTranslations.map((version) => (
                        <button
                          key={version.id}
                          type="button"
                          role="option"
                          aria-selected={translation === version.id}
                          onClick={() => {
                            setTranslation(version.id);
                            setIsTranslationPickerOpen(false);
                            setTranslationSearch('');
                          }}
                        >
                          <span>{version.name}<small>{version.language}{version.id === 'kjv' ? ' · Available offline' : ''}</small></span>
                          <strong>{version.shortName}</strong>
                        </button>
                      ))}
                      {!matchingBibleTranslations.length && /efik|ibibio/i.test(translationSearch) && (
                        <p className="solution-chat-translation-unavailable">
                          Efik / Ibibio Bible text is not available from the connected Bible sources yet.
                        </p>
                      )}
                      {!matchingBibleTranslations.length && !/efik|ibibio/i.test(translationSearch) && (
                        <p className="solution-chat-translation-unavailable">No Bible versions match that search.</p>
                      )}
                    </div>
                  </div>
                  );
                  return isMobileViewport ? createPortal(menu, document.body) : menu;
                })()}
              </div>
            )}
            <div className="solution-chat-notification-menu-wrap" ref={notificationMenuRef}>
              <button
                className="solution-chat-notification-button"
                type="button"
                aria-label={`Notifications${unreadNotificationCount ? `, ${unreadNotificationCount} unread` : ''}`}
                aria-haspopup="dialog"
                aria-expanded={isNotificationMenuOpen}
                aria-controls="solution-chat-notification-menu"
                onClick={() => setIsNotificationMenuOpen((open) => !open)}
              >
                <i className="fa-regular fa-bell" aria-hidden="true"></i>
                {unreadNotificationCount > 0 && <span className="solution-chat-notification-count">{unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}</span>}
              </button>
              {isNotificationMenuOpen && (
                <div className="solution-chat-notification-menu" id="solution-chat-notification-menu" role="dialog" aria-label="Recent notifications">
                  <div className="solution-chat-notification-menu-heading">
                    <strong>Notifications</strong>
                    {unreadNotificationCount > 0 && <span>{unreadNotificationCount} unread</span>}
                  </div>
                  <button className="solution-chat-notification-menu-item" type="button" onClick={() => openNotification(null)}>
                    <span className="solution-chat-notification-menu-icon devotional"><i className="fa-solid fa-sun" aria-hidden="true"></i></span>
                    <span><strong>Today’s devotional</strong><small>{devotionalCopy.story}</small></span>
                    {!dailyNotificationRead && <i className="solution-chat-notification-menu-unread" aria-label="Unread"></i>}
                  </button>
                  {appNotificationsLoading && <p className="solution-chat-notification-menu-status">Loading notifications…</p>}
                  {!appNotificationsLoading && appNotifications.slice(0, 4).map((notification) => (
                    <button className="solution-chat-notification-menu-item" type="button" key={notification.id} onClick={() => openNotification(notification)}>
                      <span className="solution-chat-notification-menu-icon"><i className="fa-regular fa-bell" aria-hidden="true"></i></span>
                      <span><strong>{notification.title || 'PAZ update'}</strong><small>{notification.message || notification.body || 'You have a new update.'}</small></span>
                      {!notification.read_at && <i className="solution-chat-notification-menu-unread" aria-label="Unread"></i>}
                    </button>
                  ))}
                  {appNotificationsError && <p className="solution-chat-notification-menu-status" role="alert">{appNotificationsError}</p>}
                  <button className="solution-chat-notification-menu-all" type="button" onClick={() => openNotification(null)}>View all notifications</button>
                </div>
              )}
            </div>
            <button
              className="solution-chat-avatar"
              type="button"
              aria-label={profileUser ? `Profile: ${profileDisplayName}` : 'Guest profile, sign in or open profile'}
              aria-current={activeSection === 'profile' ? 'page' : undefined}
              onClick={() => openSection({ id: 'profile' })}
            >
              {profileAvatarDisplayUrl
                ? <img src={profileAvatarDisplayUrl} alt="" />
                : profileDisplayName.slice(0, 1).toUpperCase()}
            </button>
          </div>}
        </header>

        <div className="solution-chat-main-content" ref={mainContentRef}>
        {showInstallPrompt && !isInstalled && (
          <section className="solution-chat-install-banner" aria-label="Install PAZ World">
            <span className="solution-chat-install-icon" aria-hidden="true"><img src="/paz-world/PAZZ_icon_transparent_corners.png" alt="" /></span>
            <div className="solution-chat-install-copy">
              <strong>Take PAZ World with you</strong>
              <span>Install it on your device for quick access. You can keep using the web app either way.</span>
            </div>
            <button type="button" className="solution-chat-install-button" onClick={handleInstall}>
              <i className={`fa-solid ${canInstall ? 'fa-download' : 'fa-circle-info'}`} aria-hidden="true"></i>
              {canInstall ? 'Install app' : 'How to install'}
            </button>
            <button type="button" className="solution-chat-dismiss-button" onClick={() => setShowInstallPrompt(false)} aria-label="Dismiss install invitation">×</button>
          </section>
        )}

        {activeSection === 'home' ? (
          <div className="solution-chat-dashboard">
            {(() => {
              const feature = homeFeatures[homePromoIndex];
              return (
                <section className={`solution-chat-promo ${feature.tone}`} aria-label="PAZ World feature" aria-live="polite">
                  <div className="solution-chat-promo-content">
                    <span className="solution-chat-promo-eyebrow">DISCOVER PAZ WORLD</span>
                    <span className="solution-chat-promo-icon"><i className={`fa-solid ${feature.icon}`} aria-hidden="true"></i></span>
                    <h2>{feature.title}</h2>
                    <p>{feature.description}</p>
                    <button type="button" onClick={() => openSection(feature)}>
                      Explore feature <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className="solution-chat-promo-controls" aria-label="Promotional slides">
                    <button type="button" onClick={() => showPromo(homePromoIndex - 1)} aria-label="Previous feature">
                      <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    {homeFeatures.map((item, index) => (
                      <button
                        key={item.title}
                        type="button"
                        className={index === homePromoIndex ? 'active' : ''}
                        onClick={() => showPromo(index)}
                        aria-label={`Show ${item.title}`}
                        aria-current={index === homePromoIndex ? 'true' : undefined}
                      />
                    ))}
                    <button type="button" onClick={() => showPromo(homePromoIndex + 1)} aria-label="Next feature">
                      <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    </button>
                  </div>
                </section>
              );
            })()}

            <div className="solution-chat-feature-grid">
              {homeFeatures.map((feature) => (
                <button
                  className={`solution-chat-feature-card ${feature.tone}`}
                  type="button"
                  key={feature.title}
                  onClick={() => openSection(feature)}
                >
                  <i className={`fa-solid ${feature.icon}`} aria-hidden="true"></i>
                  <strong>{feature.title}</strong>
                  <span>{feature.description}</span>
                </button>
              ))}
            </div>

            <section className="solution-chat-devotional">
              <div className="solution-chat-devotional-heading">
                <h2>Memory Verse</h2>
                <button type="button" onClick={openDailyDevotional}>Read devotional</button>
              </div>
              <article className="solution-chat-devotional-card">
                <span className="solution-chat-devotional-art" aria-hidden="true"><i className="fa-solid fa-book-bible"></i></span>
                <span className="solution-chat-devotional-copy">
                  <strong>{hasCurrentDailyVerse ? `${verseOfDay.book_name} ${verseOfDay.chapter}:${verseOfDay.verse}` : 'Today’s Bible verse'}</strong>
                  <span>{hasCurrentDailyVerse ? `“${verseOfDay.text.trim()}”` : dailyDevotionalError?.reference === dailyDevotionalReference ? dailyDevotionalError.message : 'Loading today’s memory verse…'}</span>
                </span>
                <button className="solution-chat-memory-verse-read" type="button" onClick={openDailyDevotional}>Read</button>
              </article>
            </section>
            {statusMessage && <p className="solution-chat-status" role="status">{statusMessage}</p>}
          </div>
        ) : activeSection === 'chat' ? (
          <div className={`solution-chat-chat-page ${selectedCommunityConversation ? 'group-chat-open' : ''}`}>
            {!selectedCommunityConversation && <div className="solution-chat-chat-tabs" role="tablist" aria-label="Chat options">
              <button type="button" role="tab" aria-selected={activeChatTab === 'mentor'} className={activeChatTab === 'mentor' ? 'active' : ''} onClick={() => { setActiveChatTab('mentor'); setStatusMessage(''); }}>
                <i className="fa-solid fa-robot" aria-hidden="true"></i>
                AI Mentor Charles
              </button>
              <button type="button" role="tab" aria-selected={activeChatTab === 'community'} className={activeChatTab === 'community' ? 'active' : ''} onClick={() => { setActiveChatTab('community'); setStatusMessage(''); }}>
                <i className="fa-solid fa-people-group" aria-hidden="true"></i>
                Community Room
              </button>
            </div>}

            {activeChatTab === 'mentor' ? (
              <section className="solution-chat-mentor">
                <div className="solution-chat-mentor-welcome">
                  <img src="/mentor-charles-robot.png" alt="" />
                  <div>
                    <strong>AI Mentor Charles</strong>
                    <span>Your faith-based PAZ guide</span>
                  </div>
                </div>
                <div className="solution-chat-mentor-privacy" role="status">
                  <i className="fa-solid fa-lock" aria-hidden="true"></i>
                  <span><strong>Private to this browser session.</strong> Messages are not shared with Community Room or sent to Mentor Charles while AI replies are disconnected.</span>
                </div>
                <div className="solution-chat-mentor-message">
                  <p>Hello, I’m Mentor Charles. You can share what’s on your heart, and I’ll help you reflect with encouragement and Bible references.</p>
                  <small>AI replies are not connected yet. Your message will not be sent.</small>
                </div>
                <div className="solution-chat-mentor-prompts" aria-label="Suggested messages">
                  {suggestedQuestions.map((prompt) => (
                    <button type="button" key={prompt} onClick={() => { setQuestion(prompt); setStatusMessage(''); }}>
                      {prompt}
                    </button>
                  ))}
                </div>
                <form className="solution-chat-mentor-composer" onSubmit={handleSubmit}>
                  <label className="solution-chat-sr-only" htmlFor="mentor-charles-message">Message AI Mentor Charles</label>
                  <textarea
                    id="mentor-charles-message"
                    value={question}
                    onChange={(event) => { setQuestion(event.target.value); setStatusMessage(''); }}
                    placeholder="Message AI Mentor Charles..."
                    rows={2}
                  />
                  <button type="submit" disabled={!question.trim()} aria-label="Send message to AI Mentor Charles">
                    <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
                  </button>
                </form>
                {statusMessage && <p className="solution-chat-status" role="status">{statusMessage}</p>}
                <p className="solution-chat-disclaimer">Faith-based reflection is not a substitute for professional care or emergency support.</p>
              </section>
            ) : (
          <div className={`solution-chat-community ${selectedCommunityConversation ? 'is-group-chat' : ''}`}>
            {selectedCommunityConversation ? (
              <>
                <section className="solution-chat-group-messages" aria-label={`${selectedCommunityConversation.title} messages`}>
                  <article className="solution-chat-group-message">
                    <span className="solution-chat-group-person-avatar rose" aria-hidden="true">G</span>
                    <div className="solution-chat-group-message-body">
                      <div className="solution-chat-group-message-meta"><strong>Grace</strong><time>10:24 AM</time></div>
                      <p>God’s timing is always perfect. Keep trusting! 🙏</p>
                    </div>
                  </article>
                  <article className="solution-chat-group-message sent">
                    <span className="solution-chat-group-person-avatar blue" aria-hidden="true">T</span>
                    <div className="solution-chat-group-message-body">
                      <div className="solution-chat-group-message-meta"><strong>Tunde</strong><time>10:27 AM</time></div>
                      <p>Just what I needed to hear.<br />Thanks for sharing!</p>
                      <span className="solution-chat-message-reaction" aria-label="2 heart reactions">❤️ 2</span>
                    </div>
                  </article>
                  <article className="solution-chat-group-message">
                    <span className="solution-chat-group-person-avatar orange" aria-hidden="true">B</span>
                    <div className="solution-chat-group-message-body">
                      <div className="solution-chat-group-message-meta"><strong>Blessing</strong><time>10:31 AM</time></div>
                      <p>You are not alone. Keep praying and keep going. 💪</p>
                    </div>
                  </article>
                  <article className="solution-chat-group-message">
                    <span className="solution-chat-group-person-avatar green" aria-hidden="true">A</span>
                    <div className="solution-chat-group-message-body">
                      <div className="solution-chat-group-message-meta"><strong>Amaka</strong><time>10:36 AM</time></div>
                      <p>Amen! God is working behind the scenes.</p>
                    </div>
                  </article>
                </section>
                <form className="solution-chat-group-composer" onSubmit={(event) => { event.preventDefault(); if (communityMessage.trim()) setStatusMessage(navigator.onLine ? 'Community messaging is not connected yet, so your message was not sent.' : 'Connect to the internet to send community messages. Your message has not been sent.'); }}>
                  <label className="solution-chat-sr-only" htmlFor="community-group-message">Write a message</label>
                  <input id="community-group-message" value={communityMessage} onChange={(event) => setCommunityMessage(event.target.value)} placeholder="Type a message..." />
                  <div className="solution-chat-emoji-control">
                    <button
                      type="button"
                      aria-label="Choose an emoji"
                      aria-haspopup="listbox"
                      aria-expanded={showCommunityEmojiPicker}
                      onClick={() => setShowCommunityEmojiPicker((open) => !open)}
                    >
                      <i className="fa-regular fa-face-smile" aria-hidden="true"></i>
                    </button>
                    {showCommunityEmojiPicker && (
                      <div className="solution-chat-emoji-picker" role="listbox" aria-label="Choose an emoji">
                        {communityEmojis.map(({ emoji, label }) => (
                          <button
                            type="button"
                            key={label}
                            role="option"
                            aria-label={label}
                            onClick={() => {
                              setCommunityMessage((message) => `${message}${emoji}`);
                              setShowCommunityEmojiPicker(false);
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="button" aria-label="Attach a file" onClick={() => setStatusMessage('Attachments will be available soon.')}><i className="fa-solid fa-paperclip" aria-hidden="true"></i></button>
                  <button
                    className={`solution-chat-voice-note-button ${communityRecording ? 'recording' : ''}`}
                    type="button"
                    onClick={() => communityRecording ? stopCommunityRecording() : startCommunityRecording()}
                    aria-label={communityRecording ? 'Stop voice note recording' : 'Record a voice note'}
                    title={communityRecording ? 'Stop recording' : 'Record a voice note'}
                  >
                    <i className={`fa-solid ${communityRecording ? 'fa-stop' : 'fa-microphone'}`} aria-hidden="true"></i>
                  </button>
                  {communityAudioUrl && (
                    <>
                      <audio className="solution-chat-voice-preview" controls src={communityAudioUrl} aria-label="Recorded voice note preview">
                        Audio playback is not supported by this browser.
                      </audio>
                      <button type="button" aria-label="Discard voice note" onClick={() => setCommunityAudioUrl('')}>×</button>
                    </>
                  )}
                  <button className="solution-chat-group-send" type="submit" aria-label="Send message"><i className="fa-solid fa-paper-plane" aria-hidden="true"></i></button>
                </form>
                {communityRecording && <p className="solution-chat-recording-status" role="status"><span aria-hidden="true"></span> Recording voice note…</p>}
                {statusMessage && <p className="solution-chat-status" role="status">{statusMessage}</p>}
              </>
            ) : (
            <>
            <h2 className="solution-chat-community-title">Community Room</h2>
            <label className="solution-chat-community-search">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input
                type="search"
                value={communitySearch}
                onChange={(event) => {
                  setCommunitySearch(event.target.value);
                  setStatusMessage('');
                }}
                placeholder="Search or start a conversation"
                aria-label="Search community conversations"
              />
            </label>
            <div className="solution-chat-community-filters" aria-label="Filter conversations">
              {communityCategories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={communityCategory === category ? 'active' : ''}
                  onClick={() => {
                    setCommunityCategory(category);
                    setStatusMessage('');
                  }}
                  aria-pressed={communityCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="solution-chat-conversation-list">
              {filteredConversations.length ? filteredConversations.map((conversation) => (
                <button
                  className="solution-chat-conversation"
                  key={conversation.id}
                  type="button"
                  onClick={() => { setSelectedCommunityId(conversation.id); setCommunityAudioUrl(''); setStatusMessage(''); }}
                >
                  <span className={`solution-chat-conversation-avatar ${conversation.color}`}>{conversation.initials}</span>
                  <span className="solution-chat-conversation-copy">
                    <strong>{conversation.title}</strong>
                    <span><b>{conversation.name}:</b> {conversation.message}</span>
                  </span>
                  <span className="solution-chat-conversation-meta">
                    <time>{conversation.time}</time>
                    <span className="solution-chat-unread">{conversation.unread}</span>
                  </span>
                </button>
              )) : (
                <p className="solution-chat-empty-conversations">No conversations match your search.</p>
              )}
            </div>
            <button
              className="solution-chat-new-message"
              type="button"
              onClick={() => setStatusMessage('Starting a new community conversation will be available soon.')}
            >
              <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
              New Message
            </button>
            {statusMessage && <p className="solution-chat-status" role="status">{statusMessage}</p>}
            </>
            )}
          </div>
            )}
          </div>
        ) : activeSection === 'coach' ? (
          <div className="solution-chat-section-page solution-chat-coach-page">
            <section className="solution-chat-coach-card">
              <div className="solution-chat-coach-profile">
                <span className="solution-chat-coach-avatar" aria-label="Coach Daniel">CD</span>
                <span className="solution-chat-coach-details">
                  <strong>Coach Daniel</strong>
                  <span>Life &amp; Purpose Coach</span>
                  <small><i className="fa-solid fa-circle" aria-hidden="true"></i> Online</small>
                </span>
              </div>
              <p>Get personalized guidance, encouragement and support for your goals and challenges.</p>
              <button className="solution-chat-primary-action" type="button" onClick={() => setStatusMessage('Coach chat will be available soon.')}>
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                Chat with Coach
              </button>
            </section>
            <section className="solution-chat-sessions">
              <div className="solution-chat-section-heading">
                <h2>Your Sessions</h2>
                <button type="button" onClick={() => setStatusMessage('All coaching sessions will be available soon.')}>View All</button>
              </div>
              {coachSessions.map((session) => (
                <button className="solution-chat-session-row" type="button" key={session.id} onClick={() => setStatusMessage(`${session.title} session details will be available soon.`)}>
                  <span className={`solution-chat-session-icon ${session.tone}`}><i className={`fa-solid ${session.icon}`} aria-hidden="true"></i></span>
                  <span className="solution-chat-session-copy">
                    <strong>{session.title}</strong>
                    <span>{session.date} · 30 mins</span>
                  </span>
                  <span className={`solution-chat-session-status ${session.tone}`}>{session.status}</span>
                </button>
              ))}
              {statusMessage && <p className="solution-chat-status" role="status">{statusMessage}</p>}
            </section>
          </div>
        ) : activeSection === 'bible' ? (
          <div className={`solution-chat-section-page solution-chat-bible-page${selectedBibleVerse && isBiblePickerInView === false && bibleTab === 'Read' ? ' has-floating-reference' : ''}`}>
            <div className="solution-chat-bible-tabs" role="tablist" aria-label="Bible sections">
              {['Read', 'Search', 'Devotional'].map((tab) => (
                <button type="button" key={tab} role="tab" aria-selected={bibleTab === tab} className={bibleTab === tab ? 'active' : ''} onClick={() => { setBibleTab(tab); setBiblePassage(null); setBibleError(''); setBibleLoading(false); }}>{tab}</button>
              ))}
            </div>
            {bibleTab === 'Devotional' ? renderDailyDevotional() : (
              <button
                className="solution-chat-daily-verse"
                type="button"
                onClick={openDailyDevotional}
                disabled={!hasCurrentDailyVerse}
              >
                <span className="solution-chat-daily-verse-label">TODAY’S VERSE · {selectedBibleTranslation.shortName}</span>
                <strong>{hasCurrentDailyVerse ? `“${verseOfDay.text.trim()}”` : 'Loading today’s Bible verse…'}</strong>
                {hasCurrentDailyVerse && <span>{verseOfDay.book_name} {verseOfDay.chapter}:{verseOfDay.verse} <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></span>}
              </button>
            )}

            {bibleTab === 'Devotional' ? null : bibleTab === 'Read' ? (
              <>
                <div className="solution-chat-bible-reader-toolbar">
                  <label htmlFor="solution-chat-bible-book-search">Choose a book</label>
                  <div className="solution-chat-bible-book-picker">
                    <div className="solution-chat-bible-book-search">
                      <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                      <input
                        id="solution-chat-bible-book-search"
                        type="search"
                        value={bibleBookSearch}
                        onChange={(event) => {
                          setBibleBookSearch(event.target.value);
                          setIsBibleBookPickerOpen(true);
                        }}
                        onFocus={() => setIsBibleBookPickerOpen(true)}
                        placeholder={selectedBibleBook || 'Search all 66 books'}
                        aria-label="Search Bible books"
                        aria-expanded={isBibleBookPickerOpen}
                        aria-controls="solution-chat-bible-book-options"
                      />
                      {(selectedBibleBook || bibleBookSearch) && (
                        <button
                          className="solution-chat-bible-book-clear"
                          type="button"
                          onClick={clearBibleSelection}
                          aria-label="Clear selected Bible book"
                          title="Clear selection"
                        >
                          <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                        </button>
                      )}
                      <button type="button" onClick={() => setIsBibleBookPickerOpen((open) => !open)} aria-label={isBibleBookPickerOpen ? 'Close book list' : 'Open book list'}>
                        <i className={`fa-solid ${isBibleBookPickerOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true"></i>
                      </button>
                    </div>
                    {isBibleBookPickerOpen && (
                      <div className="solution-chat-bible-book-options" id="solution-chat-bible-book-options" role="listbox" aria-label="Bible books">
                        {[
                          { label: 'Old Testament', books: bibleBooks.slice(0, 39) },
                          { label: 'New Testament', books: bibleBooks.slice(39) }
                        ].map(({ label, books }) => {
                          const filteredBooks = books.filter(({ title }) => title.toLowerCase().includes(bibleBookSearch.trim().toLowerCase()));
                          if (!filteredBooks.length) return null;
                          return (
                            <div className="solution-chat-bible-book-group" key={label}>
                              <span>{label}</span>
                              {filteredBooks.map((book) => (
                                <button
                                  type="button"
                                  role="option"
                                  aria-selected={selectedBibleBook === book.title}
                                  key={book.title}
                                  onClick={() => chooseBibleBook(book.title)}
                                >
                                  {book.title}
                                  <small>{book.chapters} chapters</small>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                        {!bibleBooks.some(({ title }) => title.toLowerCase().includes(bibleBookSearch.trim().toLowerCase())) && (
                          <p className="solution-chat-bible-no-books">No books match that search.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {selectedBibleBook && (
                  <section className="solution-chat-bible-chapter-picker" ref={bibleChapterPickerRef} aria-label={`Choose a ${selectedBibleBook} chapter and verse`}>
                    <div className="solution-chat-bible-reader-heading">
                      <div>
                        <h2>{selectedBibleBook}</h2>
                        <span>{biblePickerMode === 'chapter' ? 'Choose a chapter' : `Chapter ${selectedBibleChapter} · choose a verse`}</span>
                      </div>
                      <span className="solution-chat-bible-version-badge">{selectedBibleTranslation.shortName}</span>
                    </div>
                    <div className="solution-chat-bible-picker-modes" role="group" aria-label="Choose chapter or verse">
                      <button
                        type="button"
                        className={biblePickerMode === 'chapter' ? 'active' : ''}
                        aria-pressed={biblePickerMode === 'chapter'}
                        onClick={() => setBiblePickerMode('chapter')}
                      >
                        Chapter
                      </button>
                      <button
                        type="button"
                        className={biblePickerMode === 'verse' ? 'active' : ''}
                        aria-pressed={biblePickerMode === 'verse'}
                        disabled={!isSelectedBibleChapterLoaded}
                        onClick={() => setBiblePickerMode('verse')}
                      >
                        Verse
                      </button>
                    </div>
                    {biblePickerMode === 'chapter' ? (
                      <div key="chapter-picker" className="solution-chat-bible-picker-view solution-chat-bible-chapter-grid">
                        {Array.from({ length: bibleBooks.find((book) => book.title === selectedBibleBook)?.chapters ?? 0 }, (_, index) => index + 1).map((chapter) => (
                          <button
                            type="button"
                            key={chapter}
                            className={selectedBibleChapter === chapter ? 'active' : ''}
                            aria-pressed={selectedBibleChapter === chapter}
                            onClick={() => {
                              setBiblePickerMode('verse');
                              if (chapter === selectedBibleChapter && isSelectedBibleChapterLoaded) {
                                bibleVersePickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                return;
                              }
                              scrollBibleReaderOnLoadRef.current = false;
                              setSelectedBibleChapter(chapter);
                              setSelectedBibleVerse(null);
                            }}
                          >
                            {chapter}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div key="verse-picker" className="solution-chat-bible-picker-view solution-chat-bible-verse-picker" ref={bibleVersePickerRef}>
                        {isSelectedBibleChapterLoaded ? (
                          <div className="solution-chat-bible-verse-grid" aria-label={`Verses in ${selectedBibleBook} ${selectedBibleChapter}`}>
                            {biblePassage.verses.map(({ chapter, verse }) => {
                              const verseReference = `${chapter}:${verse}`;
                              return (
                                <button
                                  type="button"
                                  key={verseReference}
                                  className={selectedBibleVerse === verseReference ? 'active' : ''}
                                  aria-pressed={selectedBibleVerse === verseReference}
                                  aria-label={`Verse ${verse}`}
                                  onClick={() => {
                                    setSelectedBibleVerse(verseReference);
                                    setHighlightedBibleVerse(verseReference);
                                  }}
                                >
                                  {verse}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="solution-chat-bible-verse-loading" role="status">
                            {bibleError ? 'Verse numbers could not be loaded.' : 'Loading verse numbers…'}
                          </span>
                        )}
                      </div>
                    )}
                  </section>
                )}
                {bibleLoading && biblePassage && <p className="solution-chat-bible-updating" role="status"><i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Updating translation…</p>}
                {bibleLoading && !biblePassage && <p className="solution-chat-bible-feedback" role="status"><i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Loading scripture…</p>}
                {bibleError && <p className="solution-chat-bible-feedback error" role="alert">{bibleError}</p>}
                {biblePassage && (
                  <article className="solution-chat-bible-reading" ref={bibleReaderRef}>
                    <header>
                      <div>
                        <span>{biblePassage.translation_name}</span>
                        <h2>{biblePassage.reference}</h2>
                      </div>
                      {biblePassage.offline && <span className="solution-chat-bible-offline-label"><i className="fa-solid fa-cloud-arrow-down" aria-hidden="true"></i> Saved offline</span>}
                      <button
                        type="button"
                        onClick={() => {
                          scrollBibleReaderOnLoadRef.current = true;
                          setBiblePickerMode('verse');
                          setSelectedBibleChapter((chapter) => Math.max(1, chapter - 1));
                          setSelectedBibleVerse(null);
                        }}
                        disabled={selectedBibleChapter <= 1}
                        aria-label="Previous chapter"
                      >
                        <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          scrollBibleReaderOnLoadRef.current = true;
                          setBiblePickerMode('verse');
                          setSelectedBibleChapter((chapter) => Math.min(bibleBooks.find((book) => book.title === selectedBibleBook)?.chapters ?? chapter, chapter + 1));
                          setSelectedBibleVerse(null);
                        }}
                        disabled={selectedBibleChapter >= (bibleBooks.find((book) => book.title === selectedBibleBook)?.chapters ?? selectedBibleChapter)}
                        aria-label="Next chapter"
                      >
                        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                      </button>
                    </header>
                    <button
                      className="solution-chat-bible-picker-shortcut"
                      type="button"
                      onClick={() => {
                        setBiblePickerMode('verse');
                        mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <i className="fa-solid fa-list-ol" aria-hidden="true"></i>
                      Chapter &amp; verse
                    </button>
                    <div className="solution-chat-bible-verses">
                      {biblePassage.verses.map((verse) => renderBibleVerse(biblePassage, verse, true))}
                    </div>
                    {bibleNoteError && <p className="solution-chat-bible-feedback error" role="alert">{bibleNoteError}</p>}
                    {bibleNoteStatus && <p className="solution-chat-bible-note-status" role="status">{bibleNoteStatus}</p>}
                    {selectedBibleTranslation.attribution && (
                      <footer className="solution-chat-bible-attribution">
                        <span>{selectedBibleTranslation.attribution}</span>
                        <a href={selectedBibleTranslation.licenseUrl} target="_blank" rel="noreferrer">
                          Translation details and license
                        </a>
                      </footer>
                    )}
                  </article>
                )}
                {selectedBibleVerse
                  && isSelectedBibleChapterLoaded
                  && isBiblePickerInView === false
                  && (
                    <button
                      className="solution-chat-bible-current-reference"
                      type="button"
                      onClick={() => {
                        setBiblePickerMode('verse');
                        mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      aria-label={`Selected verse ${selectedBibleBook} ${selectedBibleVerse}. Return to chapter and verse picker`}
                    >
                      <i className="fa-solid fa-book-bible" aria-hidden="true"></i>
                      <span>{selectedBibleBook} {selectedBibleVerse}</span>
                      <i className="fa-solid fa-chevron-up" aria-hidden="true"></i>
                    </button>
                  )}
                {!selectedBibleBook && !bibleLoading && (
                  <div className="solution-chat-bible-empty">
                    <i className="fa-solid fa-book-open" aria-hidden="true"></i>
                    <strong>Your Bible, made easy to explore</strong>
                    <span>Choose any book, then tap a chapter to start reading.</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <form className="solution-chat-bible-search" onSubmit={searchBibleReference}>
                  <label htmlFor="solution-chat-bible-reference">Find a passage</label>
                  <div>
                    <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    <input
                      id="solution-chat-bible-reference"
                      value={bibleReferenceSearch}
                      onChange={(event) => setBibleReferenceSearch(event.target.value)}
                      placeholder="Try John 3:16 or Psalm 23"
                    />
                    <button type="submit" disabled={!bibleReferenceSearch.trim()}>Search</button>
                    <button
                      className="solution-chat-bible-clear"
                      type="button"
                      onClick={clearBibleSearch}
                      disabled={bibleLoading || (!bibleReferenceSearch && !biblePassage && !bibleError)}
                    >
                      Clear
                    </button>
                  </div>
                </form>
                {bibleLoading && biblePassage && <p className="solution-chat-bible-updating" role="status"><i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Updating translation…</p>}
                {bibleLoading && !biblePassage && <p className="solution-chat-bible-feedback" role="status"><i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Looking up passage…</p>}
                {bibleError && <p className="solution-chat-bible-feedback error" role="alert">{bibleError}</p>}
                {biblePassage && (
                  <article className="solution-chat-bible-reading">
                    <header>
                      <div><span>{biblePassage.translation_name}</span><h2>{biblePassage.reference}</h2></div>
                      {biblePassage.offline && <span className="solution-chat-bible-offline-label"><i className="fa-solid fa-cloud-arrow-down" aria-hidden="true"></i> Saved offline</span>}
                    </header>
                    <div className="solution-chat-bible-verses">
                      {biblePassage.verses.map((verse) => renderBibleVerse(biblePassage, verse, true))}
                    </div>
                    {bibleNoteError && <p className="solution-chat-bible-feedback error" role="alert">{bibleNoteError}</p>}
                    {bibleNoteStatus && <p className="solution-chat-bible-note-status" role="status">{bibleNoteStatus}</p>}
                  </article>
                )}
              </>
            )}
            {statusMessage && <p className="solution-chat-status" role="status">{statusMessage}</p>}
          </div>
        ) : activeSection === 'notifications' ? (
          <div className="solution-chat-section-page solution-chat-notifications-page">
            <div className="solution-chat-notifications-heading">
              <div>
                <p className="solution-chat-eyebrow">YOUR PAZ WORLD UPDATES</p>
                <h2>Today’s devotional &amp; app updates</h2>
              </div>
              <time dateTime={clockNow.toISOString()}>{formattedDate} · {formattedTime}</time>
            </div>

            {renderDailyDevotional()}

            {!profileUser && (
              <div className="solution-chat-notification-signin">
                <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
                <p>Sign in to PAZ World to sync your profile and see your personal PAZ Shop order and message notifications here.</p>
                <button type="button" onClick={() => openSection({ id: 'profile' })}>Sign in</button>
              </div>
            )}

            {appNotificationsError && <p className="solution-chat-profile-error" role="alert">{appNotificationsError}</p>}
            {appNotificationsLoading && <p className="solution-chat-notifications-status" role="status"><i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Loading your notifications…</p>}
            {!appNotificationsLoading && profileUser && !appNotifications.length && !appNotificationsError && (
              <p className="solution-chat-notifications-status">You’re all caught up. New PAZ Shop notifications will appear here.</p>
            )}
            <div className="solution-chat-notification-list" aria-label="PAZ World notifications">
              {appNotifications.map((notification) => (
                <article className={`solution-chat-notification-card${notification.read_at ? '' : ' unread'}`} key={notification.id}>
                  <span className="solution-chat-notification-icon"><i className="fa-solid fa-bell" aria-hidden="true"></i></span>
                  <div className="solution-chat-notification-copy">
                    <div className="solution-chat-notification-meta">
                      <strong>{notification.title || 'PAZ update'}</strong>
                      <time>{notification.created_at ? new Intl.DateTimeFormat('en-NG', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.created_at)) : 'Recent'}</time>
                    </div>
                    <p>{notification.message || notification.body || 'You have a new update.'}</p>
                    <span>PAZ Shop</span>
                  </div>
                  {!notification.read_at && (
                    <button className="solution-chat-notification-mark-read" type="button" onClick={() => void markNotificationRead(notification)}>
                      Mark as read
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        ) : activeSection === 'profile' ? (
          <div className="solution-chat-section-page solution-chat-profile-page">
            <section className="solution-chat-profile-card" aria-label="PAZ World account">
              <span className="solution-chat-profile-avatar">
                {profileAvatarDisplayUrl
                  ? <img src={profileAvatarDisplayUrl} alt="" />
                  : profileDisplayName.slice(0, 1).toUpperCase()}
              </span>
              <div className="solution-chat-profile-identity">
                <strong>{profileUser ? profileDisplayName : 'Welcome to PAZ World'}</strong>
                <span>{profileUser?.email || 'Sign in to sync your PAZ profile and notifications.'}</span>
              </div>
              {profileUser && (
                <div className="solution-chat-profile-actions">
                  <button className="solution-chat-secondary-action" type="button" onClick={() => {
                    const opening = !profileEditOpen;
                    if (!opening) {
                      setProfileAvatarSource('');
                      setProfileAvatarData('');
                      setProfileAvatarError('');
                    }
                    setProfileEditOpen(opening);
                    setProfileError('');
                    setProfileNotice('');
                  }}>
                    <i className={`fa-solid ${profileEditOpen ? 'fa-xmark' : 'fa-pen'}`} aria-hidden="true"></i>
                    {profileEditOpen ? 'Cancel' : 'Edit profile'}
                  </button>
                  <button className="solution-chat-secondary-action" type="button" onClick={() => void handleProfileSignOut()} disabled={profileBusy}>
                    Sign out
                  </button>
                </div>
              )}
            </section>

            {profileError && <p className="solution-chat-profile-error" role="alert">{profileError}</p>}
            {profileNotice && <p className="solution-chat-profile-notice" role="status">{profileNotice}</p>}

            {!profileUser ? (
              <form className="solution-chat-signin-card" onSubmit={handleProfileSignIn}>
                <div>
                  <p className="solution-chat-eyebrow">ONE ACCOUNT ACROSS PAZ</p>
                  <h2>Sign in to PAZ World</h2>
                  <p>Use the email and password you use for your PAZ Shop profile to sign in to PAZ World.</p>
                </div>
                <label htmlFor="solution-chat-profile-email">Email address</label>
                <input id="solution-chat-profile-email" type="email" autoComplete="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} required />
                <label htmlFor="solution-chat-profile-password">Password</label>
                <input id="solution-chat-profile-password" type="password" autoComplete="current-password" value={profilePassword} onChange={(event) => setProfilePassword(event.target.value)} required />
                <button className="solution-chat-primary-action" type="submit" disabled={profileBusy || isSupabaseStub}>
                  {profileBusy ? 'Signing in…' : 'Sign in'}
                </button>
                {isSupabaseStub && <p className="solution-chat-profile-hint">Sign-in is unavailable until the account service is configured.</p>}
              </form>
            ) : (
              <>
                {profileEditOpen && (
                  <form className="solution-chat-profile-edit-card" onSubmit={handleProfileSave}>
                    <h2>Update your PAZ World profile</h2>
                    <p>Your PAZ Shop account stays the same; these details personalize your PAZ World profile.</p>
                    <div className="solution-chat-profile-avatar-editor">
                      <span className="solution-chat-profile-avatar-preview">
                        {profileAvatarDisplayUrl
                          ? <img src={profileAvatarDisplayUrl} alt="Profile photo preview" />
                          : <i className="fa-solid fa-user" aria-hidden="true"></i>}
                      </span>
                      <div>
                        <strong>Profile photo</strong>
                        <small>Crop a square photo. Saved image size: 13 KB max.</small>
                        <label className="solution-chat-profile-photo-pick">
                          <i className="fa-solid fa-camera" aria-hidden="true"></i>
                          Choose photo
                          <input type="file" accept="image/*" onChange={handleProfileAvatarFile} />
                        </label>
                      </div>
                    </div>
                    {profileAvatarSource && (
                      <div className="solution-chat-avatar-crop" role="dialog" aria-label="Crop profile photo">
                        <strong>Crop profile photo</strong>
                        <div className="solution-chat-avatar-crop-preview">
                          <img
                            src={profileAvatarSource}
                            alt="Crop preview"
                            style={{ objectPosition: `${profileAvatarPositionX}% ${profileAvatarPositionY}%`, transform: `scale(${profileAvatarZoom})` }}
                          />
                        </div>
                        <label>
                          Zoom <output>{profileAvatarZoom.toFixed(1)}×</output>
                          <input type="range" min="1" max="4" step="0.1" value={profileAvatarZoom} onChange={(event) => setProfileAvatarZoom(Number(event.target.value))} />
                        </label>
                        <label>
                          Horizontal crop
                          <input type="range" min="0" max="100" value={profileAvatarPositionX} onChange={(event) => setProfileAvatarPositionX(Number(event.target.value))} />
                        </label>
                        <label>
                          Vertical crop
                          <input type="range" min="0" max="100" value={profileAvatarPositionY} onChange={(event) => setProfileAvatarPositionY(Number(event.target.value))} />
                        </label>
                        <div className="solution-chat-avatar-crop-actions">
                          <button type="button" className="solution-chat-secondary-action" onClick={() => setProfileAvatarSource('')}>Cancel crop</button>
                          <button type="button" className="solution-chat-primary-action" onClick={() => void cropProfileAvatar()} disabled={profileAvatarBusy}>
                            {profileAvatarBusy ? 'Preparing photo…' : 'Use cropped photo'}
                          </button>
                        </div>
                      </div>
                    )}
                    {profileAvatarError && <p className="solution-chat-profile-error" role="alert">{profileAvatarError}</p>}
                    <label htmlFor="solution-chat-profile-name">Name</label>
                    <input id="solution-chat-profile-name" type="text" autoComplete="name" value={profileName} onChange={(event) => setProfileName(event.target.value)} required />
                    <label htmlFor="solution-chat-profile-phone">Phone number</label>
                    <input id="solution-chat-profile-phone" type="tel" autoComplete="tel" value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} />
                    <button className="solution-chat-primary-action" type="submit" disabled={profileBusy || profileAvatarBusy || Boolean(profileAvatarSource)}>{profileBusy ? 'Saving…' : 'Save profile'}</button>
                  </form>
                )}
                {!profileEditOpen && (
                  <dl className="solution-chat-profile-details">
                    <div><dt>Email address</dt><dd>{profileUser.email || 'Not provided'}</dd></div>
                    <div><dt>Name</dt><dd>{customerProfile?.full_name || profileDisplayName}</dd></div>
                    <div><dt>Phone number</dt><dd>{customerProfile?.phone || profileUser.phone || 'Not provided'}</dd></div>
                    <div><dt>Member since</dt><dd>{profileUser.created_at ? new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(new Date(profileUser.created_at)) : '—'}</dd></div>
                  </dl>
                )}
              </>
            )}

            <section className="solution-chat-profile-links" aria-label="PAZ World profile options">
              <h2>Your PAZ World</h2>
              <button type="button" onClick={() => openSection({ id: 'notes' })}><i className="fa-solid fa-bookmark" aria-hidden="true"></i><span><strong>My notes</strong><small>Return to your reflections and prayers</small></span><i className="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
              <button type="button" onClick={() => openSection({ id: 'notifications' })}><i className="fa-regular fa-bell" aria-hidden="true"></i><span><strong>Notifications</strong><small>Daily encouragement and PAZ updates</small></span><i className="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
              <button type="button" onClick={() => openSection({ id: 'bible' })}><i className="fa-solid fa-book-bible" aria-hidden="true"></i><span><strong>Bible reader</strong><small>Read and explore scripture</small></span><i className="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
              <a href="/shop"><i className="fa-solid fa-store" aria-hidden="true"></i><span><strong>PAZ Shop</strong><small>Visit the shop with this same account</small></span><i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
            </section>
          </div>
        ) : activeSection === 'notes' ? (
          <div className="solution-chat-section-page solution-chat-notes-page">
            <div className="solution-chat-note-filters" aria-label="Filter notes">
              {['All', 'Scripture', 'Ideas', 'Goals', 'Journal', 'Prayer'].map((category) => (
                <button type="button" key={category} className={noteCategory === category ? 'active' : ''} onClick={() => setNoteCategory(category)} aria-pressed={noteCategory === category}>{category}</button>
              ))}
            </div>
            <div className="solution-chat-note-list">
              {starterNotes.filter((note) => noteCategory !== 'Scripture' && (noteCategory === 'All' || note.category === noteCategory)).map((note) => (
                <article className="solution-chat-note-card" key={note.title}>
                  <span className={`solution-chat-note-icon ${note.tone}`}><i className={`fa-solid ${note.icon}`} aria-hidden="true"></i></span>
                  <span><strong>{note.title}</strong><small>{note.description}</small></span>
                  <time>Today</time>
                </article>
              ))}
              {bibleNotes
                .filter(() => noteCategory === 'All' || noteCategory === 'Scripture')
                .map((note) => (
                  <article className="solution-chat-note-card solution-chat-scripture-note-card" key={note.reference}>
                    <span className="solution-chat-note-icon purple"><i className="fa-solid fa-book-bible" aria-hidden="true"></i></span>
                    <span><strong>{note.reference}</strong><small>{note.note}</small></span>
                    <time dateTime={note.updatedAt}>{formatBibleNoteTimestamp(note.updatedAt)}</time>
                    <button type="button" onClick={() => openBibleNoteInReader(note)}>Open verse</button>
                  </article>
                ))}
              {newNote.trim() && <article className="solution-chat-note-card"><span className="solution-chat-note-icon blue"><i className="fa-solid fa-note-sticky" aria-hidden="true"></i></span><span><strong>New Note</strong><small>{newNote}</small></span><time>Today</time></article>}
            </div>
            {bibleNoteError && <p className="solution-chat-bible-feedback error" role="alert">{bibleNoteError}</p>}
            {noteCategory === 'Scripture' && !bibleNotes.length && !bibleNoteError && (
              <p className="solution-chat-notes-empty">Your scripture notes will appear here. Open a verse in the Bible and choose <strong>Add note</strong> to save a reflection.</p>
            )}
            {showNoteEditor ? (
              <form className="solution-chat-note-editor" onSubmit={(event) => { event.preventDefault(); if (newNote.trim()) setShowNoteEditor(false); }}>
                <label htmlFor="solution-chat-new-note">Write a note</label>
                <textarea id="solution-chat-new-note" value={newNote} onChange={(event) => setNewNote(event.target.value)} placeholder="Capture a thought, prayer, or idea..." rows={3} />
                <button className="solution-chat-primary-action" type="submit" disabled={!newNote.trim()}>Save Note</button>
              </form>
            ) : (
              <button className="solution-chat-primary-action solution-chat-new-note-button" type="button" onClick={() => setShowNoteEditor(true)}>
                <i className="fa-solid fa-plus" aria-hidden="true"></i>
                New Note
              </button>
            )}
          </div>
        ) : (
        <div className="solution-chat-content">
          <div className="solution-chat-welcome">
            <span className="solution-chat-welcome-icon" aria-hidden="true"><i className="fa-solid fa-hands-praying"></i></span>
            <p className="solution-chat-eyebrow">YOU DON’T HAVE TO FIGURE IT OUT ALONE</p>
            <h2>What’s on your heart today?</h2>
            <p>Share what you’re going through. PAZ World is being prepared to offer thoughtful encouragement and Bible references to help you reflect.</p>
          </div>

          <div className="solution-chat-suggestions" aria-label="Example questions">
            {suggestedQuestions.map((prompt) => (
              <button key={prompt} type="button" onClick={() => selectQuestion(prompt)}>
                <i className="fa-solid fa-sparkles" aria-hidden="true"></i>
                <span>{prompt}</span>
                <i className="fa-solid fa-arrow-up-right-from-square solution-chat-suggestion-arrow" aria-hidden="true"></i>
              </button>
            ))}
          </div>

          <form className="solution-chat-composer" onSubmit={handleSubmit}>
            <label htmlFor="solution-chat-question">Your message</label>
            <textarea
              id="solution-chat-question"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                setStatusMessage('');
              }}
              placeholder="Share what’s on your mind..."
              rows={3}
            />
            <div className="solution-chat-composer-footer">
              <span><i className="fa-solid fa-shield-heart" aria-hidden="true"></i> Your conversation deserves care and respect.</span>
              <button type="submit" disabled={!question.trim()} aria-label="Send message">
                <span>Send</span>
                <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
              </button>
            </div>
          </form>
          {statusMessage && <p className="solution-chat-status" role="status">{statusMessage}</p>}

          <p className="solution-chat-disclaimer">PAZ World offers faith-based reflection, not professional medical, mental health, or emergency care.</p>
        </div>
        )}
        </div>
      </section>

      {showInstallHelp && (
        <div className="solution-chat-dialog-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowInstallHelp(false);
        }}>
          <section className="solution-chat-install-dialog" role="dialog" aria-modal="true" aria-labelledby="solution-chat-install-title">
            <button type="button" className="solution-chat-dialog-close" onClick={() => setShowInstallHelp(false)} aria-label="Close install instructions">×</button>
            <span className="solution-chat-install-icon" aria-hidden="true"><img src="/paz-world/PAZZ_icon_transparent_corners.png" alt="" /></span>
            <h2 id="solution-chat-install-title">Install PAZ World</h2>
            <p>{/iphone|ipad|ipod/i.test(navigator.userAgent)
              ? 'Tap the Share button in your browser, then choose “Add to Home Screen.”'
              : 'Open your browser menu and choose “Install PAZ World” or “Add to Home screen.”'}</p>
            <button type="button" className="solution-chat-install-button" onClick={() => setShowInstallHelp(false)}>Got it</button>
          </section>
        </div>
      )}
    </main>
  );
}
