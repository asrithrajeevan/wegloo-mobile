import {useCallback, useState} from 'react';
/**
 * Modified the useState hook.
 * Usage:
 * =====
 * interface IState {
 *      visible: boolean;
 *      count: number;
 * }
 *
 * const initialState: IState = {
 *      visible: false,
 *      count: 0
 * };
 *
 * const [state, dispatch] = useModifiedState<IState>(initialState);
 *
 * Case 1: Partial Update
 *  dispatch({visible: true});
 *
 * Case 2: Partial Update based on current state value
 *  dispatch(state => ({count: state.count + 1}));
 *
 * @param initialValue initial state value
 * @returns array of state & dispatch function
 */
const useModifiedState = <T>(
  initialValue: T | (() => T),
): [T, (newState: ((state: T) => Partial<T>) | Partial<T>) => void] => {
  const [state, setState] = useState<T>(initialValue);

  const dispatch = useCallback(
    (newState: ((state: T) => Partial<T>) | Partial<T>) => {
      setState(state => ({
        ...state,
        ...(typeof newState === 'function' ? newState(state) : newState),
      }));
    },
    [setState],
  );

  return [state, dispatch];
};

export default useModifiedState;
