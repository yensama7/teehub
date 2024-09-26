const initialState = {
    items: [],
    isLoading: false,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'addToCart':
            return {
                ...state,
                items: [...state.items, action.payload],
            };
        case 'setIsLoading':
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

export default cartReducer;
