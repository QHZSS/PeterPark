<template>
  <div id="table">
    <div class="add">
      <input type="text" v-model="addDetail.license_plate" name="license_plate" value="" placeholder="车牌号码" />
      <input type="text" v-model="addDetail.message_time" name="message_time" value="" placeholder="消息时间" />
      <input type="text" v-model="addDetail.parking_space_id" name="parking_space_id" value="" placeholder="停车位ID" />
      <input type="text" v-model="addDetail.user_state" name="user_state" value="" placeholder="用户状态" />
      <input type="text" v-model="addDetail.iot_message_state" name="iot_message_state" value="" placeholder="消息状态" />
<!--      <input type="date" v-model="addDetail.dates" name="date" value="" placeholder="发布时间" />-->
      <button @click="adddetail">新增</button>
    </div>
    <table cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>ID</th>
        <th>车牌号码</th>
        <th>消息时间</th>
        <th>停车位ID</th>
        <th>用户状态</th>
        <th>消息状态</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in newsList" :key='index'>
        <td >{{item.id}}</td>
        <td>{{item.license_plate}}</td>
        <td >{{item.message_time}}</td>
        <td>{{item.parking_space_id}}</td>
        <td v-if="item.user_state == 0">用户不在停车场内</td><td v-else-if="item.user_state == 1">用户在停车场入口道闸处</td><td v-else-if="item.user_state == 2">用户已进入停车场</td><td v-else>用户已停车</td>
        <td>{{item.iot_message_state == 0 ? "未处理" : "已处理"}}</td>
        <td><span @click="deletelist(item.id,index)" class="delete">删除</span><span class="edit" @click="edit(item)">发送消息</span></td>
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
          <input type="text" v-model="editDetail.license_plate" name="license_plate" value="" placeholder="车牌号码" />
          <input type="text" v-model="editDetail.message" name="message" value="" placeholder="例：欢迎光临/谢谢惠顾" />
          <button @click="update">发送</button>
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
  import global from './Global'

  export default {
    name: "IoTMessage",
    data(){
      return{
        addDetail: {},
        editlist: false,
        editDetail: {},
        newsList: [],
        newsListForUser: [],
        editid:'',
      }
    },
    mounted() {
      let count = 0;
      global.MessageWatchFlag = false;
      global.IoTMessageWatchFlag = true;
      global.ParkingLotUserWatchFlag = false;
      global.ParkingOrderWatchFlag = false;
      global.ParkingSpaceWatchFlag = false;
      global.ParkingSpaceOwnerWatchFlag = false;
      while((count < 100)) {
        setTimeout(()=>{
          if(global.IoTMessageWatchFlag){
        axios
          .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Iotmessage/')
          .then(response => {
            this.newsList = response.data.Iotmessage;

            for(let i = 0; i < this.newsList.length; i++){
              //if iot_message_state = 0, then deal with this message
              if(!this.newsList[i].iot_message_state){
                if(this.newsList[i].user_state == 1){
                  console.log("user_state = 1, start getting user table");
                  //first, update user_state to parkinglotuser table
                  //Step1, get the parkinglotuser table
                  axios
                    .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/')
                    .then(response => {
                      this.newsListForUser = response.data.Parkinglotuser;
                      //Step2, use license_plate to find the user
                      console.log(("user_state = 1, start updating user table"));
                      for(let j = 0; j < this.newsListForUser.length; j++){
                        if(this.newsListForUser[j].license_plate == this.newsList[i].license_plate){
                          let json2 = JSON.stringify({
                            "parkinglot_user_name": this.newsListForUser[j].parkinglot_user_name,
                            "license_plate": this.newsListForUser[j].license_plate,
                            "in_black_list":this.newsListForUser[j].in_black_list,
                            "parkinglot_user_state": 1
                          });
                          console.log(json2);
                          //Step3, update user state
                          axios
                            .put('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/' + this.newsListForUser[j].id, json2, {headers: {'Content-Type': 'application/json'}}
                            ).then((res) => {
                            console.log(res);
                          })
                        }
                      }
                    });

                  console.log("user_State = 1, end update user table");
                  //then, update iot_message_state to iot_message table
                  console.log("user_state = 1, start updating iot message table");
                  let json = JSON.stringify({
                    "license_plate":this.newsList[i].license_plate,
                    "message_time":this.newsList[i].message_time,
                    "user_state": this.newsList[i].user_state,
                    "iot_message_state": 1
                  });
                  axios
                    .put('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Iotmessage/' + this.newsList[i].id, json, {headers: {'Content-Type': 'application/json'}}
                    ).then((res) => {
                    console.log(res);
                  })
                }else if(this.newsList[i].user_state == 2){
                  console.log("user_state = 2, start getting user table");
                  //first, update user_state to parkinglotuser table
                  //Step1, get the parkinglotuser table
                  axios
                    .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/')
                    .then(response => {
                      this.newsListForUser = response.data.Parkinglotuser;
                      //Step2, use license_plate to find the user
                      for(let j = 0; j < this.newsListForUser.length; j++){
                        if(this.newsListForUser[j].license_plate == this.newsList[i].license_plate){
                          let json2 = JSON.stringify({
                            "parkinglot_user_name": this.newsListForUser[j].parkinglot_user_name,
                            "license_plate": this.newsListForUser[j].license_plate,
                            "in_black_list":this.newsListForUser[j].in_black_list,
                            "parkinglot_user_state": 2
                          });
                          //Step3, update user state
                          console.log(("user_state = 2, start updating user table"));
                          axios
                            .put('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/' + this.newsListForUser[j].id, json2, {headers: {'Content-Type': 'application/json'}}
                            ).then((res) => {
                            console.log(res);
                          })
                        }
                      }
                    });

                  //then, update iot_message_state to iot_message table
                  console.log("user_state = 2, start updating iot message table");
                  let json = JSON.stringify({
                    "license_plate":this.newsList[i].license_plate,
                    "message_time":this.newsList[i].message_time,
                    "user_state": this.newsList[i].user_state,
                    "iot_message_state": 1
                  });
                  axios
                    .put('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Iotmessage/' + this.newsList[i].id, json, {headers: {'Content-Type': 'application/json'}}
                    ).then((res) => {
                    console.log(res);
                  })
                }else if(this.newsList[i].user_state == 0){
                  console.log("user_state = 0");
                  //first, update user_state to parkinglotuser table
                  //Step1, get the parkinglotuser table
                  axios
                    .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/')
                    .then(response => {
                      this.newsListForUser = response.data.Parkinglotuser;
                      //Step2, use license_plate to find the user
                      for(let j = 0; j < this.newsListForUser.length; j++){
                        if(this.newsListForUser[j].license_plate == this.newsList[i].license_plate){
                          let json2 = JSON.stringify({
                            "parkinglot_user_name": this.newsListForUser[j].parkinglot_user_name,
                            "license_plate": this.newsListForUser[j].license_plate,
                            "in_black_list":this.newsListForUser[j].in_black_list,
                            "parkinglot_user_state": 0
                          });
                          //Step3, update user state
                          axios
                            .put('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/' + this.newsListForUser[j].id, json2, {headers: {'Content-Type': 'application/json'}}
                            ).then((res) => {
                            console.log(res);
                          })
                        }
                      }
                    });

                  //then, update iot_message_state to iot_message table
                  let json = JSON.stringify({
                    "license_plate":this.newsList[i].license_plate,
                    "message_time":this.newsList[i].message_time,
                    "user_state": this.newsList[i].user_state,
                    "iot_message_state": 1
                  });
                  axios
                    .put('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Iotmessage/' + this.newsList[i].id, json, {headers: {'Content-Type': 'application/json'}}
                    ).then((res) => {
                    console.log(res);
                  })
                }
              }
            }

          })}}, count*5000);
        count++;
      }
    },

    methods: {
      adddetail() {
        //这里的思路应该是把this.addDetail传给服务端，然后加载列表this.newsList
        //this.newsList.push(this.addDetail);
        this.newsList.push({
          license_plate: this.addDetail.license_plate,
          message_time: this.addDetail.message_time,
          parking_space_id: this.addDetail.parking_space_id,
          user_state: this.addDetail.user_state,
          iot_message_state: this.addDetail.iot_message_state,
        });
        let json = JSON.stringify({
          "license_plate": this.addDetail.license_plate,
          "message_time": this.addDetail.message_time,
          "parking_space_id": parseInt(this.addDetail.parking_space_id),
          "user_state": parseInt(this.addDetail.user_state),
          "iot_message_state": parseInt(this.addDetail.iot_message_state),
        });

        axios
          .post('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Iotmessage/', json, {headers: {'Content-Type': 'application/json'}}
          ).then((res) => {
          console.log(res);
          axios
            .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Iotmessage/')
            .then(response => {
              this.newsList = response.data.Iotmessage
            })
        });

      },
      //删除
      deletelist(id, i) {
        this.newsList.splice(i, 1);
        axios.delete('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Iotmessage/' + id)
          .then((res) => {
            console.log(res);
            axios
              .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Iotmessage/')
              .then(response => {
                this.newsList = response.data.Iotmessage
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
          license_plate :item.license_plate,
          message: item.message
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
              license_plate: this.editDetail.license_plate,
              message: this.editDetail.message,
              id: this.editid
            };
            this.editlist = false
          }
        }

        let json = JSON.stringify({
          "license_plate": this.editDetail.license_plate,
          "message": this.editDetail.message,
          "message_state": 0,
        });
        axios
          .post('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Message', json, {headers: {'Content-Type': 'application/json'}}
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
    height: 200px;
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
