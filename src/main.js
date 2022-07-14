import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dayjs from 'dayjs'
import '@/styles/reset.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import MainHeader from '@/components/MainHeader'

Vue.config.productionTip = false

// 全局过滤器
Vue.filter('date', (val) => {
  return dayjs(val * 1000).format('YYYY-MM-DD')
})

Vue.use(ElementUI)
Vue.use(VueQuillEditor /* { default global options } */)

Vue.component('MainHeader', MainHeader)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
