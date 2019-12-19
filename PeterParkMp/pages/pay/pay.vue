<template>
	<view>
		<view>停车开始时间：{{ orderInfo.start_time }}</view>
		<view>停车结束时间：{{ orderInfo.end_time }}</view>
		<view>停车时间：{{ parkHour }}小时{{ parkMin }}分{{ parkSec }}秒</view>
		<view>停车费用：¥{{ orderFee }}</view>
		<button @tap="payOrderFee" :disabled="paysuccess === 1">支付费用</button>
		<view v-if="paysuccess == 1">支付成功</view>
	</view>
</template>

<script>
import {
	mapState
} from 'vuex'

export default {
	computed: mapState(['licensePlate','hasLogin','orderId']),
	data() {
		return {
			orderInfo:{},
			parkHour:0,
			parkMin:0,
			parkSec:0,
			orderFee:0,
			paysuccess:0
		}
	},
	async onLoad() {
		let that=this;
		await uni.request({
			url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingorder/?Parkingorder.id='+that.orderId,
			method:'GET',
			header: {
				'custom-header': 'hello'
			},
			success: (res) => {
				 that.orderInfo= res.data.Parkingorder[0];
				 if(that.orderInfo.order_state == 3){
					 that.paysuccess=1;
					 }
				 console.log(that.orderInfo)
				let startTime = Date.parse(that.orderInfo.start_time);
				let endTime = Date.parse(that.orderInfo.end_time);
				let parkTime = endTime-startTime;
				that.parkHour = parseInt((endTime - startTime)/(1000*60*60));
				that.parkMin = parseInt((endTime - startTime - that.parkHour*60*60*1000)/(1000*60));
				that.parkSec = parseInt((endTime - startTime - that.parkHour*60*60*1000 - that.parkMin*1000*60)/(1000));
				//timeInterval收费的时间间隔，按照小时计算
				let timeInterval = Math.ceil((endTime - startTime)/(1000*60*60))  ;
				let fee = 0;
				if(timeInterval == 1){
					fee = 10;
				}else {
					if(2 <= timeInterval <=5){
					fee = 10 + (timeInterval-1)*7;
				}
				else{if(5<timeInterval<=7){
					fee = 31 +(timeInterval-5)*5;
				}
				else{
					let remain = (timeInterval%24);
					let remainmoney = 0;
					if(remain == 1) remainmoney =10;
					if(2 <= remain <=5) remainmoney =10+(remain-1)*7;
					if(5<remain<=7) remainmoney = 31 +(remain-5)*5;
					if(remain>7)remainmoney = 41;
					fee = parseInt(timeInterval/24)*41 + remainmoney;
				}
				}}
				that.orderFee = fee;;
				console.log("收费时间间隔："+that.timeInterval);
				console.log("停车时间："+that.parkHour+"hour"+that.parkMin+"min"+that.parkSec+"sec");
				/**
				 * order状态为1时
				 * 改order的orderfee以及state为2（用户以及离开但是还未付费）
				 */
				if(that.orderInfo.order_state == 1){

				uni.request({
					url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingorder/'+that.orderId,
					method:'PUT',
					data: {
						  parking_user_name: that.orderInfo.parking_user_name,
						  parking_space_id: that.orderInfo.parking_space_id,
						  start_time: that.orderInfo.start_time,
						  end_time: that.orderInfo.end_time,
						  order_state: 2,
						  order_fee:that.orderFee
					},
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type' : 'application/json'
					},
					success: (res) => {
						console.log("add order fee sucess");
					},
					fail:(err)=> {
						console.log("err"+err);
					}
				});}
				},
			fail:(err)=> {
				console.log("err"+err);
			}
		})
	},
	methods: {
		payOrderFee(){
			let that = this;
			uni.request({
				url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingorder/'+that.orderId,
				method:'PUT',
				data: {
					  parking_user_name: that.orderInfo.parking_user_name,
					  parking_space_id: that.orderInfo.parking_space_id,
					  start_time: that.orderInfo.start_time,
					  end_time: that.orderInfo.end_time,
					  order_state: 3,
					  order_fee:that.orderFee
				},
				header: {
					'custom-header': 'hello', //自定义请求头信息
					'content-type' : 'application/json'
				},
				success: (res) => {
					console.log("pay sucess");
				},
				fail:(err)=> {
					console.log("err"+err);
				}
			});
			that.paysuccess=1;
		}
	}
}
</script>

<style></style>
