<template>
	<view>
		<view class="cu-bar bg-white flex">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 停车场地图
			</view>
		</view>
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
				flag: false
			}
		},
		watch: {
			'parkingUserInfo.parkinglot_user_state': function(val, oldVal) {
				if (oldVal == 0 && val == 1) {
					uni.showModal({
						title: '提示',
						content: '您已进入停车场',
					});
					this.flag = true;
				} else if (oldVal == 0 && val == 2) {
					uni.showModal({
						title: '提示',
						content: '您的账号信息在黑名单中，禁止停车',
					});
					this.flag = true;
				}

			}
		},
		onShow() {
			// if (this.hasLogin) {
			// 	while (this.count < 1000) {
			// 		setTimeout(() => {
			// 			if (!this.flag) {
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

		}
	}
</script>

<style>

</style>
