const Router=require('koa-router');
const path=require('path');
const common=require('../../libs/common');
const fs=require('await-fs');
const fetch = require('../../api/fetch');

let router=new Router();

//
router.post('/login', async ctx=>{
  let {HTTP_ROOT} = ctx.config;
  let field = ctx.request.fields;
  console.log(field)
  if (!field.username || !field.password) {
    await ctx.render('admin/login', {
      HTTP_ROOT,
      errmsg: '账号或密码不正确'
  });
  } else {
     await ctx.render('www/index',{
      HTTP_ROOT,
      banners: [],
      catalogs: [],
      articles: []
    })
  }
  
  // fetch({
  //   method: ctx.method,
  //   url: ctx.url,
  //   data: {
  //     name: 'name'
  //   }
  // }).then(data => {
  //   // console.log(data)
  // }).catch(err => {
  //   // console.log('err',err)
  // })
  // console.log(ctx.request.fields)
  // ctx.body = "index"
});

// router.post('/login', async ctx=>{
//   const {HTTP_ROOT}=ctx.config;

//   let {username, password}=ctx.request.fields;
//   let admins=JSON.parse((await fs.readFile(
//     path.resolve(__dirname, '../../admins.json')
//   )).toString());

//   function findAdmin(username){
//     let a=null;
//     admins.forEach(admin=>{
//       if(admin.username==username)
//         a=admin
//     });

//     return a;
//   }

//   let admin=findAdmin(username);
//   if(!admin){
//     //ctx.body='no this user';    //?
//     ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('用户不存在')}`);
//   }else if(admin.password!=common.md5(password+ctx.config.ADMIN_PREFIX)){
//     ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('密码不对')}`);
//   }else{
//     //success
//     ctx.session['admin']=username;
//     ctx.redirect(`${HTTP_ROOT}/admin/`);
//   }
// });

//
// router.all('*', async (ctx, next)=>{
//   let {HTTP_ROOT}=ctx.config;

//   if(ctx.session['admin']){
//     await next();
//   }else{
//     ctx.body='你不是管理员';
//     // ctx.redirect(`${HTTP_ROOT}/admin/login`);
//   }
// });

// router.get('/', async ctx=>{
//   const {HTTP_ROOT}=ctx.config;

//   ctx.redirect(`${HTTP_ROOT}/admin/banner`);
// });

//------------------------------------------------------------------------------
router.use('/banner', require('./banner'));
router.use('/catalog', require('./catalog'));
router.use('/article', require('./article'));

//------------------------------------------------------------------------------
module.exports=router.routes();
