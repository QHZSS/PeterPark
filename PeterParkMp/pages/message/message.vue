<template>
	<view>
		<view class="cu-chat">
			<view  v-for="(item,index) in messageList" v-bind:item="item" v-bind:index="index" v-bind:key="index" class="cu-item">
					<view  class="cu-avatar radius" style="background-image:url('../../static/img/spider.jpg')"></view>
					<view class="main">
						<view class="content shadow">
							<text>{{item.message}}</text>
						</view>
					</view>
			</view>
		</view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow">发送</button>
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	
	export default {	
		data() {
			return {
				InputBottom: 0,
				messageList:[],
				page_show:0
			};
		},
		computed: mapState(['licensePlate','hasLogin','userAvatar']),
		onShow() {
			let count = 0;
			let that = this;
			this.page_show = 1;
			if (this.hasLogin) {
				while (count < 1000) {
					setTimeout(() => {
						if(this.page_show == 1){
							uni.request({
								url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Message/?Message.license_plate='+this.licensePlate,
								header: {
									'custom-header': 'hello'
								},
								success: (res) => {
									that.messageList = res.data.Message;
									for(let item in that.messageList){
										console.log(that.messageList[item].message);
									}
								}
							});
						}
					}, count * 5000);
					count += 1;
				}
		
			}
		},
		onHide() {
			this.page_show = 0;
		},
		onUnload() {
			this.page_show = 0;
		},
		methods: {
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			}
		}
	}
</script>

<style>
page{
  padding-bottom: 100upx;
}
</style>
