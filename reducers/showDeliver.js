const initialState = {
    showDeliver: false,
    showBookDeliver: false,
    orderUid: null
}

export default showDeliver = (state = initialState , action = {}) => {
    const { showDeliver } = action;
    switch (action.type) {
        case "SHOW_DELIVER":
            return {
                showDeliver: showDeliver.showDeliver, 
                showBookDeliver: showDeliver.showBookDeliver,
                orderUid: showDeliver.orderUid
            }
            break;
        default:
            return state;
    }
}
