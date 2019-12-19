<template>
	<view>
		<view class="cu-list menu-avatar">
			<view class="padding cu-item " >						
				<view class="cu-avatar lg radius" :style="'background-image:url('+userAvatar+')'" ></view>
				<view class="content" style="text-align:center">
					<view class="text-green text-lg " >
						<text class="xl text-green cuIcon-weixin"></text>
						{{ userName }}
					</view>	
					<view class="flex">
						<text class="xl text-green cuIcon-people"></text>
						<text v-if="userAuth == 'parkingSpaceOwner'" class="text-green text-lg ">Auth:业主</text>
						<text v-if="userAuth == 'Parkinglotuser'" class="text-green text-lg ">Auth:停车用户</text>
					</view>
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
				<view  class="cu-item" v-for="(item3,index3) in parkingList" :key="index3" @tap="switchtoitem(item3.navigator)">
					<view class="content">
						<text class="text-black">{{item3.name}}</text>
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
