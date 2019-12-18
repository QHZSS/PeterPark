# PeterPark
An intellegent parking system

#### 目前要开发的功能:
+ 用户登录
（从数据库读取用户信息及车牌信息）检测是不是业主，是业主多两个功能条
+ 绑定车牌
（用户登陆时候取的数据是否有车牌信息，如果有则展示，如果没有则提示绑定，存入数据库）
+ 检测用户权限
    postmen 发车牌信息，改user表对应车牌state,到后台
    两边监听user表到state，请求用户数据，判断用户是否有权限
    有权限则进入停车场（两边都跳提醒某某车牌、某某用户）进入停车场，改user状态，改parking order（start time）
    无权限则两边都跳提醒某某车牌、某某用户）不能进入停车场，改user的状态
+ 导航
停车场图放前端存，前端算法推荐车位导航，划线。
停好了postmen发消息改order，user的state，parkingspace表端state为不可用，存车位

+ 检测用户离开停车场（两边都跳提醒某某车牌、某某用户）离开停车场
postmen 发车牌信息，改user表对应车牌state,到后台
改user状态，改parking order，parkingspace表端state为可用状态
小程序监听到离开，计算价格，改order里面金额，并弹窗用户支付
+ 模拟支付
用户支付后，改order状态

+ 出租车位
业主申请出租，parkingspace表端state，把state改成可用
小程序端有一个页面可以看自己的车位状态

+ 发送问候语
车进入后，web端可以点击发送可编辑消息，改插入message到后端
小程序端监听message，展示。

+ 增删改查用户信息（里面有黑名单）
+ 查、删parking order
+ 改查parking space



#### 候选：
+ 小程序用户没事看看停车位状态
+ 统计

#### web端
1.  进入停车场
2.  离开停车场
12各搞一个框，实时更新
+ 增删改查用户信息（里面有黑名单）
+ 查、删parking order
+ 改查parking space
+ 发送问候语


#### 小程序端
1. 用户登录
2. 绑定车牌
3. 进入停车场
4. 导航
5. 模拟支付
6. 离开停车场
7. 收问候语

业主
+ 出租车位
+ 查看车位状态



### 关于监听器

众所周知，我们要实现的功能中有很多地方需要监听后台BPM服务器的数据库中数据的变化，但是由于他这样的服务器设计导致在前端没法用其他的例如socket方法和eventSource的方法来进行监听，只能通过自己编写监听代码，在PeterParkMp/pages/main.vue中已经写了一个监听器的demo:

首先，在onShow生命周期钩子中实现循环Http请求，这是目前暂时的解决方法，一秒请求一次，每次将请求得到的数据存到相应的局部变量中，这里是parkingUserInfo:

```js
data() {
	return {
		parkingUserInfo: Object
	}
},
onShow() {
	let count = 0;
	if (this.hasLogin) {
		while (count < 1000) {
			setTimeout(() => {
				uni.request({
					url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/?Parkinglotuser.parkinglot_user_id=45',
					data: {},
					header: {
						'custom-header': 'hello'
					},
					success: (res) => {
						this.parkingUserInfo = res.data.Parkinglotuser[0];
					}
				});
			}, count * 1000);
			count += 1;
		}

	}
}
```

在watch函数中，监听parkingUserInfo的子属性parkinglot_user_state的数值变化，监听到state变为1，则弹出已进入停车场的提示，可进入下一步导航等操作

```javascript
watch: {
	'parkingUserInfo.parkinglot_user_state': function(val, oldVal) {
		if (oldVal != null && val == 1) {
			uni.showModal({
				title: '提示',
				content: '您已进入停车场',
			});
		}
	}
},
```
### 关于数据的约定
#### Parkingspaceowner
+ role：parkingSpaceOwner 业主
+ parking_space_id：1 以数字表示，不带字母
+ in_black_list:0 0代表不在黑名单，1代表在黑名单
+ parking_space_rent: 0代表未出租，1代表已出租

#### User

+ state: 
-0：用户远离停车场或刚刚离开停车场 
-1:用户在停车场道闸附近等待进入 
-2:用户在停车场内 

#### parking order
+ state 1:用户在车位 2:用户离开但还未支付 3:用户已支付 0（可选）:订单开始但是用户还未停车

#### Parkinglot
+ state 1:车位可用 0:车位不可用（未出租或有车）

#### 全局变量
+ userAuth: 业主：parkingSpaceOwner 非业主：Parkinglotuser
+ licensePlate: 如果没有牌照信息就是 ""
