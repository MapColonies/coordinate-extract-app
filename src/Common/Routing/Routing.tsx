import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Box } from '@map-colonies/react-components';
import Main from '../../Components/Main/Main';
import PageNotFound from '../PageNotFound/PageNotFound';

import './Routing.css';

const Routing: React.FC = (): JSX.Element => {

  return (
    <Box className="Routing">

      <Switch>

        {/* Default Route */}
        <Route path="/" exact>
          <Redirect to="/index" />
        </Route>

        <Route path="/index">
          <Main />
        </Route>

        <Route path="*">
          <PageNotFound />
        </Route>
        
      </Switch>
      
    </Box>
  );
  
};

export default Routing;
