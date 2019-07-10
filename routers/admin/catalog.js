const tablelib=require('../../libs/table');

module.exports=tablelib(
  [
    {title: '标题', name: 'title', type: 'text'},
  ],
  'catalog_table',
  'catalog'
);
