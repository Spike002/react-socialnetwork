
export const signUp = (user) => {
    return (
      fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
          },
        body: JSON.stringify(user)
        }).then (response => {
        return response.json()
        }).catch(error => console.log(error))
    )

  }

export const signIn = (user) => {
  return (
    fetch(`${process.env.REACT_APP_API_URL}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        },
      body: JSON.stringify(user)
      }).then (response => {
      return response.json()
      }).catch(error => console.log(error))
  )

}

export const authenticate = (jwt, next) => {
  if(typeof window !== "undefined"){
    localStorage.setItem("jwt", JSON.stringify(jwt))
    next()
  }
}

export const signOut = (next) => {
  if(typeof window !== "undefined") localStorage.removeItem("jwt")
  next()

  return (
    fetch("http://localhost:8080/signout",
     { method: "GET" })
      .then (response => {
      return response.json()
      }).catch(error => console.log(error))
  )
}

export const isAuthenticated = () => {
  if(typeof window == "undefined"){
    return false
  }

  if(localStorage.getItem("jwt")){
    return JSON.parse(localStorage.getItem("jwt"))
  }else{
    return false;
  }
}
