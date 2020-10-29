import React, { useState, useCallback, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Users from './user/pages/Users';
import { AuthContext } from './shared/context/auth-context';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner'
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'))
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'))
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'))
const Auth = React.lazy(() => import('./user/pages/Auth'))
const MainNavigation = React.lazy(() => import('./shared/components/Navigation/MainNavigation'))

let logoutTimer;

const App = () => {
  const [token, setToken] = useState();
  const [tokenExpDate, setTokenExpDate] = useState();
  const [userId, setUserId] = useState();
  //
  const login = useCallback((uid, token, expirationDate) => {
    const tokenExpDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setToken(token);
    localStorage.setItem('userData', JSON.stringify({
      token,
      userId: uid,
      expiration: tokenExpDate.toISOString()
    }))
    setTokenExpDate(tokenExpDate);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userData');
    setToken(null);
    setUserId(null);
  }, []);

  useEffect(() => {
    if(token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }

  }, [logout, token, tokenExpDate])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if(userData &&
       userData.userId && 
       userData.token && 
       new Date(userData.expiration) > new Date()) login(userData.userId, userData.token, new Date(userData.expiration))
  }, [login])

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact  component={UserPlaces}/>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact component={UserPlaces}/>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}
    >
      <Router>
      <Suspense fallback={<div><LoadingSpinner asOverlay/></div>}>
        <MainNavigation />
        <div className="header_palceholder"></div>
          {routes}
          </Suspense>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
