
export const remove = (userId, token) => {
  return(
    fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        }
      }).then (response => {
      return response.json()
    }).catch(error => console.log(error))
  )
}

export const listUser = () => {
  return(
    fetch(`${process.env.REACT_APP_API_URL}/users`, {
      method: "GET",
      }).then (response => {
      return response.json()
    })
    .catch(error => console.log(error))
  )
}

export const read = ( userId, token) => {
  return(
    fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        }
      }).then (response => {
      return response.json()
    })
  )
}

export const updateUser = ( userId, token, user) => {
  console.log('USER DATA UPDATE');
  return(
    fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: user
      }).then (response => {
      return response.json()
    }).catch(error => console.log(error))
  )
}


export const updateUserMenu = (user, next) => {
    if(typeof window !== 'undefined'){
      if(localStorage.getItem('jwt')){
        let auth = JSON.parse(localStorage.getItem('jwt'))
        auth.user= user
        localStorage.setItem('jwt', JSON.stringify(auth))
        next()
      }
    }
}
