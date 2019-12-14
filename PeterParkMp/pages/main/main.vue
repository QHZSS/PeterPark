<template>
	<view class="content">
		<view v-if="hasLogin" class="hello">
			<view class="title">
				您好 {{userName}}，您已成功登录。
			</view>
			<view class="padding">
				<view class="cu-avatar sm round" :style="'background-image:url('+userAvatar+')'"></view>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-grey lg" @tap="SendMsg">模拟发送停车用户信息</button>
				<button class="cu-btn bg-red margin-tb-sm lg">停车位租赁</button>
			</view>
		</view>
		<view v-if="!hasLogin" class="hello">
			<view class="title">
				您好 游客。
			</view>
			<view class="ul">
				<view>这是 uni-app 带登录模板的示例App首页。</view>
				<view>在 “我的” 中点击 “登录” 可以 “登录您的账户”</view>
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
				parkingUserInfo: Object
			}
		},
		watch: {
			'parkingUserInfo.parkinglot_user_state': function(val, oldVal) {
				if (oldVal != null) {
					uni.showModal({
					    title: '提示',
					    content: '您已进入停车场',
					});
				}
				
			}
		},
		onShow() {
			let count = 0;
			if (this.hasLogin) {
				while (count < 1000) {
					setTimeout(() => {
						uni.request({
							url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/?Parkinglotuser.parkinglot_user_id=45', //仅为示例，并非真实接口地址。
							data: {},
							header: {
								'custom-header': 'hello' //自定义请求头信息
							},
							success: (res) => {
								this.parkingUserInfo = res.data.Parkinglotuser[0];
							}
						});
					}, count * 1000);
					count += 1;
				}

			}
		},
		onLoad() {
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: (res) => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					}
				});
			}
		}
	}
</script>

<style>
	.hello {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.title {
		color: #8f8f94;
		margin-top: 50upx;
	}

	.ul {
		font-size: 30upx;
		color: #8f8f94;
		margin-top: 50upx;
	}

	.ul>view {
		line-height: 50upx;
	}
</style>
