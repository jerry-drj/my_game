const Koa = require('koa');
const Router = require('koa-router');
const static = require('./routers/static');
const body = require('koa-better-body');
const path = require('path');
const session = require('koa-session');
const fs = require('fs');
const ejs = require('koa-ejs');
const config = require('./config');

let server = new Koa();
server.listen(process.env.PORT || config.PORT);
console.log(`server running at ${process.env.PORT || config.PORT}`);

//中间件
server.use(body({
    uploadDir: config.UPLOAD_DIR
}));

// server.keys=fs.readFileSync('.keys').toString().split('\n');
server.use(session({
    maxAge: 20 * 60 * 1000,
    renew: true
}, server));

//数据库
server.context.db = require('./libs/database');
server.context.config = config;

//渲染
ejs(server, {
  root: path.resolve(__dirname, 'template'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: false
});

// server.use(async(ctx, next) => {
//     let { HTTP_ROOT } = ctx.config;
//     try {
//         await next();
//         console.log('body', ctx.body)
//         if (!ctx.body) {
//             // await ctx.render('www/404', {
//             //   HTTP_ROOT
//             // });
//         }
//     } catch (e) {
//       await next();
//         console.log('err', e)
//             // await ctx.render('www/404', {
//             //   HTTP_ROOT
//             // });
//     }
// });

//路由和static
let router = new Router();

//统一处理
/*router.use(async (ctx, next)=>{
  try{
    await next();
  }catch(e){
    ctx.throw(500, 'Internal Server Error');

    console.log(e);
  }
});*/


router.use('/admin', require('./routers/admin'));
router.use('/api', require('./routers/api'));
router.use('/', require('./routers/www'));
static(router);

server.use(router.routes());