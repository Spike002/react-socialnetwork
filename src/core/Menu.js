import React from 'react';
import {signOut, isAuthenticated} from "../auth/index"
import {Link, withRouter} from 'react-router-dom';


const isActive = (history, path) => {
  if(history.location.pathname === path ){
    return { color: "#ff9900"}
  }
  else {
    return { color: "#255B31"}
  }
}

const Menu = ({history}) => {
  return(
    <ul className="nav">
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history,"/")} to="/">Home</Link>
      </li>

      { !isAuthenticated() && (
        <>
          <li className="nav-item">
            <Link className="nav-link" style={isActive(history,"/signin")} to="/signin">Sign in</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" style={isActive(history,"/signup")} to="/signup">Sign up</Link>
          </li>
        </>
      )

      }
      { isAuthenticated() && (

        <>
        <li className="nav-item">
          <Link
          className="nav-link"
          style={isActive(history,"/signout")}
          onClick={()=> signOut( () => history.push('/'))}>Sign out</Link>
        </li>

        <li className="nav-item">
          <a className="nav-link">{isAuthenticated().user.name}</a>
        </li>

        </>
      )}

    </ul>
  )
}

export default withRouter(Menu);
