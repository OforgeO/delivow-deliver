const initialState = {
    delivery_before_attend: false,
    delivery_order_request: false,
    delivery_decide: false,
    delivery_no_entry: false,
    delivery_order_car: false,
    delivery_order_serveral: false,
    delivery_request_attend: false,
    delivery_order_cancel: false,
    cancel_delivering: false,
    title: '',
    subtitle: '',
    order_uid: '',
    request_order_uid: '',
    store_name: ''
}

export default notify = (state = initialState , action = {}) => {
    const { notify } = action;
    switch (action.type) {
        case "SHOW_NOTIFY":
            return {
                title: notify.title,
                subtitle: notify.subtitle,
                order_uid: notify.order_uid,
                store_name: notify.store_name,
                request_order_uid: notify.request_order_uid,
                delivery_before_attend: notify.delivery_before_attend,
                delivery_order_request: notify.delivery_order_request,
                delivery_decide: notify.delivery_decide,
                delivery_no_entry: notify.delivery_no_entry,
                delivery_order_car: notify.delivery_order_car,
                delivery_order_serveral: notify.delivery_order_serveral,
                delivery_request_attend: notify.delivery_request_attend,
                delivery_order_cancel: notify.delivery_order_cancel,
                cancel_delivering: notify.cancel_delivering
            }
        default:
            return state;
    }
}
