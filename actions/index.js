export const setUser = (user) => ({
    type: "SET_USER",
    user: user
});

export const logOut = (state) => ({
    type: "USER_LOGOUT" ,
    state: state
})

export const setTerms = (terms) => ({
    type: "SHOW_TERMS" ,
    terms: terms
})

export const setNotify = (notify) => ({
    type: "SHOW_NOTIFY" ,
    notify: notify
})

export const setShowDeliver = (showDeliver) => ({
    type: "SHOW_DELIVER" ,
    showDeliver: showDeliver
})