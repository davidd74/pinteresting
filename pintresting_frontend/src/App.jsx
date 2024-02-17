import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import PostDetails from "./components/PostDetails";
import UserProfile from "./components/UserProfile";
import Home from "./container/Home";
import SearchResult from "./components/SearchResult";
import { getUser } from "./utils/getUser";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const excludedRoutes = ["/login"];
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="px-12 mx-auto lg:px-4 max-w-screen-2xl">
        {!excludedRoutes.includes(location.pathname) && <Navbar />}
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/userprofile/:userId" element={<UserProfile />} />
          <Route path="/postdetails/:postId" element={<PostDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
