import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: false,
        hasLogin: false,
        userName: "",
		userAvatar: "",
		userAuth:"",
		licensePlate:"",
		orderId:0
    },
    mutations: {
        async login(state, userInfoSet) {
            state.userName = userInfoSet.userName || '新用户';
            state.hasLogin = true;
			state.userAvatar=userInfoSet.userAvatar;
			/**
			 * 检测用户身份，判断是业主还是普通用户
			 * 如果用户数据不在服务器中,将用户数据添加到服务器
			 */
			try{
				await uni.request({
						url:'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/User/?User.user_name='+state.userName, 
						method:'GET',	
						header: {
							'custom-header': 'hello' //自定义请求头信息						
						},								
						success: (res) => {
							if(res.data.Parkingspaceowner == undefined){
								if(res.data.Parkinglotuser == undefined){
									console.log("查无此用户");
									uni.request({
												url:"http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/", 
										 		method:'POST',
												data: {
														user_name:state.userName,
														in_black_list:0
													},
												header: {
													'custom-header': 'hello', //自定义请求头信息		
													'content-type' : 'application/json'
												},								
												success: (res) => {
													//console.log("从服务器取用户信息： ");
													//console.log(res);
													//console.log(res.data);
													//state.userAuth = "Parkinglotuser";
												},
												fail(err) {
													console.log("err： ");
													console.log(err);
												}
											});
								}else{/**
								 * 取车牌信息
								 */
									if(res.data.Parkinglotuser[0].license_plate == undefined){
										console.log("没有车牌信息");
									}else{
										state.licensePlate = res.data.Parkinglotuser[0].license_plate;
										//console.log(state.licensePlate);
									}
									}
								state.userAuth = "Parkinglotuser";								
							}else{
								console.log(res.data.Parkingspaceowner[0]);
								if(res.data.Parkingspaceowner[0].license_plate == undefined){
									console.log("没有车牌信息");
								}else{
									state.licensePlate = res.data.Parkingspaceowner[0].license_plate;
									//console.log(res.data.)
								}
								state.userAuth="parkingSpaceOwner";
							}
						
						},
						fail(err) {
							console.log("err： ");
							console.log(err);
						}
					});
			}catch(e){
				//TODO handle the exception
				console.log("exception2: "+e);
			}	
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
			state.userAvatar="";
			state.userAuth="";
			state.orderId=0;
        },
		updateOrderId(state,orderId){
			state.orderId=orderId;
		}
    }
})

export default store
