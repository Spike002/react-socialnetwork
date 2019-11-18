import React, { Component } from 'react';
import { isAuthenticated } from "../auth/index";
import {read} from './apiUser';
import {Link, Redirect} from 'react-router-dom';
import DefaultProfile from '../images/user-avatar.jpg'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'

class Profile extends Component {
  constructor(){
    super();
    this.state={
      user: {following: [], follower:[]},
      redirectToSignin: false,
      following: false
    }
  }

  //check Follow
  checkFollow = user => {
    const jwt = isAuthenticated()
    const match = user.followers.find(follower => {
      return follower._id === jwt.user.id
    })
    return match
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token ).then(data => {
      if (data.error){
        this.setState({redirectToSignin: true})
      }else{
        let following = this.checkFollow(data)
        this.setState({user: data, following})
      }
    }).catch(error => console.log(error))
  }


  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId)
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId)
  }
  render(){
    const {redirectToSignin, user} = this.state;

    console.log(isAuthenticated());
    const photoUrl =  user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile

    if(redirectToSignin) {
      return (
        <Redirect to="/signin" />
      )
    }
    return(
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2 className="mt-5 mb-5">Profile</h2>
            </div>
        </div>

        <div className="row">

        <img
          style={{height: "200px", width: "auto"}}
          className="img-thumbnail"
          src={photoUrl} alt={user.name}
          onError={i => (i.target.src= `${DefaultProfile}`)}
        />

          <div className="col-md-6">
          <p>Hello {this.state.user.name}</p>
          <p>Email {this.state.user.email}</p>
          <p>{`Joined ${new Date(this.state.user.created).toDateString()}`}</p>
            { isAuthenticated().user && isAuthenticated().user._id == this.state.user._id ? (
              <div className="d-inline-block mt-5">

                <Link className="btn btn-raised btn-success mr-5" to={`/user/edit/${this.state.user._id}`}>
                Edit Profile
                </Link>
                <DeleteUser userId={this.state.user._id}/>
              </div>
            ) : ( <FollowProfileButton following={this.state.following}/>)}
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <p>Summary:</p>
            <p>{user.about}</p>
            </div>
        </div>

      </div>
    )
  }
}

export default Profile;
