import { useState, useEffect } from "react";
import { client } from "../client";
import HashLoader from "react-spinners/HashLoader";
import { RenderPosts } from "./RenderPosts";

const query = `*[_type == "post"]{
  _id,
  image,
  imageSource,
  "authorName": author->name,
  "authorImage": author->image
}`;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(query).then(setPosts);
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center mt-72 align-center">
          <HashLoader color={"#E60023"} size={50} />
          <p className="mt-8 font-semibold ml-4">Loading pictures for you...</p>
        </div>
      ) : (
        <div className="flex xs:justify-center">
          <RenderPosts posts={posts} />
        </div>
      )}
    </>
  );
};

export default Posts;
