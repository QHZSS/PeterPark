<template>
	<view v-if="userState==1">
		<view class="cu-bar bg-white flex">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 停车场地图
			</view>
		</view>
		<view class="map">
			<view class="row" v-for="(row,index) in map" :key="index">
				<view class="col" v-for="(ele,eIndex) in row" :key="eIndex">
					<view class="col solid" :class="'bg-'+ groundColor(ele)">
						<text v-if="ele>=1">{{getParkingSpaceId(ele)}}</text>
					</view>
				</view>
			</view>
		</view>
		<button @tap="loadParkingSpace">加载停车位信息</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'userAvatar']),
		data() {
			return {
				parkingUserInfo: Object,
				count: 0,
				userState: 1,
				map: this.map,
				parkingSpace: {}
			}
		},
		watch: {
			'parkingUserInfo.parkinglot_user_state': function(val, oldVal) {
				if (oldVal == 0 && val == 1) {
					uni.showModal({
						title: '提示',
						content: '您已进入停车场',
					});
					this.userState = 1;
				} else if (oldVal == 0 && val == 2) {
					uni.showModal({
						title: '提示',
						content: '您的账号信息在黑名单中，禁止停车',
					});
					this.userState = -1;
				}

			}
		},
		onShow() {
			// if (this.hasLogin) {
			// 	while (this.count < 1000) {
			// 		setTimeout(() => {
			// 			if (this.userState == 0) {
			// 				uni.request({
			// 					url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/?Parkinglotuser.parkinglot_user_id=45', //仅为示例，并非真实接口地址。
			// 					data: {},
			// 					header: {
			// 						'custom-header': 'hello' //自定义请求头信息
			// 					},
			// 					success: (res) => {
			// 						this.parkingUserInfo = res.data.Parkinglotuser[0];
			// 						console.log(this.parkingUserInfo);
			// 					}
			// 				});
			// 			}
			// 		}, this.count * 1000);

			// 		this.count += 1;

			// 	}
			// }
		},
		methods: {
			groundColor(ele) {
				let index = ele;
				if (index < 0) {
					return 'black';
				} else if (index == 0) {
					return 'white';
				} else if (index >= 1) {
					if (index >= 15) {
						index += 1;
					};
					let state = this.parkingSpace[index - 1].parking_space_state;
					if (state == '1') {
						return 'green';
					} else {
						return 'red';
					};
				}
			},
			loadParkingSpace() {
				uni.request({
					url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspace/',
					success: (res) => {
						this.parkingSpace = res.data.Parkingspace;
					}
				});
			},
			getParkingSpaceId(ele) {
				let index = ele;
				if (index <= 0) {
					return "";
				}
				if (index >= 15) {
					index += 1;
				}
				return index >= 16 ? (this.parkingSpace[index - 1].parking_space_id - 1) : this.parkingSpace[index - 1].parking_space_id;

			}
		},
	}
</script>

<style>
	.map {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		flex-direction: row;
	}

	.col {
		flex: 1 1 40rpx;

		height: 75rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
</style>
