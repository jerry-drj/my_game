<template>
  <div>
    this the module : {{moduleName}}
    <button @click="queryHeadLineData">getModuleData</button>
    <button @click="jump">gotoChannel</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
@Component
class headLine extends Vue{
  moduleName:string = '头条';
  jump():void {
    this.$router.push({name: 'channel'})
  }
  queryHeadLineData():void {
    this.$store.dispatch("queryHeadLineData",{url:'/url',method:'get'}).then(res => {
      console.log("res---",res)
    }).catch(err => {
      debugger
      console.log("err---",err.request.status)
    })
  }
}
export default headLine
</script>

