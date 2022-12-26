import {createApp} from 'vue'
import App from './App.vue'

// normalize.css
import 'normalize.css/normalize.css'
// 全局样式
import '@/styles/index.less'

// 按需注册 vant 组件
import {registerVantComp} from '@/plugins/registerVant'

const app = createApp(App)

app.config.globalProperties.$log = console.log

registerVantComp(app)

app.mount('#app')
