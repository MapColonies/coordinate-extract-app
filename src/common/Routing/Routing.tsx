import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Box } from '@map-colonies/react-components';
import Main from '../../components/Main/Main';
import PageNotFound from '../PageNotFound/PageNotFound';
import Login from './Login/Login';
import ProtectedRoute from './Login/ProtectedRoute';

import './Routing.css';

const Routing: React.FC = (): JSX.Element => {

  return (
    <Box className="Routing">

      <Switch>

        <Route path="/login" component={Login} />

        <ProtectedRoute  path="/" exact component={Main}></ProtectedRoute >

        <ProtectedRoute path="/index" component={Main}></ProtectedRoute>

        <Route path="*"><PageNotFound /></Route>
        
      </Switch>
      
    </Box>
  );
  
};

export default Routing;
