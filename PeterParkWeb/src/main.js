// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//import router from './router'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import ParkingLotUser from './components/ParkingLotUser'
import ParkingSpaceOwner from './components/ParkingSpaceOwner'
import ParkingOrder from './components/ParkingOrder'
import ParkingSpace from './components/ParkingSpace'
import Message from './components/Message'
import IoTMessage from './components/IoTMessage'
import Statistics from './components/Statistics'
import ParkingLotTraffic from './components/ParkingLotTraffic'

Vue.config.productionTip = false

const routes = [
  { path:'/', component: ParkingLotUser},
  { path:'/ParkingLotUser', component: ParkingLotUser},
  { path:'/ParkingSpaceOwner', component: ParkingSpaceOwner},
  { path:'/ParkingOrder', component: ParkingOrder},
  { path:'/ParkingSpace', component: ParkingSpace},
  { path:'/Message', component: Message},
  { path:'/IoTMessage', component: IoTMessage},
  { path:'/Statistics', component: Statistics},
  { path:'/ParkingLotTraffic', component: ParkingLotTraffic}
]

const router = new VueRouter(
  {routes}
);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
