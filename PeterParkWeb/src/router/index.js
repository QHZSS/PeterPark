import Vue from 'vue'
import Router from 'vue-router'
import ParkingLotUser from '@/components/ParkingLotUser'
import ParkingSpaceOwner from '@/components/ParkingSpaceOwner'
import ParkingOrder from '@/components/ParkingOrder'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ParkingLotUser',
      component: ParkingLotUser
    }
  ]
})

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'ParkingSpaceOwner',
//       component: ParkingSpaceOwner
//     }
//   ]
// })

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'ParkingOrder',
//       component: ParkingOrder
//     }
//   ]
// })