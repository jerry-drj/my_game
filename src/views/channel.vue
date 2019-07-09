<template>
  <div>
    this the module : {{moduleName}}
    <button @click="jump">gotoChannel</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
@Component
class headLine extends Vue{
  moduleName:string = '频道';
  jump():void {
    this.$router.push({name: 'headLine'})
  }
}
export default headLine
</script>

