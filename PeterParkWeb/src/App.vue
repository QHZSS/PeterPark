<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
    <h1>智能停车场系统后台管理界面</h1>
    <div class="add">
      <router-link to="/IoTMessage"><button>停车场日志</button></router-link>          <router-link to="/Message"><button>消息列表</button></router-link>       <router-link to="/ParkingLotUser"><button>停车位用户</button></router-link>      <router-link to="/ParkingSpaceOwner"><button>停车位业主</button></router-link>           <router-link to="/ParkingOrder"><button>停车场订单</button></router-link>          <router-link to="/ParkingSpace"><button>停车位信息</button></router-link>          <router-link to="/ParkingLotTraffic"><button>停车场路况</button></router-link>          <router-link to="/Statistics"><button>数据统计</button></router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.add {
  border: 1px solid #eee;
  margin: 10px 0;
  padding: 15px;
}

button {
  background: #008cd5;
  border: 0;
  padding: 4px 15px;
  border-radius: 3px;
  color: #fff;
}
</style>
