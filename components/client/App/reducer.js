import {LOADING, ERROR, OPEN_MODAL} from './action';

export function loading(state = Immutable.Map(), action) {
  switch (action.type) {
    case LOADING: {
      const {processing, reqType} = action.payload;
      return state.merge({[reqType]: processing});
    }
    case ERROR: {
      const reqType = action.payload.reqType;
      return state.merge({[reqType]: false});
    }
    default:
      return state;
  }
}

export function err(state = Immutable.Map(), action) {
  switch (action.type) {
    case ERROR: {
      const {e, reqType} = action.payload;
      return state.merge({[reqType]: e});
    }
    case LOADING: {
      const {processing, reqType} = action.payload;
      if (!processing) {
        return state.remove(reqType);
      }
      return state;
    }
    default:
      return state;
  }
}

export function modal(state = Immutable.Map(), action) {
  switch (action.type) {
    case OPEN_MODAL: {
      const {status, modalId} = action.payload;
      return state.merge({[modalId]: status});
    }
    default:
      return state;
  }
}
