<template>
  <div class="page">
    <video ref="videoRef" class="video-bg" src="/assets/seeker-splash.mp4" autoplay loop muted playsinline preload="auto" aria-hidden="true" @timeupdate="syncFrame"></video>
    <div class="bottom-fade"></div>

    <!-- Desktop card fans — decorative, behind hero content -->
    <div class="cards-fan cards-fan-left">
      <div v-for="(card, i) in leftCards" :key="card.meme" class="fan-card" :class="'fan-left-' + i">
        <GibCard :meme="card.meme" :image="card.image" :power="card.power" :change="card.change" />
      </div>
    </div>
    <div class="cards-fan cards-fan-right">
      <div v-for="(card, i) in rightCards" :key="card.meme" class="fan-card" :class="'fan-right-' + i">
        <GibCard :meme="card.meme" :image="card.image" :power="card.power" :change="card.change" />
      </div>
    </div>

    <div class="hero-content">

      <div class="title-area">

        <!-- Frame 1: MEMECOIN TRADING CARD GAME -->
        <div
          class="frame frame-1"
          :class="{ exiting: currentFrame !== 0 }"
        >
          <div class="title-main-wrap">
            <div class="title-main">MEMECOIN<br>TRADING CARD</div>
          </div>
          <div class="title-game-wrap">
            <div class="title-game"><span class="luckiest-nudge">GAME</span></div>
          </div>
        </div>

        <!-- Frame 2: BUILD DECKS TO BATTLE -->
        <div
          class="frame frame-2 frame-abs"
          :class="{ active: currentFrame === 1 }"
        >
          <div class="title-build">BUILD DECKS</div>
          <div class="title-battle-scene">
            <img class="sword sword-left" src="/assets/sword-left.png" alt="" aria-hidden="true">
            <div class="title-battle-box"><span class="luckiest-nudge">TO BATTLE</span></div>
            <img class="sword sword-right" src="/assets/sword-right.png" alt="" aria-hidden="true">
          </div>
        </div>

        <!-- Frame 3: CARD POWER FOLLOWS THE MARKET -->
        <div
          class="frame frame-3 frame-abs"
          :class="{ active: currentFrame === 2 }"
        >
          <div class="title-card-follows"><span class="luckiest-nudge">CARD POWER FOLLOWS</span></div>
          <div class="title-market-scene">
            <img class="market-arrow arrow-down" src="/assets/arrow-down.png" alt="" aria-hidden="true">
            <div class="title-market">THE MARKET</div>
            <img class="market-arrow arrow-up" src="/assets/arrow-up.png" alt="" aria-hidden="true">
          </div>
        </div>

        <!-- Frame 4: WIN REAL REWARDS -->
        <div
          class="frame frame-4 frame-abs"
          :class="{ active: currentFrame === 3 }"
        >
          <div class="win-row">
            <img class="sol-coin coin-1" src="/assets/solcoin1.png" alt="" aria-hidden="true">
            <img class="sol-coin coin-2" src="/assets/solcoin2.png" alt="" aria-hidden="true">
            <div class="win-explosion-wrap">
              <img class="explosion-img" src="/assets/explosion.png" alt="" aria-hidden="true">
              <span class="win-text">WIN</span>
            </div>
            <img class="sol-coin coin-3" src="/assets/solcoin3.png" alt="" aria-hidden="true">
            <img class="sol-coin coin-4" src="/assets/solcoin4.png" alt="" aria-hidden="true">
          </div>
          <div class="title-real-rewards">REAL REWARDS</div>
        </div>

      </div>

      <div class="stats-row">
        <div class="stat">
          <div class="stat-num" ref="stat1"><span class="stat-symbol">$</span>100K</div>
          <div class="stat-label">Prize Pool</div>
        </div>
        <div class="stats-dot"></div>
        <div class="stat">
          <div class="stat-num" ref="stat2">60K<span class="stat-symbol-suffix">+</span></div>
          <div class="stat-label">Cards</div>
        </div>
      </div>

      <a href="https://gib.meme/" class="btn-play">Play Now</a>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GibCard from './components/GibCard.vue'

const currentFrame = ref(0)
const stat1 = ref(null)
const stat2 = ref(null)
const videoRef = ref(null)
const FRAME_COUNT = 4

const leftCards = [
  { meme: 'BONK', image: '/assets/cards/BONK.png', power: 0.041, change: 0.12 },
  { meme: 'BITCOIN', image: '/assets/cards/BITCOIN.png', power: 0.069, change: 0.05 },
  { meme: 'WIF', image: '/assets/cards/WIF.jpg', power: 0.038, change: -0.08 },
]

