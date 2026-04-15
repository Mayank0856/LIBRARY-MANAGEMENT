/**
 * downloadBooks.js (v3 — Internet Archive direct PDF links)
 *
 * Uses Internet Archive (archive.org) which provides:
 *  - Direct PDF downloads of public domain books (no login, no block)
 *  - Official NCERT textbooks
 *
 * Run: node backend/src/scripts/downloadBooks.js
 */
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const OUT_DIR = path.join(__dirname, '../../static/books');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Internet Archive PDF URL: https://archive.org/download/{id}/{id}.pdf
const IA = (id, file) =>
  `https://archive.org/download/${id}/${file || id + '.pdf'}`;

const BOOKS = [
  // ── Public Domain Classics via Internet Archive ───────────────────────────
  {
    file:  'alice-in-wonderland.pdf',
    url:   IA('alicesadventures00carriala', 'alicesadventures00carriala.pdf'),
    title: "Alice's Adventures in Wonderland",
  },
  {
    file:  'treasure-island.pdf',
    url:   IA('treasureisland00stevuoft', 'treasureisland00stevuoft.pdf'),
    title: 'Treasure Island',
  },
  {
    file:  'sherlock-holmes.pdf',
    url:   IA('adventuresofsher00doyl', 'adventuresofsher00doyl.pdf'),
    title: 'The Adventures of Sherlock Holmes',
  },
  {
    file:  'tom-sawyer.pdf',
    url:   IA('adventuresoftoms00twaiiala', 'adventuresoftoms00twaiiala.pdf'),
    title: 'The Adventures of Tom Sawyer',
  },
  {
    file:  'oliver-twist.pdf',
    url:   IA('olivertwist00dick_0', 'olivertwist00dick_0.pdf'),
    title: 'Oliver Twist',
  },
  {
    file:  'great-expectations.pdf',
    url:   IA('greatexpectation00dickuoft', 'greatexpectation00dickuoft.pdf'),
    title: 'Great Expectations',
  },
  {
    file:  'pride-and-prejudice.pdf',
    url:   IA('prideandprejudic00aust_0', 'prideandprejudic00aust_0.pdf'),
    title: 'Pride and Prejudice',
  },
  {
    file:  'frankenstein.pdf',
    url:   IA('frankensteinorro00shell', 'frankensteinorro00shell.pdf'),
    title: 'Frankenstein',
  },
  {
    file:  'dracula.pdf',
    url:   IA('draculabramstoke00bram', 'draculabramstoke00bram.pdf'),
    title: 'Dracula',
  },
  {
    file:  'romeo-and-juliet.pdf',
    url:   IA('romeoandjuliet00shak_1', 'romeoandjuliet00shak_1.pdf'),
    title: 'Romeo and Juliet',
  },
  {
    file:  'hamlet.pdf',
    url:   IA('hamlet00shak_2', 'hamlet00shak_2.pdf'),
    title: 'Hamlet',
  },
  {
    file:  'jungle-book.pdf',
    url:   IA('junglebook00kipl_0', 'junglebook00kipl_0.pdf'),
    title: 'The Jungle Book',
  },
  {
    file:  'little-women.pdf',
    url:   IA('littlewomen00alco_0', 'littlewomen00alco_0.pdf'),
    title: 'Little Women',
  },
  {
    file:  'huckleberry-finn.pdf',
    url:   IA('adventuresofhuck1884twai', 'adventuresofhuck1884twai.pdf'),
    title: 'Adventures of Huckleberry Finn',
  },
  {
    file:  'secret-garden.pdf',
    url:   IA('secretgarden00burn_0', 'secretgarden00burn_0.pdf'),
    title: 'The Secret Garden',
  },
  {
    file:  'moby-dick.pdf',
    url:   IA('mobydickorwhale00melviala', 'mobydickorwhale00melviala.pdf'),
    title: 'Moby Dick',
  },
  {
    file:  'arabian-nights.pdf',
    url:   IA('arabiannightsent00lang', 'arabiannightsent00lang.pdf'),
    title: 'Arabian Nights',
  },
  {
    file:  'gulliver-travels.pdf',
    url:   IA('gulliverstravels00swif_0', 'gulliverstravels00swif_0.pdf'),
    title: "Gulliver's Travels",
  },
  {
    file:  'twenty-thousand-leagues.pdf',
    url:   IA('twentythousandlea00vern_1', 'twentythousandlea00vern_1.pdf'),
    title: 'Twenty Thousand Leagues Under the Sea',
  },
  {
    file:  'count-of-monte-cristo.pdf',
    url:   IA('countofmontecristo00duma', 'countofmontecristo00duma.pdf'),
    title: 'The Count of Monte Cristo',
  },

  // ── NCERT Official PDFs ───────────────────────────────────────────────────
  {
    file:  'ncert-first-flight-class10.pdf',
    url:   'https://ncert.nic.in/textbook/pdf/jfl101.pdf',
    title: 'First Flight Ch.1 (Class 10 English)',
  },
  {
    file:  'ncert-math-class10.pdf',
    url:   'https://ncert.nic.in/textbook/pdf/jemh101.pdf',
    title: 'Mathematics Ch.1 (Class 10)',
  },
  {
    file:  'ncert-science-class10.pdf',
    url:   'https://ncert.nic.in/textbook/pdf/jesc101.pdf',
    title: 'Science Ch.1 (Class 10)',
  },
  {
    file:  'ncert-beehive-class9.pdf',
    url:   'https://ncert.nic.in/textbook/pdf/ieel101.pdf',
    title: 'Beehive Ch.1 (Class 9 English)',
  },
  {
    file:  'ncert-marigold-class1.pdf',
    url:   'https://ncert.nic.in/textbook/pdf/aeal1dd.pdf',
    title: 'Marigold (Class 1 English)',
  },
];

