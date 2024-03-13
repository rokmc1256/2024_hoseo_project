const express = require('express')
const app = express()
const path = require('path')

app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행 중');
})

app.get('/', (req, res) => {
    res.send('반갑다');
})