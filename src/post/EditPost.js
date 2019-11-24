import React, { Component } from 'react';
import { singlePost, update } from './apiPost'
import {isAuthenticated } from "../auth/index";
import DefaultPost from '../images/mountain.jpg'
import {Redirect} from 'react-router-dom';

class EditPost extends Component {

  constructor () {
    super()
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    }
  }

  init = (postId) => {
    singlePost(postId).then(data => {
      if(data.error){
        this.setState({redirectToProfile: true})
      } else {
        this.setState({
          id: data.postedBy._id,
          title: data.title,
          body: data.body,
          error: "",
        })
      }
    })
  }



  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId)
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
      const postId = this.props.match.params.postId;

      update(postId, token, this.postData).then(data => {
        if(data.error) {
          this.setState({error: data.error})
        } else {
          this.setState({
              loading: false,
              title: '',
              body: '',
              redirectToProfile: true})
          console.log("New Post: ", data);
        }
      })
    }
  }

  editPostForm = (title, body) => {
    return (
      <form>

        <div className="form-group">
          <label className="text-muted">Post Photo</label>
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

        <button onClick={this.handleFormSubmit} className="btn btn-raised btn-primary">Update Post</button>
      </form>


    )
  }

  render(){
    const { id, title, body, redirectToProfile, error, loading } = this.state;
    console.log('this is edit post', this.state)

    if(redirectToProfile){
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }

    const photoUrl =  `${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`

    console.log('this is photo Url', photoUrl)
    return(
      <div className="container mt-5">

        <div className="alert alert-danger"
          style={{display: error ? "": "none"}}> {error}
        </div>
        {loading ? (
                  <div className="jumbotron text-center">
                      <h2>Loading...</h2>
                    </div> ) : ( "" )}

        <img
          style={{height: "200px", width: "auto"}}
          className="img-thumbnail"
          src={photoUrl}
          alt={title}
          onError={i => (i.target.src= `${DefaultPost}`)}
        />

        {this.editPostForm(title, body)}
      </div>
    )
  }

}

export default EditPost
