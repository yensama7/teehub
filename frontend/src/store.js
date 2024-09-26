import { createStore } from 'redux';
import rootReducer from './reducers/rootReducer'; // Adjust the path based on your structure

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Optional: Redux DevTools
);

export default store;
