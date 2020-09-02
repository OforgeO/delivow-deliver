import user from './userReducer';
import terms from './termsReducer';
import notify from './notifyReducer';
import showDeliver from './showDeliver';
const rehydrated = (state = false , action) => {
    switch (action.type) {
        case "persist/REHYDRATE" :
            return true;
            break;
        default:
            return state;
    }
}

export default {
    rehydrated,
    user,
    terms,
    notify,
    showDeliver
};