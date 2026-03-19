const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/healthz', (req, res) => res.send('ok'))

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log('Gib Meme home listening on', PORT)
})
