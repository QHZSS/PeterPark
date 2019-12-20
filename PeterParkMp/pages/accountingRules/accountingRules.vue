<template>
	<view class="bg-white rule">
		<view class="rule-title">
			<text class="text-bold">停车场收费如下：</text>
		</view>
		<view class="rule-text">
			<text class="text-bold cuIcon-check">\t</text>
			<text>2小时内，每小时10元</text>
		</view>
		<view class="rule-text">
			<text class="text-bold cuIcon-check">\t</text>
			<text>超过2小时但小于5小时部分，每小时7元</text>
		</view>
		<view class="rule-text">
			<text class="text-bold cuIcon-check">\t</text>
			<text>超过5小时的部分，每小时5元</text>
		</view>
		<view class="rule-text">
			<text class="text-bold cuIcon-check">\t</text>
			<text>每日停车收费上限为41元</text>
		</view>
		<view class="rule-text">
			<text class="text-bold cuIcon-check">\t</text>
			<text>每停车24h后，作为新的一天计算</text>
		</view>
		<view class="rule-text">
			<text class="text-bold cuIcon-check">\t</text>
			<text>最终解释权归PeterPark所有</text>
		</view>
		<view class="rule-text">
			<text class="text-bold cuIcon-check">\t</text>
			<text>祝您停车愉快！</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style >
	.rule{
		display: flex;
		flex-direction:column;
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #FFFFFF;
	}
	.rule-title{
		flex: auto;
		font-size: 62upx;
		padding-left: 40upx;
		margin-top: 70upx;
		color: #5CACEE;
		text-align:left;
		margin-bottom: 70upx;
	}
	.rule-text{
		flex: auto;
		font-size: 35upx;
		color: #5CACEE;
		padding-left: 80upx;
		margin-top: 10upx;
		margin-bottom: 10upx;
	}
</style>