const rightCards = [
  { meme: 'FWOG', image: '/assets/cards/FWOG.jpg', power: 0.057, change: 0.07 },
  { meme: 'TRUMP', image: '/assets/cards/TRUMP.png', power: 0.095, change: 0.33 },
  { meme: 'MOODENG', image: '/assets/cards/MOODENG.png', power: 0.022, change: 0.18 },
]

function syncFrame() {
  const video = videoRef.value
  if (!video || !video.duration) return
  const frameDuration = video.duration / FRAME_COUNT
  const frame = Math.floor(video.currentTime / frameDuration) % FRAME_COUNT
  currentFrame.value = frame
}

onMounted(() => {
  // Reset video to start on every page load/refresh
  const video = videoRef.value
  if (video) {
    video.currentTime = 0
    // Force load + play — handles mobile browsers that block autoplay
    video.load()
    const tryPlay = () => {
      video.play().catch(() => {
        // Some mobile browsers need a user gesture — retry on first touch
        const onTouch = () => {
          video.play()
          document.removeEventListener('touchstart', onTouch)
          document.removeEventListener('click', onTouch)
        }
        document.addEventListener('touchstart', onTouch, { once: true })
        document.addEventListener('click', onTouch, { once: true })
      })
    }
    if (video.readyState >= 2) {
      tryPlay()
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true })
    }
  }

  // Count-up animations
  animateStat(stat1.value, 100, '$', 'K', '')
  animateStat(stat2.value, 60, '', 'K', '+')
})

function animateStat(el, target, prefix, suffix, extra) {
  const duration = 1600
  const start = performance.now()
  const prefixHtml = prefix ? `<span class="stat-symbol">${prefix}</span>` : ''
  const extraHtml = extra ? `<span class="stat-symbol-suffix">${extra}</span>` : ''

  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1)
    const val = Math.round((1 - Math.pow(1 - p, 3)) * target)
    el.innerHTML = prefixHtml + val + suffix + extraHtml
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
</script>

<style scoped>
.page {
  position: relative;
  width: 100%;
  height: 100dvh;        /* dynamic viewport — respects mobile address bar */
  height: 100vh;         /* fallback for older browsers */
  overflow: hidden;      /* no scrollbars, ever */
  box-sizing: border-box;
}

@supports (height: 100dvh) {
  .page { height: 100dvh; }
}

/* ── FROG / VIDEO BACKGROUND ── */
.video-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  z-index: 0;
  pointer-events: none;
}

/* Dark gradient rising from bottom */
.bottom-fade {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 72%;
  background: linear-gradient(to top,
    rgba(4, 22, 26, 1.0)   0%,
    rgba(4, 22, 26, 0.92) 25%,
    rgba(4, 22, 26, 0.65) 55%,
    transparent 100%
  );
  z-index: 1;
  pointer-events: none;
}

/* ── CONTENT — full-height flex, content pushed to bottom ── */
.hero-content {
  position: absolute;
  top: 0; bottom: 0;
  left: 0; right: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px calc(16px + env(safe-area-inset-bottom, 0px));
  gap: 4px;
}

/* ── LuckiestGuy optical centering nudge ── */
/* LuckiestGuy has ~0.2em of dead space above the cap height.
   Flex centers the em box, not the visual glyph — nudge down. */
.luckiest-nudge {
  position: relative;
  top: 0.12em;
}

/* ── MEMECOIN / TRADING CARD ── */
.title-main-wrap {
  position: relative;
  padding: 4px 4px 2px;
}


.title-main {
  position: relative;
  z-index: 1;
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(10.5vw, 7vh);
  line-height: 1.15;
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;
}

/* ── "GAME" on rotated purple rectangle ── */
.title-game-wrap {
  display: flex;
  justify-content: center;
  margin-top: 0px;
  margin-bottom: 4px;
}

.title-game {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #9b72f5;
  padding: 6px 29px;
  border-radius: 7px;
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(6vw, 4.2vh);
  line-height: 1;
  letter-spacing: 2px;
  color: #fff;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
  animation: wiggle 5s ease-in-out infinite;
}

@keyframes wiggle {
  0%   { transform: rotate(-3deg); }
  50%  { transform: rotate(2.5deg); }
  100% { transform: rotate(-3deg); }
}

