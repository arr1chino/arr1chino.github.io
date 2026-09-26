/* ===== 栏目里的几个小挂件 =====
   1) 友情链接（左栏，资料卡下面）：清单在下面的 FRIENDS 里，改那一份就行。
   2) 今日一言（右栏）：进页面自动拉一句「一言」，点卡片再换一句。
   3) 随机音乐（右栏）：进页面随机挑一首，点一下再随机换一首，
      声音走网易云的「外链直连」，播放器本身藏起来，画面上只有自己画的那条进度条。
   定位天气是单独一份（/js/hb-weather.js）。
   找不到对应元素就静静地什么都不做，不会报错。 */
(function () {
  'use strict';

  var QUOTE_API = 'https://v1.hitokoto.cn/?c=d&c=i&c=k&encode=json';

  /* 万一现场没网、或者一言接口抽风，这些句子顶上，
     保证「点一下换一句」永远有反应，不会点半天不动。 */
  var QUOTE_BACKUP = [
    { text: '海是倒过来的天。', from: '' },
    { text: '流水不争先，争的是滔滔不绝。', from: '' },
    { text: '心之所向，素履以往；生如逆旅，一苇以航。', from: '木心' },
    { text: '时间是最好的作者，它总会写出完美的结局。', from: '卓别林' },
    { text: '万物皆有裂痕，那是光照进来的地方。', from: '莱昂纳德·科恩' },
    { text: '要么庸俗，要么孤独。', from: '叔本华' },
    { text: '与其感慨路难行，不如马上出发。', from: '' },
    { text: '我已见过银河，但我只爱一颗星。', from: '' },
    { text: '海到无边天作岸，山登绝顶我为峰。', from: '林则徐' },
    { text: '生活明朗，万物可爱。', from: '' },
    { text: '慢慢来，比较快。', from: '' },
    { text: '愿有岁月可回首，且以深情共白头。', from: '' }
  ];

  /* ============================================================
     ↓↓↓ 友情链接：一行一个，想加谁就照着格式加一行 ↓↓↓
     name = 博客名字（显示在图标后面），url = 网址
     图标是自动抓对方网站的标签页小图标，抓不到就显示名字第一个字。
     ============================================================ */
  var FRIENDS = [
    { name: '创客空间', url: 'https://bistumaker.cn/' },
    { name: '原神 · 官方网站', url: 'https://ys.mihoyo.com/' }
  ];

  /* ============================================================
     随机音乐：进页面随机挑一首，点一下换一首。
     id    = 网易云那首歌的编号（地址栏里 song?id= 后面那串数字）
     c1/c2 = 左边那个小封面用的渐变色，随便改
     ============================================================ */
  var SONGS = [
    { id: '1492276411', name: '璃月 Liyue', artist: '陈致逸 / HOYO-MiX', c1: '#2b5f6e', c2: '#8fd6c9' },
    { id: '1492276420', name: '璃月的晴空', artist: '陈致逸 / HOYO-MiX', c1: '#1d4f7a', c2: '#9fd8f0' },
    { id: '1492276426', name: '杯中明月', artist: '陈致逸 / HOYO-MiX', c1: '#3a3560', c2: '#b3a6e8' },
    { id: '1481390520', name: '星光下的蒙德', artist: '陈致逸 / HOYO-MiX', c1: '#1b3a63', c2: '#8fc7f5' },
    { id: '1481392130', name: '宁静的黄昏', artist: '陈致逸 / HOYO-MiX', c1: '#5c3a2e', c2: '#e8b48f' },
    { id: '1481390662', name: '希望的新一天', artist: '陈致逸 / HOYO-MiX', c1: '#25543f', c2: '#9fdcb0' },
    { id: '2085833516', name: '枫丹 Fontaine', artist: 'HOYO-MiX', c1: '#1f4a6b', c2: '#7fc6e8' },
    { id: '3349675925', name: '月色思念（纯音乐）', artist: '赵海洋', c1: '#22314f', c2: '#a8bfe8' },
    { id: '500730186', name: '航海家 · 海洋历险', artist: '量子', c1: '#16405c', c2: '#6fc0dd' },
    { id: '2067847732', name: '夏日海風', artist: 'DENKI SAMA', c1: '#0f5a6b', c2: '#7fe4d8' },
    { id: '3376802642', name: '海浪与钢琴私语', artist: 'SoftLing', c1: '#12495e', c2: '#8fd8e0' },
    { id: '186315', name: '刀剑如梦', artist: '周华健', c1: '#7f3b2e', c2: '#c96a3e' },
    { id: '1474959445', name: '落山', artist: '陈越龙', c1: '#1d3f5c', c2: '#6fa9c9' },
    { id: '1472480890', name: '群青', artist: 'YOASOBI', c1: '#2b4a3a', c2: '#7fb08a' }
  ];

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ---------- 友情链接 ---------- */
  function buildFriends() {
    var list = document.getElementById('hb-links-list');
    if (!list || !FRIENDS.length) return;

    FRIENDS.forEach(function (item) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'hb-link';
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = item.name;

      var iconBox = document.createElement('span');
      iconBox.className = 'hb-link-icon';

      var letter = document.createElement('span');
      letter.className = 'hb-link-fallback';
      letter.textContent = (item.name || '?').trim().charAt(0);
      iconBox.appendChild(letter);

      var host = '';
      try { host = new URL(item.url).hostname; } catch (e) { host = ''; }
      if (host) {
        var img = document.createElement('img');
        img.alt = '';
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        img.src = 'https://favicon.im/' + host;
        /* 抓不到图标就把那张图藏掉，露出底下的首字母 */
        img.onerror = function () { if (img.parentNode) img.parentNode.removeChild(img); };
        iconBox.appendChild(img);
      }

      var name = document.createElement('span');
      name.className = 'hb-link-name';
      name.textContent = item.name;

      a.appendChild(iconBox);
      a.appendChild(name);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  /* ---------- 随机音乐 ---------- */
  /* 播放地址走网易云的「外链直连」：每次换歌现问一次，拿回来一条带时效的真实音频地址，
     交给藏在这张卡里那个看不见的播放器去放。好处是画面上不会再冒出网易云官方那个
     白框播放器 —— 进度条、时间、播放键全是照卡片的样子自己画的。
     少数歌（会员曲目）拿不到地址，遇到就自动跳下一首；连着几首都放不出来才认输，
     在卡片底下留一个「去网易云听」的出口，不至于点了没反应。 */
  var MUSIC_STREAM = 'https://music.163.com/song/media/outer/url?id=';
  var MUSIC_HINT = '点一下卡片换一首 · 点右边的圆钮播放';

  /* 秒数 → 3:07 这种样子；还没拿到长度就先显示 --:-- */
  function clock(sec) {
    if (!isFinite(sec) || sec < 0) return '--:--';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' + s : s);
  }

  function buildMusic() {
    var card = document.getElementById('hb-music-card');
    var audio = document.getElementById('hb-music-audio');
    var coverEl = document.getElementById('hb-music-cover');
    var nameEl = document.getElementById('hb-music-name');
    var artistEl = document.getElementById('hb-music-artist');
    var toggleEl = document.getElementById('hb-music-toggle');
    var stepEl = document.getElementById('hb-music-step');
    var barEl = document.getElementById('hb-music-bar');
    var fillEl = document.getElementById('hb-music-fill');
    var curEl = document.getElementById('hb-music-cur');
    var durEl = document.getElementById('hb-music-dur');
    if (!card || !nameEl) return;

    var hintEl = card.querySelector('.hb-card-hint');
    var current = null; /* 卡片上正显示的那首 */
    var pending = null; /* 已经交给播放器、还在等回话的那首 */
    var misses = 0; /* 连着几首放不出来 */

    function face(cls) {
      var i = toggleEl && toggleEl.firstElementChild;
      if (i) i.className = 'fas ' + cls;
    }

    function playIt() {
      var p = audio.play();
      /* 浏览器不让自动出声（还没点过页面）时把图标退回去，别装作在放 */
      if (p && p.catch) p.catch(function () { face('fa-play'); });
    }

    function bar(ratio) {
      if (fillEl) fillEl.style.width = Math.max(0, Math.min(1, ratio)) * 100 + '%';
    }

    function times(cur, dur) {
      if (curEl) curEl.textContent = clock(cur);
      if (durEl) durEl.textContent = clock(dur);
    }

    /* 挑一首跟「卡片上这首」「正在取的那首」都不一样的。 */
    function roll() {
      var next = pick(SONGS);
      var guard = 0;
      while (SONGS.length > 1 && guard++ < 12) {
        var sameAsShown = current && next.id === current.id;
        var sameAsWait = pending && next.id === pending.id;
        if (!sameAsShown && !sameAsWait) break;
        next = pick(SONGS);
      }
      return next;
    }

    /* 把一首歌真正画到卡片上（名字 / 封面 / 进度条归零）。 */
    function show(song) {
      current = song;
      if (coverEl) coverEl.style.backgroundImage = 'linear-gradient(135deg,' + song.c1 + ',' + song.c2 + ')';
      if (artistEl) artistEl.textContent = song.artist;
      nameEl.textContent = song.name;
      /* 换歌时名字轻轻跳一下，让人知道「换过了」 */
      nameEl.classList.remove('is-swap');
      void nameEl.offsetWidth;
      nameEl.classList.add('is-swap');

      bar(0);
      times(0, NaN);
      if (hintEl) hintEl.textContent = MUSIC_HINT;
      card.classList.remove('is-miss', 'is-loading');
    }

    /* 把一首歌交给藏在卡里的播放器去取，但先不画到卡片上 ——
       等播放器回话（loadedmetadata）确认这首歌真能放，再改名字和封面。
       会员曲 / 下架曲网易云那边给不出音频，会走进 error 里悄悄再挑下一首；
       因为名字一直没动过，看着就是「点一下 → 直接换成能放的那首」，
       不会有「先闪一个新名字、紧接着又跳走」那种点一次跳两下的感觉。
       等回话的这段时间先让名字淡一点，表示「在取了」。 */
    function feed(song, autoplay) {
      pending = song;
      if (!audio) { pending = null; show(song); return; }
      card.classList.add('is-loading');
      audio.src = MUSIC_STREAM + encodeURIComponent(song.id) + '.mp3';
      audio.load();
      if (autoplay) playIt();
    }

    /* 换一首：点卡片、点骰子、一首放完，都走这里。 */
    function swap(autoplay) { feed(roll(), autoplay); }

    if (!audio) {
      show(roll());
    } else {
      /* 开场先把名字亮出来，卡片不会一直挂着「正在挑歌…」 */
      var opener = roll();
      show(opener);
      feed(opener, false);
    }
    if (!audio) return;

    audio.addEventListener('play', function () { face('fa-pause'); card.classList.add('is-playing'); });
    audio.addEventListener('pause', function () { face('fa-play'); card.classList.remove('is-playing'); });
    audio.addEventListener('loadedmetadata', function () {
      misses = 0;
      /* 取到了：这时候才把名字换过来 */
      if (pending && pending !== current) {
        var ok = pending;
        pending = null;
        show(ok);
      } else {
        pending = null;
        card.classList.remove('is-loading');
      }
      times(audio.currentTime, audio.duration);
    });
    audio.addEventListener('timeupdate', function () {
      times(audio.currentTime, audio.duration);
      bar(audio.duration ? audio.currentTime / audio.duration : 0);
    });
    /* 一首放完接着随机下一首，不用回来点 */
    audio.addEventListener('ended', function () { swap(true); });
    audio.addEventListener('error', function () {
      var failed = pending || current;
      /* 连着几首都取不到就认输，在卡片底下留一个去网易云的出口 */
      if (misses >= 3) {
        pending = null;
        if (failed && failed !== current) show(failed);
        if (hintEl) {
          card.classList.add('is-miss');
          hintEl.innerHTML = '在线播放暂时取不到，<a href="https://music.163.com/#/song?id=' +
            encodeURIComponent(failed ? failed.id : '') + '" target="_blank" rel="noopener">去网易云听</a>';
        }
        return;
      }
      misses++;
      if (hintEl) hintEl.textContent = '这首放不出来，换下一首…';
      feed(roll(), !audio.paused);
    });

    /* 点卡片任意地方 = 换一首；本来就放着的话接着放 */
    card.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('.hb-music-btns, .hb-music-bar')) return;
      swap(!audio.paused);
    });

    if (toggleEl) {
      toggleEl.addEventListener('click', function (e) {
        e.stopPropagation();
        if (audio.paused) playIt();
        else audio.pause();
      });
    }

    if (stepEl) {
      stepEl.addEventListener('click', function (e) {
        e.stopPropagation();
        swap(!audio.paused);
      });
    }

    /* 进度条：点哪儿跳哪儿，按住能拖，选中后用左右方向键也能挪 */
    if (barEl) {
      var dragging = false;

      function seekAt(clientX) {
        if (!audio.duration || !isFinite(audio.duration)) return;
        var r = barEl.getBoundingClientRect();
        if (!r.width) return;
        var ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
        audio.currentTime = ratio * audio.duration;
        bar(ratio);
      }

      barEl.addEventListener('pointerdown', function (e) {
        dragging = true;
        barEl.classList.add('is-live');
        if (barEl.setPointerCapture) barEl.setPointerCapture(e.pointerId);
        seekAt(e.clientX);
        e.stopPropagation();
      });
      barEl.addEventListener('pointermove', function (e) {
        if (dragging) { seekAt(e.clientX); e.stopPropagation(); }
      });
      barEl.addEventListener('pointerup', function (e) { dragging = false; e.stopPropagation(); });
      barEl.addEventListener('pointercancel', function () { dragging = false; });
      barEl.addEventListener('mouseleave', function () { if (!dragging) barEl.classList.remove('is-live'); });
      barEl.addEventListener('keydown', function (e) {
        if (!audio.duration || !isFinite(audio.duration)) return;
        var step = e.shiftKey ? 30 : 5;
        if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + step); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - step); e.preventDefault(); }
      });
    }
  }

  ready(function () {
    buildFriends();
    buildMusic();

    /* ---------- 今日一言 ----------
       上一版是「点一下 → 等接口回话 → 才换字」，接口慢的时候连点好几下
       也只换一句，看着就是坏的。这版改成：按下去立刻换（先用手上的存货或
       本地句子），同时在后台悄悄补货，真句子到了下一次点击就用真的。
       就算现场断网，这张卡也照样点得动、换得了。 */
    var quoteCard = document.getElementById('hb-quote-card');
    var quoteEl = document.getElementById('hb-hitokoto');
    var fromEl = document.getElementById('hb-hitokoto-from');

    var quoteQueue = [];
    var quoteNow = '';
    var quoteRecent = [];
    var quoteFetching = false;

    function paintQuote(text, from) {
      quoteNow = text;
      if (quoteEl) quoteEl.textContent = text;
      if (fromEl) fromEl.textContent = from ? '—— ' + from : '—— 一言';
      if (quoteEl) {
        /* 去掉再加，动画才能被反复触发 */
        quoteEl.classList.remove('is-swap');
        void quoteEl.offsetWidth;
        quoteEl.classList.add('is-swap');
      }
    }

    function refillQuote() {
      if (quoteFetching || quoteQueue.length >= 2) return;
      quoteFetching = true;

      var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 4000);

      fetch(QUOTE_API, { cache: 'no-store', signal: ctl ? ctl.signal : undefined })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || !data.hitokoto) throw new Error('empty');
          if (data.hitokoto !== quoteNow) {
            quoteQueue.push({ text: data.hitokoto, from: data.from_who || data.from || '' });
          }
        })
        .catch(function () { /* 拉不到就算了，本地句子兜着 */ })
        .then(function () {
          clearTimeout(timer);
          quoteFetching = false;
        });
    }

    function localQuote() {
      /* 最近说过的那几句先避开，免得连着点两下又撞回同一句 */
      var pool = QUOTE_BACKUP.filter(function (it) {
        return quoteRecent.indexOf(it.text) === -1;
      });
      if (!pool.length) pool = QUOTE_BACKUP.filter(function (it) { return it.text !== quoteNow; });
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function nextQuote() {
      var item = quoteQueue.shift() || localQuote();
      paintQuote(item.text, item.from);
      quoteRecent.push(item.text);
      if (quoteRecent.length > 4) quoteRecent.shift();
      refillQuote();
    }

    if (quoteCard && quoteEl) {
      quoteEl.classList.add('is-swap');
      quoteCard.addEventListener('click', nextQuote);
      refillQuote();
      setTimeout(nextQuote, 600);
    }
  });
})();
