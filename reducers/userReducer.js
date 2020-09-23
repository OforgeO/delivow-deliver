const initialState = {
    area: null,
    address: null,
    birthday: null,
    email: null,
    first_name: null,
    last_name: null,
    phone: null,
    photo: null,
    uid: null,
    shift_hours: null,
    shift_weekdays: null
}

export default user = (state = initialState , action = {}) => {
    const { user } = action;
    switch (action.type) {
        case "SET_USER":
            return {
                area: user.area,
                address: user.address,
                birthday: user.birthday,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                photo: user.photo,
                uid: user.uid,
                shift_hours: user.shift_hours,
                shift_weekdays: user.shift_weekdays
            }
            break;
        default:
            return state;
    }
}
