import authAction from './actions';

const initState = {
    isLogin: false,
    accessToken: null,
    refreshToken: null,
    adminData: null,
    users: [],
    services: [],
    service: null,
    history: []
}

export default function rootReducer(state = initState, action) {

    switch (action.type) {
        case authAction.LOGIN:
            return {
                ...state,
                isLogin: action.isLogin,
                accessToken: action.accessToken,
                refreshToken: action.refreshToken,
                adminData: action.adminData
            }
        case authAction.LOGOUT:
            return {
                ...state,
                isLogin: action.isLogin,
                accessToken: null,
                refreshToken: null,
                adminData: null,
                users: [],
                services: [],
                service: null,
                history: []
            }
        case authAction.GET_SERVICES:
            return {
                ...state,
                services: action.services
            }
        case authAction.SELECT_SERVICE:
            return {
                ...state,
                service: action.service
            }
        case authAction.GET_HISTORY:
            return {
                ...state,
                history: action.history
            }
        case authAction.GET_USERS:
            return {
                ...state,
                users: action.users
            }
        default:
            return state
    }
}