<template>
  <div class="trailer" :style="{ background: bgColor }">

    <!-- Controls (hidden during recording — press 'h' to toggle) -->
    <div v-show="showControls" class="controls">
      <div class="control-row">
        <button @click="bgColor = '#00b140'" :class="{ active: bgColor === '#00b140' }">Green</button>
        <button @click="bgColor = '#ff00ff'" :class="{ active: bgColor === '#ff00ff' }">Magenta</button>
        <button @click="bgColor = '#0000ff'" :class="{ active: bgColor === '#0000ff' }">Blue</button>
        <button @click="bgColor = '#000000'" :class="{ active: bgColor === '#000000' }">Black</button>
      </div>
      <div class="control-row">
        <label>Frame duration: {{ frameDurationMs }}ms</label>
        <input type="range" min="1500" max="6000" step="100" v-model.number="frameDurationMs" />
      </div>
      <div class="control-row">
        <button @click="restart">Restart</button>
        <button @click="paused = !paused">{{ paused ? 'Play' : 'Pause' }}</button>
        <button @click="currentFrame = (currentFrame - 1 + 4) % 4">◀</button>
        <button @click="currentFrame = (currentFrame + 1) % 4">▶</button>
        <span class="frame-num">Frame {{ currentFrame + 1 }} / 4</span>
      </div>
      <div class="hint">Press <kbd>H</kbd> to hide controls · <kbd>Space</kbd> to play/pause · <kbd>R</kbd> to restart</div>
    </div>

    <div class="stage">

      <div class="title-area">

        <!-- Frame 1: MEMECOIN TRADING CARD GAME -->
        <div class="frame frame-1" :class="{ exiting: currentFrame !== 0 }">
          <div class="title-main-wrap">
            <div class="title-main">MEMECOIN<br>TRADING CARD</div>
          </div>
          <div class="title-game-wrap">
            <div class="title-game"><span class="luckiest-nudge">GAME</span></div>
          </div>
        </div>

        <!-- Frame 2: BUILD DECKS TO BATTLE -->
        <div class="frame frame-2 frame-abs" :class="{ active: currentFrame === 1 }">
          <div class="title-build">BUILD DECKS</div>
          <div class="title-battle-scene">
            <img class="sword sword-left" src="/assets/sword-left.png" alt="" aria-hidden="true">
            <div class="title-battle-box"><span class="luckiest-nudge">TO BATTLE</span></div>
            <img class="sword sword-right" src="/assets/sword-right.png" alt="" aria-hidden="true">
          </div>
        </div>

        <!-- Frame 3: CARD POWER FOLLOWS THE MARKET -->
        <div class="frame frame-3 frame-abs" :class="{ active: currentFrame === 2 }">
          <div class="title-card-follows"><span class="luckiest-nudge">CARD POWER FOLLOWS</span></div>
          <div class="title-market-scene">
            <img class="market-arrow arrow-down" src="/assets/arrow-down.png" alt="" aria-hidden="true">
            <div class="title-market">THE MARKET</div>
            <img class="market-arrow arrow-up" src="/assets/arrow-up.png" alt="" aria-hidden="true">
          </div>
        </div>

        <!-- Frame 4: WIN REAL REWARDS -->
        <div class="frame frame-4 frame-abs" :class="{ active: currentFrame === 3 }">
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

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const currentFrame = ref(0)
const frameDurationMs = ref(3000)
const bgColor = ref('#00b140')
const paused = ref(false)
const showControls = ref(true)
const FRAME_COUNT = 4

let timer = null

function tick() {
  if (paused.value) return
  currentFrame.value = (currentFrame.value + 1) % FRAME_COUNT
}

function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(tick, frameDurationMs.value)
}

function restart() {
  currentFrame.value = 0
  startTimer()
}

function onKey(e) {
  if (e.key === 'h' || e.key === 'H') showControls.value = !showControls.value
  if (e.key === ' ') { paused.value = !paused.value; e.preventDefault() }
  if (e.key === 'r' || e.key === 'R') restart()
}

watch(frameDurationMs, () => startTimer())

onMounted(() => {
  startTimer()
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.trailer {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* The stage holds the animated text — sized like a vertical phone frame so
   the recording dimensions are predictable. Resize your browser to roughly
   the aspect ratio you want for your social post. */
.stage {
  position: relative;
  width: min(100vw, 56.25vh);  /* 9:16 aspect ratio cap */
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
}

/* ── CONTROLS (chrome — won't appear in final recording when 'h' is pressed) ── */
.controls {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  font-family: system-ui, sans-serif;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 280px;
}
.control-row {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}
.controls button {
  background: #333;
  color: #fff;
  border: 1px solid #555;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.controls button:hover { background: #444; }
.controls button.active { background: #2dd632; color: #000; border-color: #2dd632; }
.controls input[type="range"] { flex: 1; }
.controls label { color: #ccc; min-width: 130px; }
.frame-num { color: #2dd632; font-weight: 600; margin-left: auto; }
.hint { color: #888; font-size: 11px; }
.hint kbd {
  background: #444;
  border: 1px solid #666;
  border-radius: 3px;
  padding: 1px 5px;
  color: #fff;
  font-family: ui-monospace, monospace;
  font-size: 10px;
}

/* ── LuckiestGuy optical centering nudge ── */
.luckiest-nudge {
  position: relative;
  top: 0.12em;
}

/* ── TITLE AREA — multi-frame switcher ── */
.title-area {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  top: 50%;
  transform: translateY(-50%) scale(0.95);
  left: 0; right: 0;
  opacity: 0;
  pointer-events: none;
}
.frame-1 {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scale(1);
  left: 0; right: 0;
}
.frame-1.exiting {
  transform: translateY(-50%) scale(0.95);
}
.frame-abs.active {
  opacity: 1;
  transform: translateY(-50%) scale(1);
  pointer-events: auto;
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

/* ── FRAME 2: BUILD DECKS TO BATTLE ── */
.title-build {
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(10.5vw, 7vh);
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
  transition: translate 0.7s cubic-bezier(0.16, 0.7, 0.3, 1) 0.25s;
  animation: arrow-bob-down 2.4s ease-in-out infinite;
}
.arrow-up {
  justify-self: start;
  translate: 0 0;
  transition: translate 0.7s cubic-bezier(0.16, 0.7, 0.3, 1) 0.35s;
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
  line-height: 1.15;
  color: #977efb;
  text-shadow: 0px 2px 6px rgba(0,0,0,0.2);
  letter-spacing: 1px;
}

.title-real-rewards {
  font-family: 'LuckiestGuy', sans-serif;
  font-size: min(10.5vw, 7vh);
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

@keyframes title-shine {
  0%, 100% { background-position: -200% 0, 0 0; }
  50%       { background-position: 200% 0, 0 0; }
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
</style>
