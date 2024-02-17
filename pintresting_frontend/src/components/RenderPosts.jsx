import Masonry from "@mui/lab/Masonry";
import { Link } from "react-router-dom";
import SaveButton from "./SaveButton";
import { FiDownload, FiShare2 } from "react-icons/fi";
import { client } from "../client";
import urlBuilder from "@sanity/image-url";
import { getUser } from "../utils/getUser";
import { sharePost } from "../utils/sharePost";

export const RenderPosts = ({ posts }) => {
  const builder = urlBuilder(client);
  const user = getUser();

  return (
    <Masonry columns={{ xs: 2, sm: 3, lg: 4, xl: 6 }} spacing={2.5}>
      {posts &&
        posts.map((post, i) => (
          <div key={i} className="relative group">
            <Link to={`/PostDetails/${post._id}`}>
              <img
                src={builder.image(post.image).url()}
                alt="Image"
                className="rounded-xl"
                loading="eager"
              />
            </Link>
            <div className="absolute top-0 right-0 hidden group-hover:block">
              <SaveButton postId={post._id} userId={user.sub} />
            </div>
            <a
              href={`${builder.image(post.image).url()}?dl=`}
              download
              className="absolute bottom-0 right-0 hidden group-hover:block m-3 px-2 py-2 bg-slate-200 hover:bg-white rounded-full text-center"
            >
              <FiDownload fontSize={20} />
            </a>
            <button
              type="button"
              className="absolute bottom-0 left-0 hidden group-hover:block m-3 px-2 py-2 bg-slate-200 hover:bg-white rounded-full text-center"
              onClick={() => sharePost(post._id)}
            >
              <FiShare2 fontSize={20} />
            </button>
          </div>
        ))}
    </Masonry>
  );
};