/* ── TITLE AREA — multi-frame switcher ── */
.title-area {
  position: relative;
  width: 100%;
}

.frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: opacity 0.55s ease, transform 0.55s ease;
}

/* Frame 1 is in normal flow — its height drives the title-area */
.frame-1 {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.frame-1.exiting {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
}

/* Frames 2+ layer on top, absolutely positioned */
.frame-abs {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
}
.frame-abs.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

/* ── FRAME 2: BUILD DECKS TO BATTLE ── */
.title-build {
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(10.5vw, 7vh);
  /* KEEP line-height >= 1.1 */
  line-height: 1.15;
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;
}

.frame-2 { gap: 0; }
.frame-2 .title-battle-scene { margin-top: -20px; }

.title-battle-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 6px;
  overflow: visible;
}

.title-battle-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #c1f283;
  padding: 7px 22px;
  border-radius: 6px;
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(8.5vw, 5.5vh);
  line-height: 1;
  letter-spacing: 2px;
  color: #000000;
  white-space: nowrap;
  transform: rotate(1.3deg);
  box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
  text-shadow: 2px 2px 0 rgba(0, 80, 0, 0.45);
  animation: wiggle 5s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

/* ── SWORDS ── */
.sword {
  width: min(22vw, 14.5vh);
  display: block;
  flex-shrink: 0;
}

.sword-left {
  translate: 0 0;
  transition: translate 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s;
}
.sword-right {
  translate: 0 0;
  transition: translate 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s;
}

.frame-2:not(.active) .sword-left {
  translate: -120vw 0;
  transition: translate 0s;
}
.frame-2:not(.active) .sword-right {
  translate: 120vw 0;
  transition: translate 0s;
}

/* ── FRAME 3: CARD POWER FOLLOWS THE MARKET ── */
.frame-3 { gap: 12px; }

.title-card-follows {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #977efb;
  border-radius: 6px;
  padding: 6px 24px;
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(6.5vw, 4.5vh);
  line-height: 1;
  letter-spacing: 2px;
  color: #fff;
  box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
  text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
  animation: wiggle 5s ease-in-out infinite;
}

.title-market-scene {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  gap: 8px;
  overflow: visible;
}

.title-market {
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(10.5vw, 7vh);
  /* KEEP line-height >= 1.1 */
  line-height: 1.15;
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;
  white-space: nowrap;
}

/* ── MARKET ARROWS ── */
.market-arrow {
  width: min(16vw, 11vh);
  display: block;
}

.arrow-down {
  justify-self: end;
  translate: 0 0;
  transition: translate 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s;
  animation: arrow-bob-down 2.4s ease-in-out infinite;
}
.arrow-up {
  justify-self: start;
  translate: 0 0;
  transition: translate 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s;
  animation: arrow-bob-up 2.4s ease-in-out infinite;
}

.frame-3:not(.active) .arrow-down {
  translate: -120vw 0;
  transition: translate 0s;
}
.frame-3:not(.active) .arrow-up {
  translate: 120vw 0;
  transition: translate 0s;
}

@keyframes arrow-bob-down {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(8px); }
}
@keyframes arrow-bob-up {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

/* ── FRAME 4: WIN REAL REWARDS ── */
.win-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 6px;
  overflow: visible;
}

.coin-1, .coin-4 { width: min(17vw, 11vh); }
.coin-2, .coin-3 { width: min(11vw,  7vh); }

.sol-coin { display: block; flex-shrink: 0; }

.win-explosion-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: win-jump 1.6s ease-in-out infinite;
}

@keyframes win-jump {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}

.explosion-img {
  width: min(28vw, 18vh);
  display: block;
  animation: explosion-rock 2.2s ease-in-out infinite;
}

@keyframes explosion-rock {
  0%, 100% { transform: rotate(-14deg); }
  50%       { transform: rotate(14deg); }
}

.win-text {
  position: absolute;
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(6.3vw, 4.2vh);
  /* KEEP line-height >= 1.1 */
  line-height: 1.15;
  color: #977efb;
  text-shadow: 0px 2px 6px rgba(0,0,0,0.2);
  letter-spacing: 1px;
}

.title-real-rewards {
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(10.5vw, 7vh);
  /* KEEP line-height >= 1.1 */
  line-height: 1.15;
  letter-spacing: 1px;
  text-align: center;
  white-space: nowrap;
  background:
    linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%) -200% 0 / 50% 100% no-repeat,
    linear-gradient(160deg, #00F5FF 0%, #b29bf4 55%, #FE8CFA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: title-shine 3.5s ease-in-out infinite;
}

