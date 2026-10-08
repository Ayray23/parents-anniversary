const memories = [
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185341.jpg", caption: "The beginning" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185720.jpg", caption: "The beginning" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_190103.jpg", caption: "Happy anniversary, Mum & Dad" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_190034.jpg", caption: "The love that keeps growing" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185753.jpg", caption: "Years of love and warmth" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185807.jpg", caption: "Moments that made home" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185822.jpg", caption: "Smiles that tell the story" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185838.jpg", caption: "A lifetime of love" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185854.jpg", caption: "Together in every season" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185909.jpg", caption: "More love, more laughter" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185925.jpg", caption: "A story worth celebrating" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185940.jpg", caption: "The joy of family" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_185954.jpg", caption: "Forever in our hearts" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_190012.jpg", caption: "A beautiful life together" },
  { type: "image", src: "./public/images/optimized/SAVE_20251007_190051.jpg", caption: "Always hand in hand" }
];

const weddingDate = new Date("2005-10-08T00:00:00");
const anniversaryMonth = 9;
const anniversaryDay = 8;
let current = 0;
let playing = false;
let timer = null;

const stage = document.getElementById("mediaStage");
const thumbs = document.getElementById("thumbs");
const caption = document.getElementById("slideCaption");
const indexEl = document.getElementById("slideIndex");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const soundBtn = document.getElementById("soundBtn");

function yearsTogether(now) {
  now = now || new Date();
  let years = now.getFullYear() - weddingDate.getFullYear();
  const beforeAnniversary = now.getMonth() < anniversaryMonth ||
    (now.getMonth() === anniversaryMonth && now.getDate() < anniversaryDay);

  if (beforeAnniversary) years--;
  return Math.max(0, years);
}

function updateCounters() {
  const yearsEl = document.getElementById("years");
  const monthsEl = document.getElementById("months");
  const daysEl = document.getElementById("days");

  if (!yearsEl || !monthsEl || !daysEl) return;

  const years = yearsTogether();
  yearsEl.textContent = years;
  monthsEl.textContent = years * 12;

  const days = Math.floor((Date.now() - weddingDate.getTime()) / 86400000);
  daysEl.textContent = Math.max(0, days).toLocaleString();
}

function renderMedia() {
  if (!stage || !thumbs || !caption || !indexEl || !playBtn) {
    console.warn("Gallery markup is missing. Skipping slideshow setup.");
    return;
  }

  stage.innerHTML = "";
  thumbs.innerHTML = "";

  if (!memories.length) {
    stage.innerHTML = '<div class="empty-media"><div><div class="placeholder-heart">♥</div><h3>Your memories belong here.</h3><p>Add photos and videos to the memories list in <strong>script.js</strong>. The slideshow is already ready for them.</p></div></div>';
    caption.textContent = "Your memory gallery is ready.";
    indexEl.textContent = "01";
    playBtn.style.display = "none";
    return;
  }

  playBtn.style.display = "block";
  const item = memories[current];
  indexEl.textContent = String(current + 1).padStart(2, "0");
  caption.textContent = item.caption || "A beautiful memory";

  const media = item.type === "video" ? document.createElement("video") : document.createElement("img");
  media.classList.add("slide-media");

  if (item.type === "video") {
    media.src = item.src;
    media.controls = true;
    media.playsInline = true;
    media.preload = "metadata";
    media.addEventListener("ended", function () {
      if (playing) next();
    });
  } else {
    media.src = item.src;
    media.alt = item.caption || "A family memory";
  }

  stage.appendChild(media);

  memories.forEach(function (memory, i) {
    const btn = document.createElement("button");
    btn.className = "thumb" + (i === current ? " active" : "");
    btn.setAttribute("aria-label", "Open memory " + (i + 1));

    if (memory.type === "image") {
      const img = document.createElement("img");
      img.src = memory.src;
      img.alt = "";
      btn.appendChild(img);
    } else {
      btn.textContent = "▶";
    }

    btn.addEventListener("click", function () {
      current = i;
      renderMedia();
    });

    thumbs.appendChild(btn);
  });
}

