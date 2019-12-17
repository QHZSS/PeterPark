<template>
	<view v-if="userState == 1">
		<view class="cu-bar bg-white flex">
			<view class="action">
				<text class="cuIcon-title text-orange "></text>
				停车场地图
			</view>
		</view>
		<view class="map">
			<view class="row" v-for="(row, index) in map" :key="index">
				<view class="col" v-for="(ele, eIndex) in row" :key="eIndex">
					<view class="col solid" :class="'bg-' + groundColor(ele)" @tap="navigate(ele)">
						<text v-if="ele >= 1">{{ getParkingSpaceId(ele) }}</text>
					</view>
				</view>
			</view>
		</view>
		<button @tap="loadParkingSpace">加载停车位信息</button>
		<button @tap="Dijkstra">测试最短路径算法</button>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'userAvatar', 'userAuth']),
	data() {
		return {
			parkingUserInfo: Object,
			count: 0,
			userState: 1,
			map: this.map,
			parkingSpace: {},
			adjMatrix: [
				//邻接矩阵
				[0, 5, 10000, 10000, 4, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
				[5, 0, 5, 10000, 10000, 4, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
				[10000, 5, 0, 5, 10000, 10000, 4, 10000, 10000, 10000, 10000, 10000, 10000],
				[10000, 10000, 5, 0, 10000, 10000, 10000, 4, 10000, 10000, 10000, 10000, 10000],
				[4, 10000, 10000, 10000, 0, 5, 10000, 10000, 4, 10000, 10000, 10000, 10000],
				[10000, 4, 10000, 10000, 5, 0, 5, 10000, 10000, 4, 10000, 10000, 10000],
				[10000, 10000, 4, 10000, 10000, 5, 0, 5, 10000, 10000, 4, 10000, 10000],
				[10000, 10000, 10000, 4, 10000, 10000, 5, 0, 10000, 10000, 10000, 4, 10000],
				[10000, 10000, 10000, 10000, 4, 10000, 10000, 10000, 0, 5, 10000, 10000, 10000],
				[10000, 10000, 10000, 10000, 10000, 4, 10000, 10000, 5, 0, 5, 10000, 10000],
				[10000, 10000, 10000, 10000, 10000, 10000, 4, 10000, 10000, 5, 0, 5, 3],
				[10000, 10000, 10000, 10000, 10000, 10000, 10000, 4, 10000, 10000, 5, 0, 2],
				[10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 3, 2, 0]
			],
			numVertexes: 13, //定点数
			numEdges: 18, //边数
			pathMatrix: [],
			shortPathTable: [],
			path: [],
			road: this.road
		};
	},
	watch: {
		'parkingUserInfo.parkinglot_user_state': function(val, oldVal) {
			if (oldVal == 0 && val == 1) {
				uni.showModal({
					title: '提示',
					content: '您已进入停车场'
				});
				this.userState = 1;
			} else if (oldVal == 0 && val == 2) {
				uni.showModal({
					title: '提示',
					content: '您的账号信息在黑名单中，禁止停车'
				});
				this.userState = -1;
			}
		}
	},
	onShow() {
		// if (this.hasLogin) {
		// 	while (this.count < 1000) {
		// 		setTimeout(() => {
		// 			if (this.userState == 0) {
		// 				uni.request({
		// 					url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglotuser/?Parkinglotuser.parkinglot_user_id=45', //仅为示例，并非真实接口地址。
		// 					data: {},
		// 					header: {
		// 						'custom-header': 'hello' //自定义请求头信息
		// 					},
		// 					success: (res) => {
		// 						this.parkingUserInfo = res.data.Parkinglotuser[0];
		// 						console.log(this.parkingUserInfo);
		// 					}
		// 				});
		// 			}
		// 		}, this.count * 1000);
		// 		this.count += 1;
		// 	}
		// }
	},
	onLoad() {
		uni.request({
			url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspace/',
			success: res => {
				this.parkingSpace = res.data.Parkingspace;
			}
		});
	},
	methods: {
		groundColor(ele) {
			let index = ele;
			if (index == -1) {
				return 'black';
			} else if (index == -2) {
				console.log(index);
				return 'yellow';
			} else if (index == 0) {
				return 'white';
			} else if (index >= 1) {
				if (index >= 15) {
					index += 1;
				}
				if (this.parkingSpace[index - 1] == undefined) {
					return 'white';
				}
				let state = this.parkingSpace[index - 1].parking_space_state;
				if (state == '1') {
					return 'green';
				} else {
					return 'red';
				}
			}
		},
		loadParkingSpace() {
			uni.request({
				url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkingspace/',
				success: res => {
					this.parkingSpace = res.data.Parkingspace;
				}
			});
		},
		getParkingSpaceId(ele) {
			let index = ele;
			if (index <= 0) {
				return '';
			}
			if (index >= 15) {
				index += 1;
			}
			if (this.parkingSpace[index - 1] == undefined) {
				return '';
			}
			return index >= 16 ? this.parkingSpace[index - 1].parking_space_id - 1 : this.parkingSpace[index - 1].parking_space_id;
		},
		navigate(ele) {
			for (let i = this.path.length-1; i >1; i--) {
				let index=''+this.path[i]+this.path[i-1];
				let blockList=this.road.find(v=>v.index==index).blockList;
				console.log(blockList);
				for (let j=0;j<blockList.length-1;j++) {
					console.log(blockList[j]);
					this.map[blockList[j][0]][blockList[j][1]]=-2;
					console.log(this.map);
				}
				this.$forceUpdate();
			}
		},
		Dijkstra() {
			this.path = [];
			let k, min;
			let final = [];
			for (let v = 0; v < this.numVertexes; v++) {
				final[v] = 0;
				this.shortPathTable[v] = this.adjMatrix[0][v];
				this.pathMatrix[v] = 0;
			}
			this.shortPathTable[0] = 0;
			final[0] = 1;

			for (let v = 1; v < this.numVertexes; v++) {
				//初始化数据
				min = 10000;
				for (let w = 0; w < this.numVertexes; w++) {
					//寻找离V0最近的顶点
					if (!final[w] && this.shortPathTable[w] < min) {
						k = w;
						min = this.shortPathTable[w]; //w 顶点离V0顶点更近
					}
				}
				final[k] = 1; //将目前找到的最近的顶点置位1
				for (let w = 0; w < this.numVertexes; w++) {
					//修正当前最短路径及距离
					if (!final[w] && min + this.adjMatrix[k][w] < this.shortPathTable[w]) {
						//说明找到了更短的路径，修改Pathmatirx[w]和ShortPathTable[w]
						this.shortPathTable[w] = min + this.adjMatrix[k][w];
						this.pathMatrix[w] = k;
					}
				}
			}
			//打印最短路线
			let temp = 12;
			while (temp != 0) {
				this.path.push(temp);
				temp = this.pathMatrix[temp];
			}
			this.path.push(0);
			console.log(this.path);
		}
	}
};
</script>

<style>
.map {
	display: flex;
	flex-direction: column;
}

.row {
	display: flex;
	flex-direction: row;
}

.col {
	flex: 1 1 40rpx;

	height: 75rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>
