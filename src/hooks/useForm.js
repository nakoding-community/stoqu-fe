import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      return {
        ...state,
        [action.inputId]: action.value,
      };

    case 'SET_DATA':
      return {
        ...state,
        ...action.inputData,
      };

    default:
      return state;
  }
};

export const useForm = (initialInputs) => {
  const [formState, dispatch] = useReducer(formReducer, initialInputs);

  const inputChangeHandler = useCallback((id, value) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value,
      inputId: id,
    });
  }, []);

  const setFormData = useCallback((inputData) => {
    dispatch({
      type: 'SET_DATA',
      inputData,
    });
  }, []);

  return [formState, inputChangeHandler, setFormData];
};
