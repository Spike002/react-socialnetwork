import React, { Component } from 'react';
import {list} from './apiPost';
import DefaultPost from '../images/mountain.jpg'
import {Link} from 'react-router-dom'

class Posts extends Component {
  constructor(){
    super()
    this.state= {
      posts: []
    }
  }

  componentDidMount(){
    list().then(data => {
      if(data.error){
        console.log(data.error);
      } else {
        this.setState({posts: data})
        console.log(data);
      }
    })

  }

  renderPosts = (posts) => {
    return (
      <div className="row">
        {
          posts.map((post, index) => {
            const posterId = post.postedBy ? `/user/${post.postedBy._id}` : ""
            const posterName = post.postedBy ? post.postedBy.name : "Unknown"

            return (

              <div className="card col-md-4" key={index}>

                <div className="card-body">
                  <img
                    style={{height: "200px", width: "auto"}}
                    className="img-thumbnail mb-3"
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    onError={i => (i.target.src= `${DefaultPost}`)}
                    alt={post.title}
                  />

                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.body.substring(0, 10)}</p>

                  <br/>

                  <p className="font-italic mark">
                    Ported by {" "}
                    <Link to={`${posterId}`}>{posterName} { " "}</Link>
                    on {new Date(post.created).toDateString()}
                  </p>
                  <Link to={`/post/${post._id}`} className="btn btn-primary">Read More</Link>
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
        <h2 className="mt-m5 mb-5">{!this.state.posts.length ? (`Loading...`) : (`Recent Posts`) }</h2>

        {this.renderPosts(this.state.posts)}
      </div>
    )
  }
}

export default Posts;
