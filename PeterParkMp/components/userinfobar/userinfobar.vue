<template>
	<view>
		<view class="cu-list menu-avatar">
			<view class="padding cu-item " >						
				<view class="cu-avatar lg radius" :style="'background-image:url('+userAvatar+')'" ></view>
				<view class="content" style="text-align:center">
					<view class="text-blue text-lg " >
						<text class="xl text-green cuIcon-weixin"></text>
						{{ userName }}
					</view>	
					<view class="flex">
						<text class="xl text-blue cuIcon-people"></text>
						<text v-if="userAuth == 'parkingSpaceOwner'" class="text-blue text-lg ">Auth:业主</text>
						<text v-if="userAuth == 'Parkinglotuser'" class="text-blue text-lg ">Auth:停车用户</text>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
	    mapState
	} from 'vuex'
	export default {
		computed: {
		    ...mapState(['userAuth','userName','userAvatar'])
		},
		data() {
			return {
				}
			
		},
		methods: {
			
		}
	}
</script>

<style>
</style>
