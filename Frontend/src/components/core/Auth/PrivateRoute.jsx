import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { useNavigate, Navigate } from "react-router-dom"
import { apiConnector } from "../../../services/apiConnector";
import { endpoints } from "../../../services/apis";

function PrivateRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const loggedIn = await checkIsLogin();
        setIsLoggedIn(loggedIn);
      } catch (error) {
        setIsLoggedIn(false);
      } finally{
        setIsLoading(false);
      }
    };
    verifyLogin();
  }, []);

  if(isLoading) return <h1>Loading...</h1>
  if(!isLoading && isLoggedIn) return children;
  else return  <Navigate to="/login" />;
}

async function checkIsLogin() {
  try {
    const response = await apiConnector("GET", endpoints.TOKEN_VALIDATION_API, null, {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export default PrivateRoute;
