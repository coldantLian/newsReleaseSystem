import types from './actionTypes';
import initalState from './state';
import action from './action';
export default function reducer(state = initalState, { type, data }) {
    let newState = state;
    switch (type) {
        //设置登录状态
        case types.SET_LOGIN_STATE:
            return action[types.SET_LOGIN_STATE](state, data);
        case types.ADD_MESSAGE:
            return action[types.ADD_MESSAGE](state, data);
        case types.CANCEL_MESSAGE:
            return action[types.CANCEL_MESSAGE](state, data);
        case types.COLLAPSED_VIEW_SIDER:
            return action[types.COLLAPSED_VIEW_SIDER](state, data);

    }
    return newState;
}