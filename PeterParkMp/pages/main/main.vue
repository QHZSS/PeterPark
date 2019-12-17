<template>
	<view >
		<scroll-view scroll-y class="DrawerPage" :class="modalName=='viewModal'?'show':''">			
			<view class="content">
				<view v-if="hasLogin" class="hello">
					<view class="title">
						您好 {{userName}}，您已成功登录，欢迎使用PeterPark小程序。
						请点击头像进入菜单
						您的身份是{{userAuth}}
					</view>
					<view class="padding">
						<view class="cu-avatar xl round" :style="'background-image:url('+userAvatar+')'" @tap="showModal" data-target="viewModal"></view>
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
		</scroll-view>
		<view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
			<text class="cuIcon-pullright"></text>
		</view>
		<scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">
			<view class="cu-list menu">
				<view class="cu-item" v-for="(item1,index1) in menuList" :key="index1" @tap="navigator(item1.navigator)">
					<view class="content">
						<text class="text-black">{{item1.name}}</text>
					</view>
				</view>
				<view v-if="userAuth ==='parkingSpaceOwner'" class="cu-item" v-for="(item2,index2) in parkingSpaceOwnerList" :key="index2" @tap="switchtoitem(item2.navigator)">
					<view class="content">
						<text class="text-black">{{item2.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'userAvatar',"userAuth"]),
		data() {
			return {
				modalName:null,
				menuList:[
					{
						name:"停车位导航",
						navigator:"navigation"
					},
					
				],
				parkingSpaceOwnerList:[
					{
						name:"停车位状态查看",
						navigator:"mySpaceState"
					},
					
				]
			}
		},
		async onLoad() {
			//console.log("hasLogin"+this.hasLogin);
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
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			navigator(direction){
				uni.switchTab({
					url:"../"+direction+"/"+direction
				});
				this.modalName = null
			},
			switchtoitem(direction){
				uni.redirectTo({
					url:"../"+direction+"/"+direction
				});
				this.modalName = null
			}
		},
	}
</script>

<style>
	page {
		background-image: var(--gradualBlue);
		width: 100vw;
		overflow: hidden;
	}
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
	}.DrawerPage {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0vw;
		background-color: #f1f1f1;
		transition: all 0.4s;
	}

	.DrawerPage.show {
		transform: scale(0.9, 0.9);
		left: 85vw;
		box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
	}

	.DrawerWindow {
		position: absolute;
		width: 85vw;
		height: 100vh;
		left: 0;
		top: 0;
		transform: scale(0.9, 0.9) translateX(-100%);
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
		padding: 100upx 0;
	}

	.DrawerWindow.show {
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}

	.DrawerClose {
		position: absolute;
		width: 40vw;
		height: 100vh;
		right: 0;
		top: 0;
		color: transparent;
		padding-bottom: 30upx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
		letter-spacing: 5px;
		font-size: 50upx;
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}

	.DrawerClose.show {
		opacity: 1;
		pointer-events: all;
		width: 15vw;
		color: #fff;
	}

	.DrawerPage .cu-bar.tabbar .action button.cuIcon {
		width: 64upx;
		height: 64upx;
		line-height: 64upx;
		margin: 0;
		display: inline-block;
	}

	.DrawerPage .cu-bar.tabbar .action .cu-avatar {
		margin: 0;
	}

	.DrawerPage .nav {
		flex: 1;
	}

	.DrawerPage .nav .cu-item.cur {
		border-bottom: 0;
		position: relative;
	}

	.DrawerPage .nav .cu-item.cur::after {
		content: "";
		width: 10upx;
		height: 10upx;
		background-color: currentColor;
		position: absolute;
		bottom: 10upx;
		border-radius: 10upx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.DrawerPage .cu-bar.tabbar .action {
		flex: initial;
	}
</style>