// ─── Downloader ───────────────────────────────────────────────────────────────
function download(urlStr, destPath, title, hops = 0) {
  return new Promise((resolve) => {
    if (hops > 10) { console.log(`  ❌ TOO MANY REDIRECTS – ${title}`); resolve({ ok: false, title }); return; }
    if (fs.existsSync(destPath)) {
      const kb = Math.round(fs.statSync(destPath).size / 1024);
      console.log(`  ✅ SKIP  [${kb} KB already] – ${title}`);
      resolve({ ok: true, skipped: true, title });
      return;
    }

    const tmp   = destPath + '.tmp';
    const file  = fs.createWriteStream(tmp);
    const proto = urlStr.startsWith('https') ? https : http;

    const req = proto.get(urlStr, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/pdf,*/*',
      },
    }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        file.close(); fs.unlink(tmp, () => {});
        const next = res.headers.location;
        if (!next) { resolve({ ok: false, title }); return; }
        console.log(`  ↪ ${hops + 1} redirect(s) – ${title}`);
        resolve(download(next, destPath, title, hops + 1));
        return;
      }
      if (res.statusCode !== 200) {
        file.close(); fs.unlink(tmp, () => {});
        console.log(`  ❌ HTTP ${res.statusCode} – ${title}`);
        resolve({ ok: false, title });
        return;
      }
      let bytes = 0;
      res.on('data', (chunk) => { bytes += chunk.length; });
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          fs.renameSync(tmp, destPath);
          const kb = Math.round(bytes / 1024);
          console.log(`  ✅ OK   [${kb} KB] – ${title}`);
          resolve({ ok: true, title });
        });
      });
    });

    req.on('error', (err) => {
      file.close(); fs.unlink(tmp, () => {});
      console.log(`  ❌ ERROR – ${title}: ${err.message}`);
      resolve({ ok: false, title });
    });

    req.setTimeout(45000, () => {
      req.destroy();
      file.close(); fs.unlink(tmp, () => {});
      console.log(`  ❌ TIMEOUT (45s) – ${title}`);
      resolve({ ok: false, title });
    });
  });
}

async function main() {
  console.log('\n📚 Library PDF Downloader v3 (Internet Archive)');
  console.log(`📁 Output: ${OUT_DIR}`);
  console.log(`📖 ${BOOKS.length} books\n`);

  const results = [];
  for (const b of BOOKS) {
    results.push(await download(b.url, path.join(OUT_DIR, b.file), b.title));
  }

  const ok     = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok);
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ ${ok} / ${BOOKS.length} books ready`);
  if (failed.length) {
    console.log(`❌ Failed (${failed.length}):`);
    failed.forEach(r => console.log(`   • ${r.title}`));
  }
  console.log('\n✅ Done! Now reseed the DB:');
  console.log('   node backend/src/seeders/real_books_seeder.js\n');
}

main();
