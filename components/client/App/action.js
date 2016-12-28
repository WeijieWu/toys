export const LOADING = 'UI/LOADING';
export const ERROR = 'UI/ERROR';
export const OPEN_MODAL = 'UI/OPEN_MODAL';

export function loading(processing, reqType) {
  return {
    type: LOADING,
    payload: {processing, reqType},
  };
}

export function err(e, reqType) {
  return {
    type: ERROR,
    payload: {e, reqType},
  };
}

export function openModal(status, modalId) {
  return {
    type: OPEN_MODAL,
    payload: {status, modalId},
  };
}
