import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { isValidToken, setSession } from '../utils/jwt';
import { useLoginUser } from '../hooks/api/useAuth';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ** Hook to mutate user login data
  const { mutateAsync: loginMutate } = useLoginUser();

  // ** Function to handle login
  const login = async (email, password) => {
    let isSuccess = false;

    const body = {
      email,
      password,
    };

    // ** Mutation
    await loginMutate(body, {
      onSuccess: (data) => {
        if (data?.data) {
          setSession(data?.data?.token, data?.data);
          dispatch({
            type: 'LOGIN',
            payload: {
              user: data?.data,
            },
          });

          isSuccess = true;
        }
      },
    });

    return isSuccess;
  };

  // ** Function to handle logout
  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  // ** Function to initialize apps
  useEffect(() => {
    const initialize = async () => {
      const accessToken = window.localStorage.getItem('accessToken');
      const userData = JSON.parse(window.localStorage.getItem('userData'));

      if (accessToken && isValidToken(accessToken) && userData) {
        setSession(accessToken, userData);

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user: userData,
          },
        });
      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    // ** Need this to display loading
    setTimeout(() => {
      initialize();
    }, 250);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
