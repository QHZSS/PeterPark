<template>
	<view>
		MySpaceState
		<view v-if = "rentState == 0">
			您未出租您的车位
			<button @tap="startRent">车位出租</button>
		</view>
		<view v-else>
			您已出租您的车位
			您的车位目前的状态是
			<view v-if="spaceState == 0 ">车位目前有车</view>
			<view v-if="spaceState == 1 ">车位目前空闲</view>
			<button @tap="stopRent">停止出租</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	
	export default {
		computed: {
		    ...mapState(['licensePlate','userName'])
		},
		data() {
			return {
				rentState:3,
				spaceState:3,
				id:0,
				user:{}
			}
		},
		async onLoad() {
			let that = this;
			await uni.request({
				url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/User/?User.user_name='+this.userName,
				method:'GET',
				header: {
					'custom-header': 'hello' //自定义请求头信息						
				},
				success: (res) => {
					console.log(res.data);
					that.rentState = res.data.Parkingspaceowner[0].parking_space_rent;
					let space_id = res.data.Parkingspaceowner[0].parking_space_id;
					that.user = res.data.Parkingspaceowner[0];
					that.id = res.data.Parkingspaceowner[0].id;
					//console.log("rentState+"+that.rentState);
					//console.log("id:"+id);
					 uni.request({
						url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspace/?Parkingspace.parking_space_id='+space_id,
						method:'GET',
						header: {
							'custom-header': 'hello' //自定义请求头信息						
						},
						success: (res) => {
							console.log("parking_space_state:");
							that.spaceState=res.data.Parkingspace[0].parking_space_state;
						
							
						},
						fail(err) {
									console.log("err： ");
									console.log(err);
								}
					});
				},
				fail(err) {
							console.log("err： ");
							console.log(err);
						}
			});
		},

		methods: {
			async startRent(){
				let that = this;
				let userInfo = that.user;
				await uni.request({
					url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspaceowner/'+that.id,
					method:'PUT',
					data:{
						parkingspace_owner_id:userInfo.parkingspace_owner_id,
						license_plate : userInfo.license_plate,
						parking_space_id:userInfo.parking_space_id,
						in_black_list:userInfo.in_black_list,
						user_name:userInfo.user_name,
						parking_space_rent:1
					},
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type' : 'application/json'
					},
				});
				this.rentState = 1;
			},
			async stopRent(){
				let that = this;
				let userInfo = that.user;
				await uni.request({
					url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspaceowner/'+that.id,
					method:'PUT',
					data:{
						parkingspace_owner_id:userInfo.parkingspace_owner_id,
						license_plate : userInfo.license_plate,
						parking_space_id:userInfo.parking_space_id,
						in_black_list:userInfo.in_black_list,
						user_name:userInfo.user_name,
						parking_space_rent:0
					},
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type' : 'application/json'
					},
				});
				this.rentState = 0;
			}
		}
	}
</script>

<style>

</style>
