import React, { Component } from 'react';
import {listUser} from './apiUser';
import DefaultProfile from '../images/user-avatar.jpg'
import {Link} from 'react-router-dom'

class Users extends Component {
  constructor(){
    super()
    this.state= {
      users: []
    }
  }

  componentDidMount(){
    listUser().then(data => {
      if(data.error){
        console.log(data.error);
      } else {
        this.setState({users: data})
      }
    })
    console.log(this.state.users);
  }

  renderUsers = (users) => {
    return (
      <div className="row">
        {
          users.map((user, index) => {
            return (
              <div className="card col-md-4" key={index}>
              <img
                style={{height: "200px", width: "auto"}}
                className="img-thumbnail"
                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                onError={i => (i.target.src= `${DefaultProfile}`)}
                alt={user.name}
              />
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">{user.email}</p>
                  <Link to={`/user/${user._id}`} className="btn btn-primary">View Profile</Link>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }



  render(){
    return(
      <div className="container">
        <h2 className="mt-m5 mb-5">Users</h2>

        {this.renderUsers(this.state.users)}
      </div>
    )
  }
}

export default Users;
