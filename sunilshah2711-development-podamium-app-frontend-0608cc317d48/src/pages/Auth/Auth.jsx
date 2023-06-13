import React from "react";
import { Helmet } from "react-helmet-async";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./Auth.scss";

import Logo from "../../assets/images/logo.png";
import Authbg from "../../assets/images/auth/auth_bg.svg";
import GoogleIcon from "../../assets/images/auth/google.png";
import MicrosoftIcon from "../../assets/images/auth/microsoft.png";

const Auth = () => {
  const navigate = useNavigate();

  // When success fully login then run this function

  const onLoginSuccess = (res) => {
    const access_token = res.accessToken;
    const user_name = res.profileObj.givenName;
    localStorage.setItem("user_name", user_name);
    axios
      .post("https://api.podamium.com/v1/auth/google/signin-callback", {
        code: access_token,
      })
      .then((res) => {
        // Redirect to workspace when sucsess full login
        navigate("/workspace");
        // Setting token recived from the api in local storage
        let auth_code = res.data.data.payload.token;
        localStorage.setItem("auth_code", auth_code);

        toast.success(`${res.data.data.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // When unsuccess fully login then run this function

  const onLoginFailure = (res) => {
    console.log("Login Failed:", res);
  };

  // Auth design

  return (
    <>
      <Helmet>
        <title>Login 115019m07m2022</title>
      </Helmet>
      <div className="auth-main">
        <div className="auth-bg">
          <img src={Authbg} alt="authbg" />
        </div>
        <div className="w-100 d-flex justify-content-center">
          <img src={Logo} alt="log" />
        </div>
        <div className="auth-wrap">
          <div className="auth-login">
            <div className="auth-heding">
              <h3>Log In</h3>
            </div>
            <div className="auth-btn">
              {/* Google login button */}
              <GoogleLogin
                clientId="966211017574-14b3bp0n0nqrcm4u1k4o0i2h6753qvn6.apps.googleusercontent.com"
                redirectUri="https://dev.podamium.com"
                prompt="consent"
                cookiePolicy={"single_host_origin"}
                isSignedIn={true}
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <img src={GoogleIcon} alt="google" />
                    Log In with Google
                  </button>
                )}
              />
              <button>
                <img src={MicrosoftIcon} alt="microsoft" />
                Log In with Microsoft
              </button>
            </div>
          </div>
          <div className="auth-login">
            <div className="auth-heding">
              <h3>Sign Up</h3>
            </div>
            <div className="auth-btn">
              {/* Google login button */}
              <GoogleLogin
                clientId="966211017574-14b3bp0n0nqrcm4u1k4o0i2h6753qvn6.apps.googleusercontent.com"
                redirectUri="https://dev.podamium.com"
                prompt="consent"
                cookiePolicy={"single_host_origin"}
                isSignedIn={true}
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <img src={GoogleIcon} alt="google" />
                    Sign Up with Google
                  </button>
                )}
              />
              <button>
                <img src={MicrosoftIcon} alt="microsoft" />
                Sign Up with Microsoft
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Auth;
