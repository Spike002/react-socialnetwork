import React, { Component } from 'react';
import { singlePost, remove } from './apiPost'
import DefaultPost from '../images/mountain.jpg'
import {Link, Redirect} from 'react-router-dom'
import { isAuthenticated } from "../auth/index";

class SinglePost extends Component {

  state={
    post:'',
    deletePostRedirectToHome: false
  }

  componentDidMount = () => {
    const postId = this.props.match.params.postId
    singlePost(postId).then(data => {
      if(data.error){
        console.log(data.error);
      } else {
        this.setState({ post: data })
      }
    })
  }

  deletePost = () => {
    const postId = this.props.match.params.postId
    const token = isAuthenticated().token
    remove(postId, token).then(data => {
      if(data.error){
        console.log(data.error);
      } else {
        this.setState({deletePostRedirectToHome: true})
      }
    })
  }

  deleteConfirmed= () => {
    let answer = window.confirm("Are you sure you want to delete this post?")
    if(answer){
      this.deletePost();
    }
  }

  renderPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : ""
    const posterName = post.postedBy ? post.postedBy.name : "Unknown"


      return (

          <div className="card-body">
            <img
              style={{height: "100%", width: "100%", objectFit: "cover"}}
              className="img-thumbnail mb-3"
              src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
              onError={i => (i.target.src= `${DefaultPost}`)}
              alt={post.title}
            />
            <p className="card-text">{post.body}</p>

            <br/>

            <p className="font-italic mark">
              Ported by {" "}
              <Link to={`${posterId}`}>{posterName} { " "}</Link>
              on {new Date(post.created).toDateString()}
            </p>

            <div className="d-inline-block">
              <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">Back to Post</Link>
              {
                isAuthenticated().user && isAuthenticated().user._id === this.state.post.postedBy._id && (
                  <>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-raised btn-warning btn-sm mr-5">
                    Update Post
                  </Link>

                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-warning btn-sm mr-5">
                    Delete Post
                  </button>
                  </>
                )
              }

            </div>

          </div>

      )

  }

  render(){
    const {post} = this.state
    if(this.state.deletePostRedirectToHome){
      return <Redirect to="/" />
    }
    return(
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

        {
          !post ? (
            <div className="jumbotron text-center">
              <h2>Loading...</h2>
            </div>
          ) : (this.renderPost(post))
        }

      </div>
    )
  }
}

export default SinglePost;
