const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const mongo = require('../config/mongo')
const crypto = require('crypto');
const { strcmp } = require('../lib/utils')
const ObjectID = require('../config/mongo').ObjectID
// тут роут
exports.init = function (app) {
router.post('/login', login)
app.use(router.routes())
}
// собственно функция логина
async function login(ctx,next) {
// сюда методом post приходят данные в виде json
const authData = ctx.request.fields
//с помощью hash мы проверим целостность данных, то есть вообще с телеграма ли нам это пришло или кто-то нехороший копается
const checkHash = authData.hash
delete authData['hash']
/* по инструкции телеграм мы должны взять все данные, кроме hash, которые пришла нам от телеграм и собрать из в одну строку в формате key=value, разделяя символом переноса строки \n */
let dataCheck = []
for (let key in authData) {
dataCheck.push(key + '=' + authData[key])
}
dataCheck.sort();
dataCheck.join("\n”)
// Делаем из неё sha256
const secretKey = crypto.createHash('sha256')
.update(config.oauth.telegram.botToken)
/* и проверяем если не ок, то шлём юзера куда подальше, если ок, то добавляем или обновляем пользователя в базе данных */
const hash = crypto.createHmac('sha256', dataCheck.toString(), secretKey);
if (strcmp(hash, checkHash) === -1) {
ctx.status = 401
ctx.body = 'Data is NOT from Telegram'
}
if ( +(new Date()) — authData.auth_date > 86400) {
ctx.status = 401
ctx.body = 'Data is outdated'
}
const user = await mongo.users.findOne({id:authData.id})
if(!user){
await mongo.users.insertOne(authData)
}else{
await mongo.users.updateOne({_id: new ObjectID(user._id)},{$set:{authData}})
}
/*Здесь я использовал jwt, чтобы сделать токен, в принципе можно написать это самому, но суть статьи не в этом*/
const token = await jwt.sign(authData, config.app.secret)
/* Ставлю куку с этим токеном */
ctx.cookies.set('tgUser', token);
ctx.status = 200
ctx.body = {
user: authData
}
/*Теперь я добавлю перед всеми роутами middlware. Я использую koa, там принять пользователя хранить в ctx.state.user*/
app.use(async (ctx,next) => {
const token = ctx.cookies.get('tgUser')
if(token){
try {
ctx.state.user = await jwt.verify(token, config.app.secret)
}catch (error) {
ctx.cookies.set('tgUser', '');
}
}
await next(ctx)
})
