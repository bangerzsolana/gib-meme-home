<template>
  <div class="gib-card">
    <div class="carta" :style="{ backgroundColor: cardBgColor, '--bgcolor': bgcolorMix }">
      <div class="inner-card-wrapper">
        <div class="card-content">
          <div
            class="gc-img"
            :style="{ '--img': `url(${image})` }"
          />
          <div class="infoholder">
            <div class="gc-stats">
              <div class="gc-stat">
                <div class="gc-stat-val">{{ powerLabel }}</div>
                <div class="gc-stat-lbl">power</div>
              </div>
              <div
                class="gc-stat"
                :class="change >= 0 ? 'stat-positive' : 'stat-negative'"
              >
                <div class="gc-stat-val">{{ changeLabel }}</div>
                <div class="gc-stat-lbl">week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="meme" class="gc-meme">{{ meme }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  meme:   { type: String, default: '' },
  image:  { type: String, default: '' },
  power:  { type: Number, default: 0 },
  change: { type: Number, default: 0 },
})

// Dominant color extraction (same algorithm as design-system GibCard)
const extractedBgColor = ref('')

function extractDominantColor(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const max = 20
      const iw = img.naturalWidth || img.width
      const ih = img.naturalHeight || img.height
      const sr = Math.min(max / iw, max / ih)
      const w = Math.ceil(iw * sr)
      const h = Math.ceil(ih * sr)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, iw, ih, 0, 0, w, h)

      const data = ctx.getImageData(0, 0, w, h).data
      const colorFreq = {}
      const tolerance = 10
      let maxCount = 0
      let maxQ = ''

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue
        const r = Math.round(data[i] / tolerance) * tolerance
        const g = Math.round(data[i + 1] / tolerance) * tolerance
        const b = Math.round(data[i + 2] / tolerance) * tolerance
        const key = `${r},${g},${b}`
        colorFreq[key] = (colorFreq[key] || 0) + 1
        if (colorFreq[key] > maxCount) {
          maxCount = colorFreq[key]
          maxQ = key
        }
      }

      if (maxQ) {
        const [r, g, b] = maxQ.split(',').map(Number)
        const nr = Math.round((r / 260) * 255)
        const ng = Math.round((g / 260) * 255)
        const nb = Math.round((b / 260) * 255)
        const hex = '#' + [nr, ng, nb].map(v => v.toString(16).padStart(2, '0')).join('')
        resolve(hex)
      } else {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = imageSrc
  })
}

onMounted(async () => {
  if (props.image) {
    const color = await extractDominantColor(props.image)
    if (color) extractedBgColor.value = color
  }
})

const cardBgColor = computed(() => extractedBgColor.value || '#ffffff')

const bgcolorMix = computed(() => {
  const bg = extractedBgColor.value
  if (!bg) return 'transparent'
  return `color-mix(in srgb, ${bg} 60%, #ffffff)`
})

const powerLabel = computed(() => {
  const result = Math.round(props.power * 1000) / 10
  return (result > 0 ? '+' : '') + result
})

const changeLabel = computed(() => {
  const result = Math.round(props.change * 1000) / 10
  return (result > 0 ? '+' : '') + result + '%'
})
</script>

<style scoped>
.gib-card {
  position: relative;
  display: block;
  width: 100%;
}

.carta {
  padding-top: calc(100% + 80px);
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 11px;
  border: 2px solid #101010;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.inner-card-wrapper {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}

.card-content {
  position: absolute;
  width: 100%; height: 100%;
  top: 0; left: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
}

.gc-img {
  position: relative;
  z-index: 1;
  background-image: var(--img);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: calc(100% - 4px);
  padding-top: 100%;
  height: 0;
  border-radius: 11px;
  border: 2px solid #101010;
}

.infoholder {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  width: 100%;
  justify-content: center;
  height: 100%;
}

.gc-stats {
  display: flex;
  flex-grow: 1;
  width: 100%;
  gap: 8px;
}

.gc-stat {
  border: 2px solid #101010;
  background-color: var(--bgcolor, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  flex: 1;
  flex-direction: column;
  padding: 6px;
  height: 100%;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.gc-stat.stat-positive {
  color: #01b22e;
  background-color: #D0F8D2;
  border-color: #01b22e;
}

.gc-stat.stat-negative {
  color: #F23D4F;
  background-color: #f8d0d0;
  border-color: #F23D4F;
}

.gc-stat-val {
  font-family: 'LuckiestGuy', sans-serif;
  font-size: 21px;
  white-space: nowrap;
  transform: translateY(2px);
}

.gc-stat-lbl {
  font-size: 12px;
  font-family: 'Inter', sans-serif;
}

.gc-meme {
  position: absolute;
  left: 0; right: 0;
  top: 1px;
  margin: auto;
  background: #ffffff;
  color: #000000;
  z-index: 2;
  border-radius: 100px;
  border: 2px solid #101010;
  padding: 2px 8px;
  font-size: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  width: max-content;
  height: max-content;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
