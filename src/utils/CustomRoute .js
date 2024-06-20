import React from 'react';
import { Route } from 'react-router-dom';

const CustomRoute = ({ component: Component, ...rest }) => {
   
  return (
    <Route
      {...rest}
      render={(props) => (
        <Component {...props} isDarkMode={rest.isDarkMode} collapsed={rest.collapsed} selectedDivision = {rest.selectedDivision} />
      )}
    />
  );
};

export default CustomRoute;
