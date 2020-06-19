import React from 'react';
import Cookies from 'js-cookie';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import ErrorPage from './components/ErrorPage';


function App() {

  if(Cookies.get('authToken') !== '')
  {
    Cookies.set('authToken', Cookies.get('authToken'), { expires: 7, path: '/' })
  }
  else if(Cookies.get('authToken') === '' || Cookies.get('authToken') === undefined)
  {
    Cookies.set('authToken', '', { expires: 7, path: '/' })
  }

  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={LoginRegister} />
        <Route path="/profile" component={Profile} />
        {/* <Route path="*" exact component={ErrorPage} />  */}
      </div>
    </Router>
  );
}

export default App;
