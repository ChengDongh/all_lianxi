import Message from './Message.vue'

const MESSAGE = {
  duration:8000,
  animateTime:300,
  install(Vue){
    if(typeof window !== 'undefined' && window.Vue){
      Vue = window.Vue
    }
    Vue.component('Message',Message)
    function msg(type,text,callBack) {
      let msg
      let duration = MESSAGE.duration
      if(typeof text === 'string'){
        msg = text
      }else if(text instanceof object){
        msg = text.text || ''
        if(text.duration){
          duration = text.duration
        }
      }
      let VueMessage = Vue.extend({
        render(h){
          let props = {
            type,
            text:msg,
            show:this.show
          }
          return h('message',{props})
        },
        data(){
          return{
            show:false
          }
        }
      })
      let newMessage = new VueMessage()
      let vm = newMessage.$mount()
      let el = vm.$el
      document.body.appendChild(el)//把生成的提示的dom插入body中
      vm.show = true
      let t1 = setTimeout(() =>{
        clearTimeout(t1)
        vm.show = false
        let t2 = setTimeout(()=>{
          clearTimeout(t2)
          document.body.removeChild(el)
          newMessage.$destroy()
          vm = null

          callBack && (typeof callBack === 'function') && callBack()

        },MESSAGE.animateTime)
      },duration)
    }
    Vue.prototype.$message = {
      info(text,callBack){
        if(!text)return
        msg('info',text,callBack)
      },
      success(text,callBack){
        if(!text)return
        msg('success',text,callBack)
      },
      error(text,callBack){
        if(!text)return
        msg('error',text,callBack)
      },
      warring(text,callBack){
        if(!text)return
        msg('warning',text,callBack)
      }
    }
  }
}
export default MESSAGE
