<template>
	<view>
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
						<view class="col solid" :class="'bg-' + groundColor(ele)" @tap="navigate(ele, index, eIndex)">
							<text v-if="ele > 900">{{ getParkingSpaceId(ele - 900) }}</text>
							<text v-else-if="ele >= 1">{{ getParkingSpaceId(ele) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else-if="userState == 0">欢迎来到PeterPark，当您进入停车场后，此页面会显示停车场地图及推荐位置，若您在PeterPark拥有车位，会优先导航到您自己的车位</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
const mod = [
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
	[10000, 10000, 10000, 10000, 10000, 10000, 4, 10000, 10000, 5, 0, 5, 10000],
	[10000, 10000, 10000, 10000, 10000, 10000, 10000, 4, 10000, 10000, 5, 0, 10000],
	[10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 0]
];
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'userAvatar', 'userAuth']),
	data() {
		return {
			parkingUserInfo: Object,
			count: 0,
			userState: 0,
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
				[10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 0]
			],
			mod,
			numVertexes: 13, //定点数
			numEdges: 18, //边数
			pathMatrix: [],
			shortPathTable: [],
			path: [],
			road: this.road,
			traffic: []
		};
	},
	watch: {
		'parkingUserInfo.parkinglot_user_state': function(val, oldVal) {
			if (oldVal == 0 && val == 1 && this.parkingUserInfo.in_black_list==0) {
				uni.showModal({
					title: '提示',
					content: '您已进入停车场，已为您推荐最优车位'
				});
				this.userState = 1;
			} else if (oldVal == 0 && val == 1  && this.parkingUserInfo.in_black_list==1) {
				uni.showModal({
					title: '提示',
					content: '您的账号信息在黑名单中，禁止停车'
				});
				this.userState = -1;
			}
		},
		'parkingUserInfo.parkingspace_owner_state': function(val, oldVal) {
			if (oldVal == 0 && val == 1 && this.parkingUserInfo.in_black_list==0) {
				uni.showModal({
					title: '提示',
					content: '您已进入停车场，已为您导航到您的车位'
				});
				this.recommendSpace();
				this.userState = 1;
			} else if (oldVal == 0 && val == 1 && this.parkingUserInfo.in_black_list==1) {
				uni.showModal({
					title: '提示',
					content: '您的账号信息在黑名单中，禁止停车'
				});
				this.userState = -1;
			}
		}
	},
	onShow() {
		let that = this;
		if (this.hasLogin) {
			while (this.count < 1000) {
				setTimeout(() => {
					if (this.userState == 0) {
						uni.request({
							url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/User/?User.user_name=' + that.userName, //仅为示例，并非真实接口地址。
							success: res => {
								if (that.userAuth == 'Parkinglotuser') {
									that.parkingUserInfo = res.data.Parkinglotuser[0];
								} else {
									that.parkingUserInfo = res.data.Parkingspaceowner[0];
								}
							}
						});
					}
				}, this.count * 1000);
				this.count += 1;
			}
		}
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
		recommendSpace() {
			let that = this;
			let index = -1;
			if (that.userAuth == 'parkingSpaceOwner') {
				index = this.parkingUserInfo.parking_space_id-1;
			} else {
				let distance = new Array(103);
				for (var i = 0; i < distance.length; i++) {
					distance[i] = 100000;
				}
				for (let i = 0; i < this.parkingSpace.length; i++) {
					if (this.parkingSpace[i].parking_space_state == 1) {
						let pos = this.parkingSpace[i].parking_space_location.split(',');
						pos[0] = parseInt(pos[0]);
						pos[1] = parseInt(pos[1]);
						distance[i] = (9 - pos[0]) * (9 - pos[0]) + (pos[1] - 1) * (pos[1] - 1);
					}
				}
				let min = Math.min.apply(null, distance);
				index = distance.indexOf(min);
				if (index <= 15) {
					index--;
				}
			}
			console.log(index);

			let pos = this.parkingSpace[index].parking_space_location.split(',');
			pos[0] = parseInt(pos[0]);
			pos[1] = parseInt(pos[1]);
			if (that.userAuth == 'parkingSpaceOwner') {
				index++;
			}
			this.navigate(index, pos[0], pos[1]);
		},
		groundColor(ele) {
			let index = ele;
			if (index == -1) {
				return 'black';
			} else if (index == -2) {
				return 'orange';
			} else if (index == 0) {
				return 'white';
			} else if (index >= 1) {
				if (index > 900) {
					return 'blue';
				}
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
		navigate(ele, row, col) {
			uni.request({
				url: 'http://118.31.77.203:8080/Entity/U21a840a21ebf11/PeterPark/Parkinglottraffic/',
				success: res => {
					this.traffic = res.data.Parkinglottraffic;
				}
			});
			for (var i = 0; i < this.traffic.length; i++) {
				let road = this.traffic[i].parkinglot_road_name.split(',');
				road[0] = parseInt(road[0]);
				road[1] = parseInt(road[1]);
				this.mod[road[0]][road[1]] = this.mod[road[0]][road[1]] * this.traffic[i].parkinglot_road_cond;
				this.mod[road[1]][road[0]] = this.mod[road[1]][road[0]] * this.traffic[i].parkinglot_road_cond;
			}
			for (let i = 0; i < this.map.length; i++) {
				for (let j = 0; j < this.map[i].length; j++) {
					if (this.map[i][j] == -2) {
						this.map[i][j] = 0;
					}
					if (this.map[i][j] > 900) {
						this.map[i][j] = this.map[i][j] - 900;
					}
				}
			}
			this.map[row][col] = 900 + ele;
			if (ele <= 0) {
				return;
			}
			let index = ele - 1;
			if (index >= 14) {
				index++;
			}
			if (this.parkingSpace[index].parking_space_state == 0) {
				return;
			}
			let pos = this.parkingSpace[index].parking_space_location.split(',');
			pos[0] = parseInt(pos[0]);
			pos[1] = parseInt(pos[1]);
			console.log(pos);
			if (pos[0] >= 8 && pos[0] <= 10 && pos[1] >= 2 && pos[1] <= 6) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[0][12] = pos[1] - 1;
				this.adjMatrix[0][1] = 10000;
				this.adjMatrix[1][12] = 6 - pos[1];
				this.adjMatrix[1][0] = 10000;
				this.adjMatrix[12] = [pos[1] - 1, 5 - pos[1], 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 0];
				let blockList1 = this.road[0].blockList.slice(0, pos[1]);
				let blockList2 = this.road[0].blockList.slice(pos[1] - 1);
				this.road[17] = {
					index: '0x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '1x',
					blockList: blockList2
				};
			} else if (pos[0] >= 8 && pos[0] <= 10 && pos[1] >= 7 && pos[1] <= 11) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[1][12] = pos[1] - 6;
				this.adjMatrix[1][2] = 10000;
				this.adjMatrix[2][12] = 11 - pos[1];
				this.adjMatrix[2][1] = 10000;
				this.adjMatrix[12] = [10000, pos[1] - 6, 11 - pos[1], 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 0];
				let blockList1 = this.road[1].blockList.slice(0, pos[1] - 5);
				let blockList2 = this.road[1].blockList.slice(pos[1] - 6);
				this.road[17] = {
					index: '1x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '2x',
					blockList: blockList2
				};
			} else if (pos[0] >= 8 && pos[0] <= 10 && pos[1] >= 12 && pos[1] <= 15) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[2][12] = pos[1] - 11;
				this.adjMatrix[2][3] = 10000;
				this.adjMatrix[3][12] = 16 - pos[1];
				this.adjMatrix[3][2] = 10000;
				this.adjMatrix[12] = [10000, 10000, pos[1] - 11, 16 - pos[1], 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 0];
				let blockList1 = this.road[2].blockList.slice(0, pos[1] - 10);
				let blockList2 = this.road[2].blockList.slice(pos[1] - 11);
				this.road[17] = {
					index: '2x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '3x',
					blockList: blockList2
				};
			} else if (pos[0] >= 4 && pos[0] <= 6 && pos[1] >= 2 && pos[1] <= 5) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[4][12] = pos[1] - 1;
				this.adjMatrix[4][5] = 10000;
				this.adjMatrix[5][12] = 6 - pos[1];
				this.adjMatrix[5][4] = 10000;
				this.adjMatrix[12] = [10000, 10000, 10000, 10000, pos[1] - 1, 6 - pos[1], 10000, 10000, 10000, 10000, 10000, 10000, 10000, 0];
				let blockList1 = this.road[3].blockList.slice(0, pos[1]);
				let blockList2 = this.road[3].blockList.slice(pos[1] - 1);
				this.road[17] = {
					index: '4x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '5x',
					blockList: blockList2
				};
			} else if (pos[0] >= 4 && pos[0] <= 6 && pos[1] >= 7 && pos[1] <= 10) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[5][12] = pos[1] - 6;
				this.adjMatrix[5][6] = 10000;
				this.adjMatrix[6][12] = 11 - pos[1];
				this.adjMatrix[6][5] = 10000;
				this.adjMatrix[12] = [10000, 10000, 10000, 10000, 10000, pos[1] - 6, 11 - pos[1], 10000, 10000, 10000, 10000, 10000, 10000, 0];
				let blockList1 = this.road[4].blockList.slice(0, pos[1] - 5);
				let blockList2 = this.road[4].blockList.slice(pos[1] - 6);
				this.road[17] = {
					index: '5x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '6x',
					blockList: blockList2
				};
			} else if (pos[0] >= 4 && pos[0] <= 6 && pos[1] >= 12 && pos[1] <= 15) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[6][12] = pos[1] - 11;
				this.adjMatrix[6][7] = 10000;
				this.adjMatrix[7][12] = 16 - pos[1];
				this.adjMatrix[7][6] = 10000;
				this.adjMatrix[12] = [10000, 10000, 10000, 10000, 10000, 10000, pos[1] - 11, 16 - pos[1], 10000, 10000, 10000, 10000, 10000, 0];
				let blockList1 = this.road[5].blockList.slice(0, pos[1] - 10);
				let blockList2 = this.road[5].blockList.slice(pos[1] - 11);
				this.road[17] = {
					index: '6x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '7x',
					blockList: blockList2
				};
			} else if (pos[0] >= 0 && pos[0] <= 2 && pos[1] >= 2 && pos[1] <= 5) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[8][12] = pos[1] - 1;
				this.adjMatrix[8][9] = 10000;
				this.adjMatrix[9][12] = 6 - pos[1];
				this.adjMatrix[9][8] = 10000;
				this.adjMatrix[12] = [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, pos[1] - 1, 6 - pos[1], 10000, 10000, 10000, 0];
				let blockList1 = this.road[6].blockList.slice(0, pos[1]);
				let blockList2 = this.road[6].blockList.slice(pos[1] - 1);
				this.road[17] = {
					index: '8x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '9x',
					blockList: blockList2
				};
			} else if (pos[0] >= 0 && pos[0] <= 2 && pos[1] >= 7 && pos[1] <= 10) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[9][12] = pos[1] - 6;
				this.adjMatrix[9][10] = 10000;
				this.adjMatrix[10][12] = 11 - pos[1];
				this.adjMatrix[10][9] = 10000;
				this.adjMatrix[12] = [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, pos[1] - 1, 6 - pos[1], 10000, 10000, 0];
				let blockList1 = this.road[7].blockList.slice(0, pos[1] - 5);
				let blockList2 = this.road[7].blockList.slice(pos[1] - 6);
				this.road[17] = {
					index: '9x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '10x',
					blockList: blockList2
				};
			} else if (pos[0] >= 0 && pos[0] <= 2 && pos[1] >= 12 && pos[1] <= 15) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[10][12] = pos[1] - 11;
				this.adjMatrix[10][11] = 10000;
				this.adjMatrix[11][12] = 16 - pos[1];
				this.adjMatrix[11][10] = 10000;
				this.adjMatrix[12] = [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, pos[1] - 1, 6 - pos[1], 10000, 0];
				let blockList1 = this.road[8].blockList.slice(0, pos[1] - 10);
				let blockList2 = this.road[8].blockList.slice(pos[1] - 11);
				this.road[17] = {
					index: '10x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '11x',
					blockList: blockList2
				};
			} else if (pos[0] >= 6 && pos[0] <= 8 && pos[1] >= 0 && pos[1] <= 2) {
				this.adjMatrix = JSON.parse(JSON.stringify(this.mod));
				this.adjMatrix[0][12] = 9 - pos[0];
				this.adjMatrix[0][4] = 10000;
				this.adjMatrix[4][12] = pos[0] - 5;
				this.adjMatrix[4][0] = 10000;
				this.adjMatrix[12] = [9 - pos[0], 10000, 10000, 10000, pos[0] - 5, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 0];
				let blockList1 = this.road[9].blockList.slice(0, 10 - pos[0]);
				let blockList2 = this.road[9].blockList.slice(9 - pos[0]);
				this.road[17] = {
					index: '0x',
					blockList: blockList1
				};
				this.road[18] = {
					index: '4x',
					blockList: blockList2
				};
			}
			this.Dijkstra();
			for (let i = this.path.length - 1; i > 0; i--) {
				let index = '' + this.path[i] + this.path[i - 1];
				let blockList = this.road.find(v => v.index == index).blockList;
				this.map[10][1] = -2;
				for (let j = 0; j < blockList.length; j++) {
					this.map[blockList[j][0]][blockList[j][1]] = -2;
				}
				this.$forceUpdate();
			}
		},
		Dijkstra() {
			this.path = [];
			this.shortPathTable = [];
			this.pathMatrix = [];
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
				if (temp == 12) {
					this.path.push('x');
				} else {
					this.path.push(temp);
				}
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
	flex: 1 1 30rpx;
	height: 75rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>
