const initialState = {
    terms: false,
    commercial: false,
    personal: false
}

export default terms = (state = initialState , action = {}) => {
    const { terms } = action;
    switch (action.type) {
        case "SHOW_TERMS":
            return {
                terms: terms.terms,
                commercial: terms.commercial,
                personal: terms.personal
            }
        default:
            return state;
    }
}
