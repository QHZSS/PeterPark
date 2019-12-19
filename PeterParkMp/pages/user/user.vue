<template>
<view>
    <view class="content">
		<userInfoBar></userInfoBar>
		<view v-if="licensePlate == ''">
			<view class="action">
				<text class="cuIcon-title text-orange"></text>
				车牌
				<input placeholder="请输入您的车牌" v-model="newlicenseplate" name="input"></input>
			</view>
			<button @tap="bindLicensePlate" type="default">绑定车牌</button>
		</view>
		<view v-else>
			<view class="cu-list ">
				<view class="padding cu-item " >							
					<view class="content" style="text-align:center">
						<view class="text-blue text-lg " >
							<text class="xl text-blue cuIcon-emoji"></text>
							<text>车牌:{{licensePlate}}</text>
						</view>	
					</view>
				</view>
			</view>
			
		</view>	
        <view class="btn-row">
            <button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">
				<text class="text-blue text-lg " >登录</text></button>
            <button v-if="hasLogin" type="default" @tap="bindLogout"><text class="text-blue text-lg " >退出登录</text></button>
        </view>
		
    </view>
</view>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
	import userInfoBar from '../../components/userinfobar/userinfobar.vue'
    export default {
		data() {
			return {
				newlicenseplate:""
			}
		},
        computed: {
            ...mapState(['hasLogin', 'forcedLogin','licensePlate','userAuth','userName','userAvatar'])
        },
        methods: {
            ...mapMutations(['logout']),
            bindLogin() {
                uni.navigateTo({
                    url: '../login/login',
                });
            },
            bindLogout() {
                this.logout();
                /**
                 * 如果需要强制登录跳转回登录页面
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../login/login',
                    });
                }
            },
			async bindLicensePlate(){
				let plate = this.newlicenseplate;
				console.log(plate);
				await uni.request({
						url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/User/?User.user_name='+this.userName, 
						method:'GET',	
						header: {
							'custom-header': 'hello' //自定义请求头信息						
						},								
						success: (res) => {
							if(this.userAuth == "Parkinglotuser"){
								let user =res.data.Parkinglotuser[0];
								let id = user.id;
								let in_black_list = user.in_black_list;
								let user_name = user.user_name;
								let license_plate = plate;
								let parkinglot_user_state = 0;
								uni.request({
									url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark2/Parkinglotuser/'+id,
									method:'PUT',
									data:{
										in_black_list:in_black_list,
										user_name : user_name,
										license_plate:license_plate,
										parkinglot_user_state:parkinglot_user_state
									},
									header: {
										'custom-header': 'hello', //自定义请求头信息
										'content-type' : 'application/json'
									},
								})
							}else{
								//console.log(res.data.Parkingspaceowner[0]);
								console.log("请联系管理员添加车牌等信息");
								wx.showModal({
								         title: '提示',
								         content: '请联系管理员添加车牌等信息',
								         success: function (res) {
								             if (res.confirm) {
								                 console.log('用户点击确定')
								             }else{
								                console.log('用户点击取消')
								             }
													 
								         }
								     })
							}
							
							},
						fail(err) {
							console.log("err： ");
							console.log(err);
						}
					});
					}
        },
		components: {
			userInfoBar
		}
    }
</script>

<style>

</style>
