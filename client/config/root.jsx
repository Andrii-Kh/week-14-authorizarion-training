import React from 'react'
import { Provider, useSelector } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect, StaticRouter } from 'react-router-dom'

import store, { history } from '../redux'

import Home from '../components/home'
import PrivateComponent from '../components/private-route'
/* import DummyView from '../components/dummy-view' */
import NotFound from '../components/404'

import Startup from './startup'

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  /* const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.token) */

  const auth = useSelector((s) => s.auth)

  const func = (props) =>
    !!auth.user && !!auth.token ? (
    <Redirect to={{ pathname: '/privat' }} />
    ) : (
    <Component {...props} />
    )
  return <Route {...rest} render={func} />
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth)
  const func = (props) =>
    !!auth.user && !!auth.token ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/login'
        }}
      />
    )
  return <Route {...rest} render={func} />
}

const RouterSelector = (props) =>
  typeof window !== 'undefined' ? <ConnectedRouter {...props} /> : <StaticRouter {...props} />

const RootComponent = (props) => {
  return (
    <Provider store={store}>
      <RouterSelector history={history} location={props.location} context={props.context}>
        <Startup>
          <Switch>
            <OnlyAnonymousRoute exact path="/login" component={Home} />
            <Route exact path="/" component={Home} />
            <Route exact path="/dashboard" component={Home} />
            <PrivateRoute exact path="/private" component={PrivateComponent} />
            <Route component={NotFound} />
          </Switch>
        </Startup>
      </RouterSelector>
    </Provider>
  )
}

export default RootComponent
