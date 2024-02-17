import Masonry from "@mui/lab/Masonry";
import { Link } from "react-router-dom";
import SaveButton from "./SaveButton";
import { FiDownload, FiShare2 } from "react-icons/fi";
import { client } from "../client";
import urlBuilder from "@sanity/image-url";
import { getUser } from "../utils/getUser";
import { sharePost } from "../utils/sharePost";
import HashLoader from "react-spinners/HashLoader";
import { useEffect, useState } from "react";

export const RenderPosts = ({ posts }) => {
  const builder = urlBuilder(client);
  const user = getUser();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const imagePromises = posts.map((post) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = builder.image(post.image).url();
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true);
      })
      .catch((error) => console.error("Error loading images:", error));
  }, [posts, builder]);

  return (
    <div>
      {imagesLoaded ? (
        <Masonry columns={{ xs: 2, sm: 3, lg: 5 }} spacing={1.5}>
          {posts.map((post, i) => (
            <div key={i} className="relative group">
              <Link to={`/postdetails/${post._id}`}>
                <img
                  src={builder.image(post.image).url()}
                  alt="Image"
                  className="rounded-lg"
                />
              </Link>
              <div className="absolute top-0 right-0 hidden group-hover:block">
                <SaveButton postId={post._id} userId={user.sub} />
              </div>
              <a
                href={`${builder.image(post.image).url()}?dl=`}
                download
                className="absolute bottom-0 right-0 hidden px-2 py-2 m-3 text-center rounded-full group-hover:block bg-slate-200 hover:bg-white"
              >
                <FiDownload fontSize={20} />
              </a>
              <button
                type="button"
                className="absolute bottom-0 left-0 hidden px-2 py-2 m-3 text-center rounded-full group-hover:block bg-slate-200 hover:bg-white"
                onClick={() => sharePost(post._id)}
              >
                <FiShare2 fontSize={20} />
              </button>
            </div>
          ))}
        </Masonry>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <HashLoader color="#E60023" />
        </div>
      )}
    </div>
  );
};
