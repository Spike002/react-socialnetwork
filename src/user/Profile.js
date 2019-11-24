import React, { Component } from 'react';
import { isAuthenticated } from "../auth/index";
import {read} from './apiUser';
import {Link, Redirect} from 'react-router-dom';
import DefaultProfile from '../images/user-avatar.jpg'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs'
import {postByUser} from '../post/apiPost'

class Profile extends Component {
  constructor(){
    super();
    this.state={
      user: {following: [], followers:[]},
      redirectToSignin: false,
      following: false,
      error:'',
      posts: []
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

  clickFollowButton = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    callApi(userId, token, this.state.user._id)
    .then(data => {
      if(data.error){
        this.setState({error: data.error})
      } else {
        this.setState({user: data, following: !this.state.following})
      }
    })
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token ).then(data => {
      if (data.error){
        this.setState({redirectToSignin: true})
      }else{
        let following = this.checkFollow(data)
        this.setState({user: data, following})
        this.loadPosts(data._id)
      }
    }).catch(error => console.log(error))
  }

  loadPosts = (userId) => {
    const token = isAuthenticated().token;
    postByUser(userId, token).then(data => {
      if(data.error){
        console.log(data.error);
      } else {
        this.setState({posts: data})
      }
    })
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

                <Link className="btn btn-raised btn-info mr-5"
                      to={`/post/create`}>
                      Create Post
                </Link>

                <Link className="btn btn-raised btn-success mr-5"
                      to={`/user/edit/${this.state.user._id}`}>
                      Edit Profile
                </Link>

                <DeleteUser userId={this.state.user._id}/>
              </div>
            ) : ( <FollowProfileButton
                  following={this.state.following}
                  onButtonClick={this.clickFollowButton}
                  />
                )}


          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <hr/>
            <p>{user.about}</p>
            <hr />

            <ProfileTabs
              followers={this.state.user.followers}
              following={this.state.user.following}
              posts = { this.state.posts}
            />
          </div>
        </div>

      </div>
    )
  }
}

export default Profile;
