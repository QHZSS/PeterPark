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
	export default {
		data() {
			return {

			}
		},
		onLoad() {
			setTimeout(function() {
				uni.switchTab({
					url: '../main/main',
					animationType: 'fade-in'
				})
			}, 2000);

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
