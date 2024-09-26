const initialState = {
    items: [],
    isLoading: false,
    isAuthenticated: false,
    token: '',
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INITIALIZE_STORE':
            const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : state.items;
            const token = localStorage.getItem('token') || '';
            return {
                ...state,
                items: cart,
                token,
                isAuthenticated: !!token,
            };

        case 'addToCart': {
            const exists = state.items.find(i => i.product.id === action.payload.product.id);
            if (exists) {
                // Increase quantity if the item already exists in the cart
                exists.quantity += parseInt(action.payload.quantity);
                return { ...state }; // No need to reassign items array
            } else {
                // Add new item to the cart
                return {
                    ...state,
                    items: [...state.items, action.payload],
                };
            }
        }

        case 'setIsLoading':
            return {
                ...state,
                isLoading: action.payload,
            };

        case 'setToken':
            return {
                ...state,
                token: action.payload,
                isAuthenticated: true,
            };

        case 'removeToken':
            return {
                ...state,
                token: '',
                isAuthenticated: false,
            };

        case 'clearCart':
            const clearedCart = { items: [] };
            localStorage.setItem('cart', JSON.stringify(clearedCart));
            return {
                ...state,
                items: clearedCart.items,
            };

        default:
            return state;
    }
};

export default cartReducer;