function next() {
  if (!memories.length) return;
  current = (current + 1) % memories.length;
  renderMedia();
}

function previous() {
  if (!memories.length) return;
  current = (current - 1 + memories.length) % memories.length;
  renderMedia();
}

function togglePlay() {
  if (!memories.length || !playBtn) return;
  playing = !playing;
  playBtn.textContent = playing ? "Ⅱ" : "▶";
  clearInterval(timer);

  if (playing) {
    timer = setInterval(next, 6500);
  }
}

function initGallery() {
  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", previous);
  if (playBtn) playBtn.addEventListener("click", togglePlay);

  let touchStartX = 0;
  let touchEndX = 0;

  if (stage) {
    stage.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    stage.addEventListener("touchend", function (event) {
      touchEndX = event.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;

      if (Math.abs(delta) < 40) return;
      if (delta < 0) next();
      else previous();
    }, { passive: true });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") previous();
  });

  updateCounters();
  renderMedia();
}

function initLetterEffects() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
}

function initHearts() {
  const hearts = document.querySelector(".hearts");
  if (!hearts) return;

  setInterval(function () {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = Math.random() > 0.3 ? "♥" : "✦";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (8 + Math.random() * 12) + "px";
    heart.style.animationDuration = (7 + Math.random() * 5) + "s";
    hearts.appendChild(heart);
    setTimeout(function () {
      heart.remove();
    }, 13000);
  }, 900);
}

function spawnLoveBurst(event) {
  const burstColors = ["#ffd7e1", "#ffc5d9", "#f7c8ff", "#ffeb9c", "#f7a8b8", "#d7c8ff"]; 
  const burstCount = 18;
  const heartChar = ["♥", "♡", "✦"];

  for (let i = 0; i < burstCount; i += 1) {
    const burst = document.createElement("span");
    burst.className = "click-heart";
    burst.textContent = heartChar[Math.floor(Math.random() * heartChar.length)];
    burst.style.left = event.clientX + "px";
    burst.style.top = event.clientY + "px";
    burst.style.color = burstColors[Math.floor(Math.random() * burstColors.length)];
    burst.style.fontSize = (18 + Math.random() * 28) + "px";
    burst.style.setProperty("--x", (Math.random() * 160 - 80) + "px");
    burst.style.setProperty("--y", (Math.random() * 120 - 60) + "px");
    document.body.appendChild(burst);

    setTimeout(function () {
      burst.remove();
    }, 950);
  }

  for (let i = 0; i < 10; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = event.clientX + "px";
    sparkle.style.top = event.clientY + "px";
    sparkle.style.setProperty("--dx", (Math.random() * 90 - 45) + "px");
    sparkle.style.setProperty("--dy", (Math.random() * 70 - 35) + "px");
    document.body.appendChild(sparkle);

    setTimeout(function () {
      sparkle.remove();
    }, 800);
  }
}

function initMusic() {
  if (!soundBtn) return;

  const song = "public/audio/Tiwa_Savage_-_Ife_Wa_Gbona_Ft_Leo_Wonder.mp3";
  const audio = new Audio(song);
  audio.loop = true;
  audio.volume = 0.5;

  function syncMusicButton() {
    const isPlaying = !audio.paused;
    soundBtn.classList.toggle("is-playing", isPlaying);
    soundBtn.setAttribute("aria-pressed", String(isPlaying));
  }

  function playAudio() {
    if (audio.paused) {
      audio.play().then(function () {
        syncMusicButton();
      }).catch(function () {
        console.warn("Audio playback was blocked until a later user interaction.");
      });
    }
  }

  function toggleAudio() {
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
      syncMusicButton();
    }
  }

  soundBtn.innerHTML = '<span class="sound-icon">♪</span><span class="sound-text">Music</span>';
  syncMusicButton();
  soundBtn.addEventListener("click", toggleAudio);
  document.addEventListener("pointerdown", playAudio, { once: true });
  document.addEventListener("keydown", playAudio, { once: true });
}

function init() {
  updateCounters();
  initGallery();
  initLetterEffects();
  initHearts();
  document.addEventListener("click", spawnLoveBurst);
  initMusic();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}