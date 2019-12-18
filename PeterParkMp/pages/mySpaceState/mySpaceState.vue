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
				user:{},
				space_id:0,
				parkingSpaceEntityId:0
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
					that.space_id = res.data.Parkingspaceowner[0].parking_space_id;
					that.user = res.data.Parkingspaceowner[0];
					that.id = res.data.Parkingspaceowner[0].id;
					//console.log("rentState+"+that.rentState);
					//console.log("id:"+id);
					 uni.request({
						url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspace/?Parkingspace.parking_space_id='+that.space_id,
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
						//parkingspace_owner_id:userInfo.parkingspace_owner_id,
						license_plate : userInfo.license_plate,
						parking_space_id:userInfo.parking_space_id,
						in_black_list:userInfo.in_black_list,
						user_name:userInfo.user_name,
						parking_space_rent:1,
						parkinglot_user_state:userInfo.parkinglot_user_state
					},
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type' : 'application/json'
					},
					success: (res) => {
							console.log("put rent state to 1 succes");
						
							
						},
						fail(err) {
									console.log("err： ");
									console.log(err);
								}
					});
				let parkingSpaceInfo = {};
				await uni.request({
					url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspace/?Parkingspace.parking_space_id='+that.space_id,
					method:'GET',
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type' : 'application/json'
					},
					success: (res) => {
							console.log("ParkingSpaceInfo:");	
							parkingSpaceInfo = res.data.Parkingspace[0];
							console.log(parkingSpaceInfo);
							that.parkingSpaceEntityId = parkingSpaceInfo.id;
							uni.request({
								url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspace/'+that.parkingSpaceEntityId,
								method:'PUT',
								data:{
									//parkingspace_owner_id:userInfo.parkingspace_owner_id,
									parking_space_id : parkingSpaceInfo.parking_space_id,
									parking_space_location:parkingSpaceInfo.parking_space_location,
									parking_space_owner:parkingSpaceInfo.parking_space_owner,
									parking_space_state:0
								},
								header: {
									'custom-header': 'hello', //自定义请求头信息
									'content-type' : 'application/json'
								},
								success: (res) => {
										console.log("put parking space state to 0 succes");
									
										
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
				this.rentState = 1;
			},
			async stopRent(){
				let that = this;
				let userInfo = that.user;
				await uni.request({
					url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspaceowner/'+that.id,
					method:'PUT',
					data:{
						//parkingspace_owner_id:userInfo.parkingspace_owner_id,
						license_plate : userInfo.license_plate,
						parking_space_id:userInfo.parking_space_id,
						in_black_list:userInfo.in_black_list,
						user_name:userInfo.user_name,
						parking_space_rent:0,
						parkinglot_user_state:userInfo.parkinglot_user_state
					},
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type' : 'application/json'
					},
					success: (res) => {
							console.log("put rent state to 0 succes");				
						},
						fail(err) {
									console.log("err： ");
									console.log(err);
								}
					});
				let parkingSpaceInfo = {};
				await uni.request({
					url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspace/?Parkingspace.parking_space_id='+that.space_id,
					method:'GET',
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type' : 'application/json'
					},
					success: (res) => {
							console.log("ParkingSpaceInfo:");	
							parkingSpaceInfo = res.data.Parkingspace[0];
							console.log(parkingSpaceInfo);
							that.parkingSpaceEntityId = parkingSpaceInfo.id;
							uni.request({
												url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspace/'+that.parkingSpaceEntityId,
												method:'PUT',
												data:{
													//parkingspace_owner_id:userInfo.parkingspace_owner_id,
													parking_space_id : parkingSpaceInfo.parking_space_id,
													parking_space_location:parkingSpaceInfo.parking_space_location,
													parking_space_owner:parkingSpaceInfo.parking_space_owner,
													parking_space_state:1
												},
												header: {
													'custom-header': 'hello', //自定义请求头信息
													'content-type' : 'application/json'
												},
												success: (res) => {
														console.log("put parking space state to 1 succes");
													
														
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
				 
				this.rentState = 0;
			}
		}
	}
</script>

<style>

</style>
