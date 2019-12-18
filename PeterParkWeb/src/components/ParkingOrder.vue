<template>
  <div id="table">
    <div class="add">
      <input type="text" v-model="addDetail.user_name" name="user_name" value="" placeholder="用户名" />
      <input type="text" v-model="addDetail.parking_space_id" name="parking_space_id" value="" placeholder="停车位ID" />
      <input type="text" v-model="addDetail.start_time" name="start_time" value="" placeholder="开始时间" />
      <input type="text" v-model="addDetail.end_time" name="end_time" value="" placeholder="结束时间" />
      <input type="text" v-model="addDetail.order_state" name="order_state" value="" placeholder="订单状态" />
      <input type="text" v-model="addDetail.order_fee" name="order_fee" value="" placeholder="订单费用" />
<!--      <input type="date" v-model="addDetail.dates" name="date" value="" placeholder="发布时间" />-->
      <button @click="adddetail">新增</button>
    </div>
    <table cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>ID</th>
        <th>用户名</th>
        <th>停车位ID</th>
        <th>开始时间</th>
        <th>结束时间</th>
        <th>订单状态</th>
        <th>订单费用</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in newsList" :key='index'>
        <td >{{item.id}}</td>
        <td>{{item.user_name}}</td>
        <td >{{item.parking_space_id}}</td>
        <td>{{item.start_time}}</td>
        <td>{{item.end_time}}</td>
        <td v-if="item.order_state == 1">订单未支付</td><td v-else-if="item.order_state == 2">订单已完成</td><td v-else>订单进行中</td>
        <td>{{item.order_fee}}</td>
        <td><span @click="deletelist(item.id,index)" class="delete">删除</span><span class="edit" @click="edit(item)">编辑</span></td>
      </tr>
      </tbody>
    </table>
    <div id="mask" v-if="editlist">
      <div class="mask">
        <div class="title">
          编辑
          <span @click="editlist=false">
					X
				</span>
        </div>
        <div class="content">
          <input type="text" v-model="editDetail.user_name" name="user_name" value="" placeholder="user_name" />
          <input type="text" v-model="editDetail.parking_space_id" name="parking_space_id" value="" placeholder="parking_space_id" />
          <input type="text" v-model="editDetail.start_time" name="start_time" value="" placeholder="start_time" />
          <input type="text" v-model="editDetail.end_time" name="end_time" value="" placeholder="end_time" />
          <input type="text" v-model="editDetail.order_state" name="order_state" value="" placeholder="order_state" />
          <input type="text" v-model="editDetail.order_fee" name="order_fee" value="" placeholder="order_fee" />
          <button @click="update">更新</button>
          <button @click="editlist=false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import qs from 'qs'
  import VueRouter from "vue-router"

  export default {
    name: "ParkingOrder",
    data(){
      return{
        addDetail: {},
        editlist: false,
        editDetail: {},
        newsList: [],
        editid:''
      }
    },
    mounted() {
      let count = 0;
      while(count < 100) {
        setTimeout(() =>{
          axios
            .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingorder/')
            .then(response => {
              this.newsList = response.data.Parkingorder;
              console.log("Hello");
            })
        }, count * 5000);
        count++;
      }
    },

    methods: {
      adddetail() {
        //这里的思路应该是把this.addDetail传给服务端，然后加载列表this.newsList
        //this.newsList.push(this.addDetail);
        this.newsList.push({
          user_name: this.addDetail.user_name,
          parking_space_id: this.addDetail.parking_space_id,
          start_time: this.addDetail.start_time,
          end_time: this.addDetail.end_time,
          order_state: this.addDetail.order_state,
          order_fee: this.addDetail.order_fee
        });
        let json = JSON.stringify({
          "user_name": this.addDetail.user_name,
          "parking_space_id": parseInt(this.addDetail.parking_space_id),
          "start_time": this.addDetail.start_time,
          "end_time": this.addDetail.end_time,
          "order_state": parseInt(this.addDetail.order_state),
          "order_fee": parseInt(this.addDetail.order_fee)
        });

        axios
          .post('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingorder/', json, {headers: {'Content-Type': 'application/json'}}
          ).then((res) => {
          console.log(res);
          axios
            .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingorder/')
            .then(response => {
              this.newsList = response.data.Parkingorder
            })
        });

      },
      //删除
      deletelist(id, i) {
        this.newsList.splice(i, 1);
        axios.delete('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingorder/' + id)
          .then((res) => {
            console.log(res);
            axios
              .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingorder/')
              .then(response => {
                this.newsList = response.data.Parkingorder
              })
          });
        //这边可以传id给服务端进行删除  ID = id
        //axios.get('url',{ID:id}).then((res) =>{
        //			加载列表
        //})
      },
      //编辑
      edit(item) {
        this.editDetail = {
          user_name: item.user_name,
          parking_space_id: item.parking_space_id,
          start_time: item.start_time,
          end_time: item.end_time,
          order_state: item.order_state,
          order_fee: item.order_fee
        };
        this.editlist = true;
        this.editid = item.id

      },

      //确认更新
      update() {
        //编辑的话，也是传id去服务端
        //axios.get('url',{ID:id}).then((res) =>{
        //			加载列表
        //})
        for (let i = 0; i < this.newsList.length; i++) {
          if (this.newsList[i].id == this.editid) {
            this.newsList[i] = {
              user_name: this.editDetail.user_name,
              parking_space_id: this.editDetail.parking_space_id,
              start_time: this.editDetail.start_time,
              end_time: this.editDetail.end_time,
              order_state: this.editDetail.order_state,
              order_fee: this.editDetail.order_fee,
              id: this.editid
            };
            this.editlist = false
          }
        }

        let json = JSON.stringify({
          "user_name": this.editDetail.user_name,
          "parking_space_id": parseInt(this.editDetail.parking_space_id),
          "start_time": this.editDetail.start_time,
          "end_time": this.editDetail.end_time,
          "order_state": parseInt(this.editDetail.order_state),
          "order_fee": parseInt(this.editDetail.order_fee)
        });
        axios
          .put('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingorder/' + this.editid, json, {headers: {'Content-Type': 'application/json'}}
          ).then((res) => {
          console.log(res);
        })
      }
    }
  }
</script>
<style scoped>
  #table table {
    width: 100%;
    font-size: 14px;
    border: 1px solid #eee
  }

  #table {
    padding: 0 10px;
    margin-top: 80px;
    width: 100%;
  }

  table thead th {
    background: #f5f5f5;
    padding: 10px;
    text-align: left;
  }

  table tbody td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
  }

  table tbody td span {
    margin: 0 10px;
    cursor: pointer;
  }

  .delete {
    color: red;
  }

  .edit {
    color: #008cd5;
  }

  .add {
    border: 1px solid #eee;
    margin: 10px 0;
    padding: 15px;
  }

  input {
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 3px;
    margin-right: 15px;
  }

  button {
    background: #008cd5;
    border: 0;
    padding: 4px 15px;
    border-radius: 3px;
    color: #fff;
  }

  #mask {
    background: rgba(0, 0, 0, .5);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 4;
    top: 0;
    left: 0;
  }

  .mask {
    width: 300px;
    height: 400px;
    background: rgba(255, 255, 255, 1);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 47;
    border-radius: 5px;
  }

  .title {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .title span {
    float: right;
    cursor: pointer;
  }

  .content {
    padding: 10px;
  }

  .content input {
    width: 270px;
    margin-bottom: 15px;
  }
</style>
