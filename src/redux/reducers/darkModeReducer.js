// reducer.js
const initialState = {
    darkMode: false,
    // other initial state properties...
  };
  
  const darkModeReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ENABLE_DARK_MODE':
        return { ...state, darkMode: true };
  
      case 'DISABLE_DARK_MODE':
        return { ...state, darkMode: false };
  
      // handle other action types...
  
      default:
        return state;
    }
  };
  
  export default darkModeReducer;
  