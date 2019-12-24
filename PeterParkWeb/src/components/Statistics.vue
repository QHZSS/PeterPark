<template>
  <div>
    <div :class="classPrefix" align="center">
      <div ref = 'myEchart' :class="classPrefix+'_chart'"></div>
    </div>
    <div id="table" align="center">
      <table cellpadding="0" cellspacing="0">
        <thead>
        <tr>
          <th>日期(仅显示近半月）</th>
          <th>订单数量</th>
          <th>总营收(元）</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in newsListForStatistics" :key='index'>
          <td >{{item.date}}</td>
          <td>{{item.orderNumber}}</td>
          <td >{{item.income}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import qs from 'qs'
  import VueRouter from "vue-router"
  import global from './Global'
  import echarts from 'echarts'

  export default {
    name: "Statistics",
    data(){
      return{
        newsList: [],
        newsListForStatistics: [],
        singleDay: {},
        daysList: [],
        dateTime: '',
        preDayTime:'',
        classPrefix: "qst-tecs-src-teacher-dean-brokenLine_",
        yNum:['总营收（元）', '订单数量'],
        incomesList : [],
        orderNumberList: []
      }
    },
    mounted() {
      let count = 0;
      global.MessageWatchFlag = false;
      global.IoTMessageWatchFlag = false;
      global.ParkingLotUserWatchFlag = false;
      global.ParkingOrderWatchFlag = true;
      global.ParkingSpaceWatchFlag = false;
      global.ParkingSpaceOwnerWatchFlag = false;
      while((count < 2)) {
        setTimeout(() =>{
          if(global.ParkingOrderWatchFlag){
          axios
            .get('http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/Parkingorder/')
            .then(response => {
              this.newsList = response.data.Parkingorder;
              this.dateTime = new Date();
              this.dateTime = Date.parse(this.dateTime);
              //this.dateTime = this.dateTime.toDateString();
              this.newsListForStatistics = [];
              this.daysList = [];
              let preTime=this.dateTime;
              for(let i = 14; i >= 0; i--) {

                this.preDayTime = new Date(preTime-preTime%(24*60*60*1000) - 24*60*60*1000*i);
                this.daysList.push(
                  this.preDayTime.toDateString()
                );
                this.newsListForStatistics.push({
                  date : this.preDayTime.toDateString(),
                  orderNumber: 0,
                  income: 0
                });
              }
              //Should be tested again when data is enough, may exist data misalignment problem
                for(let i = 0; i < this.newsList.length; i++){
                  if(this.newsList[i].end_time) {
                    let orderDate = this.newsList[i].end_time;
                    let x=preTime-preTime%(24*60*60*1000);
                    let y=Date.parse(orderDate);
                    let j=0;
                    if(x>=y){
                        j = parseInt((x -y ) / (24 * 60 * 60 * 1000));
                    }else{
                        j=-1;
                  }
                    console.log(j);
                    console.log(new Date().toUTCString());
                    this.newsListForStatistics[13 - j].orderNumber++;
                    if(this.newsList[i].order_state == 3 && this.newsList[i].order_fee) {
                      this.newsListForStatistics[13 - j].income += this.newsList[i].order_fee
                    }
                  }
                }
                this.incomesList = [];
                this.orderNumberList = [];
                for(let j = 0; j < this.newsListForStatistics.length; j++){
                  this.incomesList.push(this.newsListForStatistics[j].income);
                  this.orderNumberList.push(this.newsListForStatistics[j].orderNumber)
                }

                console.log(this.incomesList);
                console.log(this.orderNumberList);
                //console.log(this.series);
                let obj = this.$refs.myEchart;
                if(obj){
                  this.initChart();
                }

            })
        }}, count * 5000);
        count++;
      }
    },

    methods: {
      // 图表初始化数据
      initChart(){
        let myChart = echarts.init(this.$refs.myEchart);
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.yNum,
          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            top:'12%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.daysList,
            axisLabel: {
              interval:0,
              rotate:-60
            }
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 200,
            interval: 20,
            axisLabel: {
              formatter: '{value}'
            }
          },
          // 折线图数据
          series:[
            {name:'总营收（元）',type:'line',stack: '总营收（元）',data: this.incomesList},
            {name:'订单数量', type:'line', stack: '订单数量',data:this.orderNumberList}
          ]
        })
      }
    },

  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
  #table table {
    width: 80%;
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
    height: 275px;
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

  .qst-tecs-src-teacher-dean-brokenLine_ {
    &_chart{
     height:380px;
     width:700px;
    }
  }
</style>
