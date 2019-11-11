import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom';
import MainRouter from './MainRouter';

const App = () => {
  return(
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  )    
}



export default App;
