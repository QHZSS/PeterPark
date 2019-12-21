<template>
	<view class="space-view bg-white">
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-myfill text-blue"></text>
					<text class="text-blue">您的车位编号：</text>
					<text class="text-blue">{{ space_id }}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-infofill text-blue"></text>
					<text class="text-blue" v-if="rentState == 0">您未出租您的车位</text>
					<text class="text-blue" v-else>您已出租您的车位</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-infofill text-blue"></text>
					<text class="text-blue">您的车位状态：</text>
					<text class="text-blue" v-if="spaceState == 0 && rentState == 1">车位目前有车</text>
					<text class="text-blue" v-if="spaceState == 1 && rentState == 1">车位目前空闲</text>
					<text class="text-blue" v-if="rentState == 0">车位未出租</text>
				</view>
			</view>
		</view>

		<button class="cu-btn bg-blue lg space-button" @tap="startRent" v-if="rentState == 0">车位出租</button>
		<button class="cu-btn bg-blue lg space-button" @tap="stopRent" v-if="rentState == 1">停止出租</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		computed: {
			...mapState(['licensePlate', 'userName'])
		},
		data() {
			return {
				rentState: 3,
				spaceState: 3,
				id: 0,
				user: {},
				space_id: 0,
				parkingSpaceEntityId: 0
			}
		},
		async onLoad() {
			let that = this;
			await uni.request({
				url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/User/?User.user_name=' + this.userName,
				method: 'GET',
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
						url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/Parkingspace/?Parkingspace.parking_space_id=' +
							that.space_id,
						method: 'GET',
						header: {
							'custom-header': 'hello' //自定义请求头信息						
						},
						success: (res) => {
							console.log("parking_space_state:");
							that.spaceState = res.data.Parkingspace[0].parking_space_state;


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
			async startRent() {
				let that = this;
				let userInfo = that.user;
				await uni.request({
					url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/Parkingspaceowner/' + that.id,
					method: 'PUT',
					data: {
						//parkingspace_owner_id:userInfo.parkingspace_owner_id,
						license_plate: userInfo.license_plate,
						parking_space_id: userInfo.parking_space_id,
						in_black_list: userInfo.in_black_list,
						user_name: userInfo.user_name,
						parking_space_rent: 1,
						parkingspace_owner_state: userInfo.parkingspace_owner_state
					},
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type': 'application/json'
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
					url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/Parkingspace/?Parkingspace.parking_space_id=' +
						that.space_id,
					method: 'GET',
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log("ParkingSpaceInfo:");
						parkingSpaceInfo = res.data.Parkingspace[0];
						console.log(parkingSpaceInfo);
						that.parkingSpaceEntityId = parkingSpaceInfo.id;
						uni.request({
							url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/Parkingspace/' + that.parkingSpaceEntityId,
							method: 'PUT',
							data: {
								//parkingspace_owner_id:userInfo.parkingspace_owner_id,
								parking_space_id: parkingSpaceInfo.parking_space_id,
								parking_space_location: parkingSpaceInfo.parking_space_location,
								parking_space_owner: parkingSpaceInfo.parking_space_owner,
								parking_space_state: 1
							},
							header: {
								'custom-header': 'hello', //自定义请求头信息
								'content-type': 'application/json'
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
				this.rentState = 1;
			},
			async stopRent() {
				let that = this;
				let userInfo = that.user;
				await uni.request({
					url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/Parkingspaceowner/' + that.id,
					method: 'PUT',
					data: {
						//parkingspace_owner_id:userInfo.parkingspace_owner_id,
						license_plate: userInfo.license_plate,
						parking_space_id: userInfo.parking_space_id,
						in_black_list: userInfo.in_black_list,
						user_name: userInfo.user_name,
						parking_space_rent: 0,
						parkingspace_owner_state: userInfo.parkingspace_owner_state
					},
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type': 'application/json'
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
					url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/Parkingspace/?Parkingspace.parking_space_id=' +
						that.space_id,
					method: 'GET',
					header: {
						'custom-header': 'hello', //自定义请求头信息
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log("ParkingSpaceInfo:");
						parkingSpaceInfo = res.data.Parkingspace[0];
						console.log(parkingSpaceInfo);
						that.parkingSpaceEntityId = parkingSpaceInfo.id;
						uni.request({
							url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/Parkingspace/' + that.parkingSpaceEntityId,
							method: 'PUT',
							data: {
								//parkingspace_owner_id:userInfo.parkingspace_owner_id,
								parking_space_id: parkingSpaceInfo.parking_space_id,
								parking_space_location: parkingSpaceInfo.parking_space_location,
								parking_space_owner: parkingSpaceInfo.parking_space_owner,
								parking_space_state: 0
							},
							header: {
								'custom-header': 'hello', //自定义请求头信息
								'content-type': 'application/json'
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

				this.rentState = 0;
			}
		}
	}
</script>

<style scoped>
.space-view{
	min-height: 100vh;
}
.space-button{
	width: 100%;
}
</style>
