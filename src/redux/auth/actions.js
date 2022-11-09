const authActions = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    GET_USERS: 'GET_USERS',
    GET_HISTORY: 'GET_HISTORY',
    GET_SERVICES: 'GET_SERVICES',
    SELECT_SERVICE: 'SELECT_SERVICE',
    
    login: (data) => {
        return {
            type: authActions.LOGIN,
            isLogin: true,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            adminData: data.adminData
        };
    },
    logout: () => {
        return {
            type: authActions.LOGOUT,
            isLogin: false,
            accessToken: null,
            refreshToken: null,
            adminData: null
        };
    },
    getServices: (data) => {
        return {
            type: authActions.GET_SERVICES,
            services: data.data
        };
    },
    selectService: (data) => {
        return {
            type: authActions.SELECT_SERVICE,
            service: data
        };
    }, 
    getHistory: (data) => {
        return {
            type: authActions.GET_HISTORY,
            history: data.data
        };
    },
    getUser: (data) => {
        return {
            type: authActions.GET_USERS,
            users: data.data
        };
    },
}

export default authActions