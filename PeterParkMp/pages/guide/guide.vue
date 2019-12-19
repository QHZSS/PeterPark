<template>
	<view class="bg-white guide">
		<view class="guide-image">
			<image src="../../static/img/navigaHL.png" mode="aspectFit"></image>
		</view>
		<view class="guide-text">
			<text class="text-bold">PeterPark</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: mapState(['firstEntry']),
		data() {
			return {

			}
		},
		onLoad() {
			if(this.firstEntry){
				setTimeout(function() {
					uni.switchTab({
						url: '../main/main',
						animationType: 'fade-in'
					})
				}, 2000);
				this.updatefirstEntry(false);
			}else{
				uni.switchTab({
					url: '../main/main',
					animationType: 'fade-in'
				})
			}
			

		},
		methods:{
			...mapMutations(['updatefirstEntry'])
		}
	}
</script>

<style scoped>
	.guide{
		min-height:100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		align-content: stretch;
	}
	.guide-image{
		margin-top: 20vh;
		flex: auto;
	}
	.guide-text{
		flex: auto;
		font-size: 60rpx;
		color: #5CACEE;
	}
</style>
