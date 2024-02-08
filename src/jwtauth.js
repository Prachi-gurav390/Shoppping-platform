import { useState, useEffect } from "react";
const userToken = localStorage.getItem("Token");
const userID = localStorage.getItem("ID");

const liveUrl = "https://shoppingappserver.onrender.com/";

function useAuth(authParam){
    const [authenticated, setAuthenticated] = useState(false);
    const data = {
      userID: userID
    }
    const authPath = authParam;

    useEffect(() => {
      
      console.log("TOKEN = " + userToken)
  
      if (userToken){
        fetch(`${liveUrl}${authPath}`, { method: 'POST', headers: { "Content-Type": "application/json", Authorization: `Bearer: ${userToken}`}, body: JSON.stringify(data) })
          .then(
            res => {
              if (res.status === 200) {
                console.log("authorized");
                setAuthenticated(true);
              } else {
                console.log("Unauthorized");
                setAuthenticated(false);
              }
            }
          ).catch(err => { console.log(err) })
      } else {
        setAuthenticated(false);
      }
    }, [])
  
    return authenticated;
  }
  
  export {useAuth};