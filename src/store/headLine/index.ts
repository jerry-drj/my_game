import fetch from '../../api/fetch'
fetch({method: 'post',url:'/headLine'}).then(response => {
  return response
})
export default {}