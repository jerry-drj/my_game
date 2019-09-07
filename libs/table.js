const Router=require('koa-router');
const path=require('path');
const common=require('./common');

module.exports=function (fields, table, page_type){
  let router=new Router();

  const page_types={
    'banner': 'banner管理',
    'catalog': '类目管理',
    'article': '文章管理',
  };

  //通用
  router.get('/', async ctx=>{
    const {HTTP_ROOT}=ctx.config;

    let datas=await ctx.db.query(`SELECT * FROM ${table}`);

    fields.forEach(async field=>{
      if(field.type=='select'){
        field.items=await ctx.db.query(field.from);
      }
    });

    await ctx.render('admin/table', {
      HTTP_ROOT,
      page_type,
      page_types,
      datas,
      fields
    })
  });

  router.post('/', async ctx=>{
    let {HTTP_ROOT}=ctx.config;

    let keys=[];
    let vals=[];
    fields.forEach(field=>{
      const {name,type}=field;

      keys.push(name);

      if(type=='file'){
        vals.push(path.basename(ctx.request.fields[name][0].path));
      }else if(type=='date'){
        vals.push(Math.floor(new Date(ctx.request.fields[name]).getTime()/1000));
      }else{
        vals.push(ctx.request.fields[name]);
      }
    });

    await ctx.db.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES(${keys.map(key=>'?').join(',')})`, vals);
    ctx.redirect(`${HTTP_ROOT}/admin/${page_type}`);
  });

  router.get('/delete/:id/', async ctx=>{
    let {id}=ctx.params;
    let {UPLOAD_DIR, HTTP_ROOT}=ctx.config;

    let data=await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id]);
    ctx.assert(data.length, 400, 'no data');

    let row=data[0];
    fields.forEach(async ({name,type})=>{
      if(type=='file'){
        await common.unlink(path.resolve(UPLOAD_DIR, row[name]));
      }
    });

    await ctx.db.query(`DELETE FROM ${table} WHERE ID=?`, [id]);

    ctx.redirect(`${HTTP_ROOT}/admin/${page_type}`);
  });

  router.get('/get/:id', async ctx=>{
    let {id}=ctx.params;

    let rows=await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id]);

    if(rows.length==0){
      ctx.body={err: 1, msg: 'no this data'};
    }else{
      ctx.body={err: 0, msg: 'success', data: rows[0]};
    }
  });

  router.post('/modify/:id/', async ctx=>{
    const post=ctx.request.fields;
    let {id}=ctx.params;
    let {UPLOAD_DIR, HTTP_ROOT}=ctx.config;

    //获取原来的
    let rows=await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id]);
    ctx.assert(rows.length, 400, 'no this data');

    let paths={};
    fields.forEach(({name, type})=>{
      if(type=='file'){
        paths[name]=rows[0][name];
      }
    });

    //
    let keys=[];
    let vals=[];
    let src_changed={};
    fields.forEach(({name, type})=>{
      if(type=='file'){
        if(post[name] && post[name].length && post[name][0].size){
          src_changed[name]=true;

          keys.push(name);
          vals.push(path.basename(post[name][0].path));
        }

      }else if(type=='date'){
        keys.push(name);
        vals.push(Math.floor(new Date(post[name]).getTime()/1000));
      }else{
        keys.push(name);
        vals.push(post[name]);
      }
    });

    //
    await ctx.db.query(`UPDATE ${table} SET ${
      keys.map(key=>(`${key}=?`)).join(',')
    } WHERE ID=?`, [...vals, id]);

    fields.forEach(async ({name, type})=>{
      if(type=='file' && src_changed[name]){
        await common.unlink(path.resolve(UPLOAD_DIR, paths[name]));
      }
    });

    ctx.redirect(`${HTTP_ROOT}/admin/${page_type}`);
  });

  return router.routes();
};
