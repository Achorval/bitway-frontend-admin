// ** React Imports
import React, { useRef, useState, useEffect } from 'react';
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import LoaderComponent from 'components/common/LoaderComponent';

// ** AxiosInstance Imports
import axios from './useAxios'
import { store }  from "redux/store";
const { login, logout } = AuthActions;

// ** AuthInit Context
const AuthInit = ({ login, logout, children }) => {
  const { accessToken } = store.getState().auth;

  const didRequest = useRef(false)
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          const response = await axios.get('/admin')
          if (response) {
            const data = {
              accessToken: response.data.data.accessToken,
              refreshToken: response.data.data.refreshToken,
              adminData: response.data.data.admin
            };
            login(data)
          }
        }
      } catch (error) {
        if (!didRequest.current) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }
    
    if (accessToken) {
      requestUser()
    } else {
      logout()
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [accessToken])

  return showSplashScreen ? <LoaderComponent loading={true} /> : <>{children}</>
}

// export default AuthInit;
export default connect(
  null,
  { login, logout }
)(AuthInit);