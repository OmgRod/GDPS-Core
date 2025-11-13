import { createStore } from 'redux';

// Very small redux store used as a demo (counter)
type State = { count: number };

const initialState: State = { count: 0 };

function reducer(state = initialState, action: any): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
