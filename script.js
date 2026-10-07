const memories = [
  // { type: "image", src: "/images/photo-01.jpg", caption: "The beginning of a beautiful journey" },
  // { type: "video", src: "/videos/memory-01.mp4", caption: "A beautiful family moment" },
  // { type: "image", src: "/images/photo-02.jpg", caption: "Years of love and laughter" }
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

function yearsTogether(now) {
  now = now || new Date();
  let years = now.getFullYear() - weddingDate.getFullYear();
  const beforeAnniversary = now.getMonth() < anniversaryMonth ||
    (now.getMonth() === anniversaryMonth && now.getDate() < anniversaryDay);
  if (beforeAnniversary) years--;
  return Math.max(0, years);
}

function updateCounters() {
  const years = yearsTogether();
  document.getElementById("years").textContent = years;
  document.getElementById("months").textContent = years * 12;
  const days = Math.floor((Date.now() - weddingDate.getTime()) / 86400000);
  document.getElementById("days").textContent = Math.max(0, days).toLocaleString();
}

function renderMedia() {
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

  if (item.type === "video") {
    const video = document.createElement("video");
    video.src = item.src;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.addEventListener("ended", function(){ if (playing) next(); });
    stage.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.caption || "A family memory";
    stage.appendChild(img);
  }

  memories.forEach(function(memory, i) {
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
    btn.addEventListener("click", function(){ current = i; renderMedia(); });
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
  if (!memories.length) return;
  playing = !playing;
  playBtn.textContent = playing ? "Ⅱ" : "▶";
  clearInterval(timer);
  if (playing) timer = setInterval(next, 6500);
}

document.getElementById("nextBtn").addEventListener("click", next);
document.getElementById("prevBtn").addEventListener("click", previous);
playBtn.addEventListener("click", togglePlay);
document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") previous();
});

updateCounters();
renderMedia();

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(function(el){ observer.observe(el); });

const hearts = document.querySelector(".hearts");
setInterval(function() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.3 ? "♥" : "✦";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = (8 + Math.random() * 12) + "px";
  heart.style.animationDuration = (7 + Math.random() * 5) + "s";
  hearts.appendChild(heart);
  setTimeout(function(){ heart.remove(); }, 13000);
}, 900);

document.getElementById("soundBtn").addEventListener("click", function() {
  alert("Music is ready to connect. Add your MP3 at public/audio/anniversary.mp3 and connect it in script.js.");
});