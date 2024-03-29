import React, { Component } from 'react';
import {isAuthenticated } from "../auth/index";
import {create} from './apiPost';
import {Redirect} from 'react-router-dom';
import DefaultProfile from '../images/user-avatar.jpg'

class NewPost extends Component {

  constructor () {
    super()
    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      loading: false,
      redirectToProfile: false,
    }
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({user: isAuthenticated().user})
  }

  isValid = () => {
    const { title, body, fileSize } = this.state

    if(fileSize > 100000){
      this.setState({error: "File size should be less than 100kb", loading: false})
      return false
    }
    if(title.length < 4 || body.length < 4 ){
      this.setState({error: "All fields need at least 4 characters", loading: false})
      return false
    }
    
    return true;
  }

  handleChange = (name) => (event) => {
    this.setState({error:""})
    const value = name === "photo" ? event.target.files[0] : event.target.value

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value)
    this.setState({[name]: value, fileSize});

  }

  handleFormSubmit = (event) => {
    event.preventDefault()
    this.setState({loading: true})

    if (this.isValid()){

      const token = isAuthenticated().token;
      const userId = isAuthenticated().user._id;

      create(userId,token, this.postData).then(data => {
        if(data.error) {
          this.setState({error: data.error})
        } else {
          this.setState({
              loading: false,
              title: '',
              body: '',
              photo: "",
              redirectToProfile: true})
          console.log("New Post: ", data);
        }
      })
    }

  }

  newPostForm = (title, body) => {
    return (
      <form>

        <div className="form-group">
          <label className="text-muted">Profile Photo</label>
          <input
            onChange={this.handleChange("photo")}
            type="file"
            accept="image/*"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            onChange={this.handleChange("title")}
            type="text"
            className="form-control"
            value={title}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Body</label>
          <textarea
            onChange={this.handleChange("body")}
            type="text"
            className="form-control"
            value={body}
          />
        </div>

        <button onClick={this.handleFormSubmit} className="btn btn-raised btn-primary">Create Post</button>
      </form>


    )
  }

  render(){

    const {user, title, body, photo, error, loading, redirectToProfile} = this.state;

    if(redirectToProfile){
      return <Redirect to={`/user/${user._id}`} />;
    }

    return(
      <div className= "container">
        <h2 className='mt-5 mb-5'>Create Post</h2>

        <div className="alert alert-danger"
          style={{display: error ? "": "none"}}> {error}
        </div>
        {loading ? (
                  <div className="jumbotron text-center">
                      <h2>Loading...</h2>
                    </div> ) : ( "" )}

          {this.newPostForm(title, body)}
      </div>
    )
  }
}

export default NewPost
