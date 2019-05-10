const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const app = express()
// app.use(express.static('public'))

//
// app.use(bodyParser.json());
// 以下 midware 可以將 x-www-form-urlencodeed 解開
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.sendFile('public/index.html', {root: __dirname })
})

app.get('/login', (req, res) => {
	res.sendFile('public/login.html', {root: __dirname })
})
app.post('/login', (req, res) => {

	let user = req.body.user
	let passwd = req.body.password

	if (user === 'oliver' && passwd === '1234') {
		// let exp = Math.floor(Date.now() / 1000) + (60 * 60)
		let token = jwt.sign({
			  			data: 'your_data'
					}, 'secret')
		// 可以將 token 設定在 cookie 或是請 user 自己從 header 的 auth 帶入
		// res.cookie('auth', token);
		res.send({
			success: true,
			token: token
		})
		
	} else {
		res.send({
			success: false,
			user: user,
			passwd: passwd
		})
	}
})

const api = express.Router()
api.use((req, res, next) => {
	let token = req.headers.auth
	console.log('token', token)
	if (token) {
		jwt.verify(token, 'secret', (err, decoded) => {
			if (err) {
				return res.json({success: false, message: 'Failed to authenticate token.'})
			} else {
				req.decoded = decoded
				next()
			}
   		})
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
    	})
	}
})
api.get('/', (req, res) => {
	res.send({
		success: true,
		data: 'flutter is good?'
	})
})
app.use('/api', api)
app.listen(3000, () => console.log('server running at http://localhost:3000'))