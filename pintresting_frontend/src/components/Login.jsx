import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { client } from "../client";
import video from "../assets/bg-img.mp4";
import logo from '../assets/logo.png'
import { getUser } from "../utils/getUser";

const Login = () => {
  const navigate = useNavigate();

    useEffect(() => {
    const user = getUser();
    if (user) {
      navigate("/");
    }
  }, []);

  const responseGoogle = (responseGoogle) => {
    var userObj = jwt_decode(responseGoogle.credential);
    localStorage.setItem("user", JSON.stringify(userObj));
    const userName = userObj.name;
    const imgUrl = userObj.picture;
    const googleId = userObj.sub;

    const doc = {
      _id: googleId,
      _type: "user",
      name: userName,
      image: imgUrl,
    };

    client.createIfNotExists(doc).then((res) => {
      console.log(`user was created, document ID is ${res._id}`);
    });

    navigate("/");
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <video
        className="fixed w-full h-full object-cover inset-0 z-0 object-contain brightness-50"
        autoPlay
        loop
        muted
      >
        <source src={video} type="video/mp4" />
      </video>
      <div className="z-50 flex flex-col items-center">
        <div className="flex">
          <img src={logo} alt="Logo of Pintresting"
          className="xs:w-32 md:w-44"/>
        </div>
        <div className="flex justify-center mb-12 mt-4"> 
          <p className="text-white text-3xl tracking-wider font-semibold text-center">Start exploring nature today.</p>
        </div>
      </div>
        <GoogleLogin
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
    </div>
    
  );
};

export default Login;
