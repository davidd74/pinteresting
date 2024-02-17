import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { client } from "../client";
import video from "../assets/bg-img.mp4";
import logo from "../assets/logo.png";
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
    const userObj = jwt_decode(responseGoogle.credential);
    localStorage.setItem("user", JSON.stringify(userObj));

    const doc = {
      _id: userObj.sub,
      _type: "user",
      name: userObj.name,
      image: userObj.picture,
    };

    client.createIfNotExists(doc).then((res) => {
      console.log(`user was created, document ID is ${res._id}`);
    });

    navigate("/");
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen">
      <video
        className="fixed inset-0 z-0 object-cover w-full h-full brightness-50"
        autoPlay
        loop
        muted
      >
        <source src={video} type="video/mp4" />
      </video>
      <div className="z-50 flex flex-col items-center">
        <div className="flex">
          <img
            src={logo}
            alt="Logo of Pintresting"
            className="xs:w-32 md:w-44"
          />
        </div>
        <div className="flex justify-center mt-4 mb-12">
          <p className="w-4/5 text-5xl font-semibold leading-snug text-center text-white">
            Start exploring nature today.
          </p>
        </div>
      </div>
      <GoogleLogin onSuccess={responseGoogle} onFailure={responseGoogle} />
    </div>
  );
};

export default Login;
