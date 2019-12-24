<template>
	<view class="contact text-gray">
		<view></view>
		<view>
			<text >Contact Us\n</text>
			<text class="text-bold cuIcon-mail">\t</text>
			<text>peterpark@sjtu.edu.cn\n</text>
			<text class="text-bold cuIcon-weixin">\t</text>
			<text>WeChat ID: peterpark\n</text>
		</view>
		<view></view>
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

<style>
	.contact{
		min-height:100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		align-content: stretch;
		background-color: #FFFFFF;
	}
</style>
