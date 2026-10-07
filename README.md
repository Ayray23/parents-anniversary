# Adebisi — Wedding Anniversary ❤️

A cinematic, mobile-friendly anniversary website for Mum & Dad, celebrating **21 years of marriage** on **8 October 2026**.

## Add photos and videos

Put photos in `public/images/` and MP4 videos in `public/videos/`.

Then edit the `memories` array at the top of `script.js`:

```js
const memories = [
  { type: "image", src: "/images/photo-01.jpg", caption: "The beginning of a beautiful journey" },
  { type: "video", src: "/videos/memory-01.mp4", caption: "A beautiful family moment" }
];
```

The gallery automatically handles navigation, thumbnails, video controls, autoplay and mobile layouts.

## Optional music

Place your song at `public/audio/anniversary.mp3`. The music button is already present and can be connected in `script.js`.

## Run locally

This is a static website. Open `index.html` directly or use VS Code Live Server.

## GitHub Pages

The site is designed for static GitHub Pages hosting. Enable Pages in the repository's **Settings → Pages**, using the `main` branch.

Made with love for the Adebisi family.
