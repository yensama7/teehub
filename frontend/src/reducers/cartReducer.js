const initialState = {
    items: [],
    isLoading: false,
    isAuthenticated: false,
    token: '',
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INITIALIZE_STORE':
            // Load cart items and token from local storage
            const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : state.items;
            const token = localStorage.getItem('token') || '';
            return {
                ...state,
                items: cart,
                token,
                isAuthenticated: !!token,
            };

        case 'addToCart': {
            // Find if an item with the same product ID and size already exists in the cart
            const exists = state.items.find(i => 
                i.product.id === action.payload.product.id && i.size === action.payload.size
            );

            let updatedItems;

            if (exists) {
                // Adjust the quantity based on the action payload
                exists.quantity += parseInt(action.payload.quantity);

                // If quantity is zero or below, remove the item
                updatedItems = exists.quantity > 0
                    ? state.items.map(item => 
                        item.product.id === exists.product.id && item.size === exists.size ? exists : item
                    )
                    : state.items.filter(item => !(item.product.id === exists.product.id && item.size === exists.size));
            } else {
                // Add new item to the cart
                updatedItems = [...state.items, action.payload];
            }

            // Save updated cart to local storage
            localStorage.setItem('cart', JSON.stringify(updatedItems));

            return { ...state, items: updatedItems };
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
            localStorage.removeItem('token'); // Clear token from local storage
            return {
                ...state,
                token: '',
                isAuthenticated: false,
            };

            case 'removeFromCart':
                const filteredItems = state.items.filter(item => 
                    !(item.product.id === action.payload.productId && item.size === action.payload.size)
                );
                // Save updated cart to local storage
                localStorage.setItem('cart', JSON.stringify(filteredItems));
                return {
                    ...state,
                    items: filteredItems,
                };
            

        case 'clearCart':
            const clearedCart = { items: [] };
            localStorage.setItem('cart', JSON.stringify(clearedCart)); // Clear cart in local storage
            return {
                ...state,
                items: clearedCart.items,
            };

        default:
            return state;
    }
};

export default cartReducer;
