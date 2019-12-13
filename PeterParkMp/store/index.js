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
    },
    mutations: {
        login(state, userInfoSet) {
            state.userName = userInfoSet.userName || '新用户';
            state.hasLogin = true;
			state.userAvatar=userInfoSet.userAvatar;
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
			state.userAvatar="";
        }
    }
})

export default store
