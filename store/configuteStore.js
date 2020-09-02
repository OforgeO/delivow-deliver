import { createStore , applyMiddleware , compose} from 'redux';
import thunk from 'redux-thunk';
import {AsyncStorage} from 'react-native';
import reducers from './../reducers';
import {persistStore, persistCombineReducers} from "redux-persist";
const middleware = [ thunk ];
const config = {
    key: 'primary',
    storage: AsyncStorage,
};
let reducer = persistCombineReducers(config , reducers);
let rootReducer = (state , action) => {
    if(action.type === 'USER_LOGOUT' ) {
        AsyncStorage.removeItem('persist:primary')
        state = undefined
    }
    return reducer(state , action)
}
const store = createStore(
    rootReducer,
    undefined,
    compose(
        applyMiddleware(...middleware)
    )
);
persistStore(
    store,
    null,
    () => {store.getState()}
);
export default store;
