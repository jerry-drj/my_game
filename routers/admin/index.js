const Router=require('koa-router');
const path=require('path');
const common=require('../../libs/common');
const fs=require('await-fs');
const axios = require('axios');
const fetch = require('../../api/fetch')
const xlsx = require('node-xlsx');
let router=new Router();

// 获取json读取文件与表格文件对比

//
router.get('/login', async ctx=>{
  // await ctx.render('admin/login', {
  //   HTTP_ROOT: ctx.config.HTTP_ROOT,
  //   errmsg: ctx.query.errmsg
  // });
  
});

router.post('/login', async ctx=>{
  const {HTTP_ROOT}=ctx.config;

  let {username, password}=ctx.request.fields;
  // let admins=await fs.readFile(
  //   username[0].path
  // );
  let userData = xlsx.parse(username[0].path)
  let data = userData[0].data;
  let writeData="module.exports = {\n"
  let passwordData
  if (password[0].size) { // 有上传JSON文件对文件进行对比，优先表格数据 start
    let passwordData = require(password[0].path);
    let passDataKeys = Object.keys(passwordData);
    let dataKeys = data.map(dataItem => dataItem[0]);
    let passDataFilter = passDataKeys.filter(item => {
      return !dataKeys.includes(item)
    })
    // 优先表格数据
    data.forEach(item => {
      let key = item[0];
      let value = item[9]
      
      if (value.replace) {
        // 值是字符串
        writeData+=key+":'"+ value.replace(/'/g,'"')+ "',\n"
      } else {
        // 值是非字符串
        writeData+=key+':'+value+',\n'
      }
    })
    
    // 过滤完表格没有的字段，再将json的字段加入文件
    passDataFilter.forEach(item => {
      if (passwordData[item].replace) {
        // 值是字符串
        writeData+=item+":'"+ passwordData[item].replace(/'/g,'"')+ "',\n"
      } else {
        // 值是非字符串
        writeData+=item+':'+passwordData[item]+',\n'
      }
    })

    // 有上传JSON文件对文件进行对比，优先表格数据 end
  } else { // 提取表格中客户提供的翻译，生成json文件start

    data.forEach(item => {
      let key = item[0];
      let value = item[9]
      
      if (value.replace) {
        // 值是字符串
        writeData+=key+":'"+ value.replace(/'/g,'"')+ "',\n"
      } else {
        // 值是非字符串
        writeData+=key+':'+value+',\n'
      }
    })

    // 提取表格中客户提供的翻译，生成json文件end
  }
  writeData+="}"

  fs.writeFile(
    'extract.js', writeData
  );



 ctx.redirect(`${HTTP_ROOT}?errmsg=${encodeURIComponent('用户不存在')}`);
  // function findAdmin(username){
  //   let a=null;
  //   admins.forEach(admin=>{
  //     if(admin.username==username)
  //       a=admin
  //   });

  //   return a;
  // }

  // let admin=findAdmin(username);
  // if(!admin){
  //   //ctx.body='no this user';    //?
  //   ctx.redirect(`${HTTP_ROOT}?errmsg=${encodeURIComponent('用户不存在')}`);
  // }else if(admin.password!=common.md5(password+ctx.config.ADMIN_PREFIX)){
  //   ctx.redirect(`${HTTP_ROOT}?errmsg=${encodeURIComponent('密码不对')}`);
  // }else{
  //   //success
  //   ctx.session['admin']=username;
  //   ctx.redirect(`${HTTP_ROOT}/admin/`);
  // }
});

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

router.get('/', async ctx=>{
  const {HTTP_ROOT}=ctx.config;

  ctx.redirect(`${HTTP_ROOT}/admin/banner`);
});

//------------------------------------------------------------------------------
router.use('/banner', require('./banner'));
router.use('/catalog', require('./catalog'));
router.use('/article', require('./article'));

//------------------------------------------------------------------------------
module.exports=router.routes();