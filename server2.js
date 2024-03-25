const express = require('express')
const app = express();
const cors = require('cors')
const path = require('path');
const bcrypt = require('bcrypt');
const connectDB = require('./database.js')
app.use(cors());

const { MongoClient, ObjectId } = require('mongodb')

const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoStore = require('connect-mongo')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize())
app.use(session({
  secret: 'hello',
  resave : false,
  saveUninitialized : false,
  store: mongoStore.create({
    mongoUrl: 'mongodb+srv://rokmc1256:hoseo19@cluster0.ljpssec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    dbName: 'forum'
  })
}))
app.use(passport.session()) 

let db
connectDB.then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, function(){
    console.log("listen 8080")
})
}).catch((err)=>{
  console.log(err)
})

passport.use(new LocalStrategy(async (enteredUsername, enteredPassword, cb) => {
    let result = await db.collection('user').findOne({ username : enteredUsername})
    if (!result) {
      return cb(null, false, { message: '아이디 DB에 없음' })
    }

    if (await bcrypt.compare(enteredPassword, result.password)) {
      return cb(null, result)
    } else {
      return cb(null, false, { message: '비번불일치' });
    }
}))

//req.logIn 이 실행될 때 마다 같이 자동으로 실행되는 부분
// 로그인시 세션 document를 발행해주고 document에 있는 _id를 쿠키에 적어서 보내줌
passport.serializeUser((user, done) => { 
    process.nextTick(() => { //nextTick은 비동기적으로 실행됨
      done(null, { id: user._id, username: user.username })
    })
})

//유저가 보낸 쿠키를 분석해줌
//쿠키는 유저가 서버로 요청을 보낼 때 마다 자동으로 날라감
//세션정보가 적힌 쿠키를 가지고 있는 유저가 요청을 보낼 때 마다 실행됨(불필요한 DB 조회 발생)
//특정 API 안에서만 실행되도록 설정하는 것이 필요
passport.deserializeUser(async (user, done) => {
    let result = await db.collection('user').findOne({_id : new ObjectId(user.id) })
    delete result.password
    process.nextTick(() => {
      return done(null, result)
    })
})

//---------------------------------이 밑에다가 API 구현하기--------------------------------------//

app.get('/checkLoggedIn', (req, res) => {
  if (req.user) {
    res.json({ loggedIn: true, username: req.user.username });
  } else {
    res.json({ loggedIn: false });
  }
})

app.post('/login', async (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
      if (error) return res.status(500).json(error)
      if (!user) return res.status(401).json(info.message)

      //성공하면 세션만들기 시작
      req.logIn(user, (err) => {
        if (err) return next(err)
        res.redirect('/')
      })
    })(req, res, next)
}) 

app.get('/logout', async (req, res) => {
  const session = req.session
  try{
    if(session){
      await session.destroy((err) => {
        if(err){
          console.log(err)
        } else {
          res.redirect('/')
        }
      })
    }
  }catch(err){
    console.log('에러: ', err)
  }
});

app.post('/register', async(req, res) => {
  try {
    const username = req.body.username;
    console.log(username, req.body)
    // 데이터베이스에서 입력된 사용자명을 검색
    const existingUser = await db.collection('user').findOne({ username: username });

    if (existingUser) {
        // 사용자명이 이미 존재하는 경우
        res.status(400).send('이미 존재하는 아이디입니다.');
    } else {
        // 사용자명이 존재하지 않는 경우, 비밀번호를 해싱하여 저장
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        // 데이터베이스에 사용자 정보 저장
        await db.collection('user').insertOne({
            username: username,
            password: hashPassword
        });
        res.redirect('/')
    }
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).send('회원가입 중 오류가 발생했습니다.');
  }
})

app.post('/addpost', async(req, res) => {
    // await db.collection('post').insertOne({
    //     title: req.body.title,
    //     content: req.body.content
    // })
    // res.redirect('/')
})