/* Coin bob — staggered phases */
@keyframes coin-bob {
  0%, 100% { transform: translateY(0);    }
  50%       { transform: translateY(-7px); }
}
.coin-1 { animation: coin-bob 2.2s ease-in-out infinite 0s;    }
.coin-2 { animation: coin-bob 2.2s ease-in-out infinite 0.55s; }
.coin-3 { animation: coin-bob 2.2s ease-in-out infinite 1.1s;  }
.coin-4 { animation: coin-bob 2.2s ease-in-out infinite 1.65s; }

/* ── STATS ── */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 4px;
}

.stat {
  flex: 1;
  text-align: center;
}

.stat-num {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: min(4.5vw, 3vh);
  line-height: 1;
  letter-spacing: -1px;
  color: #fff;
}

.stat-symbol {
  font-size: 0.5em;
  color: rgba(255,255,255,0.45);
  display: inline-block;
  transform: rotate(-10deg);
  position: relative;
  top: -0.15em;
  margin-right: 1px;
}

.stat-symbol-suffix {
  font-size: 0.5em;
  color: rgba(255,255,255,0.45);
  display: inline-block;
  transform: rotate(10deg);
  position: relative;
  top: -0.15em;
  margin-left: 1px;
}

.stat-label {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: 3px;
}

.stats-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  flex-shrink: 0;
  margin: 0 8px;
  margin-bottom: 18px;
}

/* ── PLAY NOW ── */
.btn-play {
  display: block;
  width: 100%;
  background: #2dd632;
  color: #000;
  font-family: 'LuckiestGuy', sans-serif;
  font-weight: 400;
  font-size: 19px;
  letter-spacing: 0.5px;
  text-align: center;
  text-decoration: none;
  padding: 18px;
  border-radius: 50px;
  border: 2.5px solid #101010;
  box-shadow: 0 5px 0 #000, 3px 8px 0 rgba(0,0,0,0.35);
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-play:active {
  transform: translateY(5px);
  box-shadow: none;
}

.btn-play::after {
  content: '';
  position: absolute;
  top: 0; left: -75%;
  width: 50%; height: 100%;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
  transform: skewX(-20deg);
  animation: shine 2.8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shine {
  0%   { left: -75%; opacity: 1; }
  50%  { left: 125%; opacity: 1; }
  51%  { opacity: 0; }
  100% { left: 125%; opacity: 0; }
}

/* ── CARD FANS — hidden on mobile ── */
.cards-fan {
  display: none;
}

/* ── DESKTOP OVERRIDES ── */
@media (min-width: 768px) {
  .stat-num { font-size: min(2.5vw, 4.5vh); }
  .stats-row { justify-content: center; gap: 32px; }
  .stat { flex: 0 0 auto; }
  .stats-dot { margin: 0 0 18px; }
  .btn-play { width: 35%; margin-left: auto; margin-right: auto; margin-top: 20px; padding: 13px; }

  /* Card fans — all cards share one anchor point per corner */
  .cards-fan {
    display: block;
    position: fixed;
    bottom: -4vh;
    z-index: 2;
    pointer-events: none;
  }
  .cards-fan-left { left: 4vw; }
  .cards-fan-right { right: 4vw; }

  .fan-card {
    position: absolute;
    width: clamp(130px, 12vw, 200px);
  }

  /* Left fan — all cards pivot from their bottom-left corner */
  .cards-fan-left .fan-card {
    bottom: 0;
    left: 0;
    transform-origin: 0% 100%;
  }
  .fan-left-0 { transform: rotate(-28deg); z-index: 1; }
  .fan-left-1 { transform: rotate(-14deg); z-index: 2; }
  .fan-left-2 { transform: rotate(2deg);   z-index: 3; }

  /* Right fan — all cards pivot from their bottom-right corner */
  .cards-fan-right .fan-card {
    bottom: 0;
    right: 0;
    transform-origin: 100% 100%;
  }
  .fan-right-0 { transform: rotate(-2deg);  z-index: 3; }
  .fan-right-1 { transform: rotate(14deg);  z-index: 2; }
  .fan-right-2 { transform: rotate(28deg);  z-index: 1; }

  .hero-content { z-index: 3; }
}
</style>

<style>
/* Global reset — prevents body margin from causing scrollbars */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: #04161a;
}
*, *::before, *::after {
  box-sizing: border-box;
}
</style>
