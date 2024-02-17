import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { client } from "../client";
import { getUser } from "../utils/getUser";
import { RenderPosts } from "./RenderPosts";

const createdPostsQuery = `*[_type == "post" && author._ref == $userId]{
  ...,
  author->{
    name,
    image
  }
}`;

const savedPostsQuery = `*[_type == "post" && $userId in savedBy[]->_id]{
  ...,
  author->{
    name,
    image
  }
}`;

const userQuery = `*[_type == "user" && _id == $userId]`;

function UserProfile() {
  const [createdPosts, setCreatedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showCreated, setShowCreated] = useState(true);
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    client.fetch(userQuery, { userId }).then((userData) => {
      setUserName(userData[0].name);
      setUserImage(userData[0].image);
    });

    client.fetch(createdPostsQuery, { userId }).then((data) => {
      setCreatedPosts(data);
    });

    client.fetch(savedPostsQuery, { userId }).then((data) => {
      setSavedPosts(data);
    });
  }, []);

  function handleButtonClick(value) {
    setShowCreated(value);
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="mt-28">
      <div className="flex flex-col items-center justify-center">
        {/* userprofile */}
        <div className="flex flex-col items-center justify-center gap-4">
          {userImage && (
            <img
              src={userImage}
              className="w-24 rounded-full"
              alt="profile picture"
            />
          )}

          <h1 className="text-2xl font-semibold">{userName}</h1>
        </div>

        {/* buttons */}
        <div className="flex mt-12 text-lg font-medium xs:gap-6 md:gap-8 lg:gap-12">
          <button
            onClick={() => handleButtonClick(true)}
            className={`${
              showCreated ? "border-b-2" : "border-none"
            } border-black`}
          >
            Created
          </button>
          <button
            onClick={() => handleButtonClick(false)}
            className={`${
              !showCreated ? "border-b-2" : "border-none"
            } border-black`}
          >
            Saved
          </button>
          {userId === user?.sub && (
            <div className="flex justify-end mr-6">
              <button
                className="px-8 py-2 text-white bg-cta-500 rounded-xl hover:bg-cta-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col-reverse pt-16 xs:justify-center">
        <RenderPosts posts={showCreated ? createdPosts : savedPosts} />

        {showCreated &&
          (createdPosts.length <= 0 ? (
            <p className="text-xl font-semibold text-center">{`${
              userId === user.sub
                ? "You haven't created any posts yet!"
                : "User hasn't created any posts yet."
            }`}</p>
          ) : null)}
        {!showCreated &&
          (savedPosts.length <= 0 ? (
            <p className="text-xl font-semibold text-center">{`${
              userId === user.sub
                ? "You haven't saved any posts yet!"
                : "User hasn't saved any posts yet!"
            }`}</p>
          ) : null)}
      </div>
    </div>
  );
}

export default UserProfile;
