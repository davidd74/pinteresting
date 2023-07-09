import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { client } from "../client";
import urlBuilder from "@sanity/image-url";
import { FiShare2, FiDownload } from "react-icons/fi";
import { BsFillSendFill } from "react-icons/bs";
import { getUser } from "../utils/getUser";
import "../vertical.css";
import { v4 as uuidv4 } from "uuid";
import { submitComment } from "../utils/addComment";
import { RiDeleteBin6Line } from "react-icons/ri";
import SimilarPosts from "./SimilarPostsLogic";
import SaveButton from "./SaveButton";
import HashLoader from "react-spinners/HashLoader";
import { sharePost } from "../utils/sharePost";

const builder = urlBuilder(client);

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [textAreaValue, setTextAreaValue] = useState("");
  const user = getUser();
  const imgRef = useRef(null);
  const [maxContainerHeight, setMaxContainerHeight] = useState(0);
  const [formError, setFormError] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && _id == "${postId}"]{
        _id,
        image,
        title,
        imageSource,
        "authorName": author->name,
        "authorImage": author->image,
        "authorId": author->_id,
        comments[]{
          commentText,
          "commenterName": commenter->name,
          "commenterImage": commenter->image,
          "commenterId": commenter->_id
        }
      }`
      )
      .then((res) => {
        setPost(res[0]);
        if (user.sub === res[0].authorId) {
          setIsAuthor(true);
        }
      });
  }, [postId]);

  useEffect(() => {
    function calculateMaxHeight() {
      if (imgRef.current) {
        const { naturalWidth, naturalHeight } = imgRef.current;

        const aspectRatio = naturalWidth / naturalHeight;
        const maxHeight = 500 / aspectRatio;

        setMaxContainerHeight(maxHeight);
      }
    }

    calculateMaxHeight();
  }, [post]);

  if (!post)
    return (
      <div className="flex flex-col justify-center items-center mt-72 align-center">
        <HashLoader color={"#E60023"} size={50} />
        <p className="mt-8 font-semibold ml-4">Loading pictures for you...</p>
      </div>
    );

  const imageUrl = builder.image(post.image).url();

  function handleSubmit(event) {
    event.preventDefault();

    if (textAreaValue.trim() === "") {
      setFormError("Comment cannot be empty.");
      return;
    }

    if (textAreaValue.length > 300) {
      setFormError("Comment cannot exceed 300 characters.");
      return;
    }

    setFormError("");

    const comment = {
      _type: "comment",
      _key: uuidv4(),
      commenter: {
        _type: "reference",
        _ref: user.sub,
      },
      commentText: textAreaValue,
      commenterName: user.name,
      commenterImage: user.picture,
      commenterId: user.sub,
    };
    submitComment(postId, comment, setTextAreaValue, setPost);
  }

  console.log(post._id);

  // deleting post
  const handleDelete = () => {
    client.delete(post._id).then((res) => {
      console.log("Post deleted!");
      navigate("/");
    });
  };

  return (
    <div className="pb-6">
      <div
        className="mx-auto mt-16 mb-12 px-15 shadow-bnb
      xs:max-w-md xs:block xs:rounded-t-2xl xs:rounded-b-2xl
      md:max-w-xl md:max-w-lg
      lg:max-w-6xl lg:flex lg:rounded-2xl justify-center post-details-height"
      >
        <img
          ref={imgRef}
          className="
        xs:rounded-t-3xl
        lg:rounded-l-2xl
        lg:rounded-r-none
      xs:w-full lg:w-1/2
      object-cover"
          src={imageUrl}
          alt="Posted-image"
        />
        <div
          className="xs:px-4 md:px-8 py-10 bg-white xs:w-auto lg:w-1/2 
      xs:rounded-b-2xl
      lg:rounded-b-none
      lg:rounded-tr-2xl lg:rounded-br-2xl
       flex flex-col justify-between"
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <a
                  href={`${imageUrl}?dl=`}
                  className="hover:bg-gray-100 rounded-full p-2"
                  download
                >
                  <FiDownload fontSize={24} />
                </a>

                <button
                  type="button"
                  className="hover:bg-gray-100 rounded-full p-2"
                  onClick={() => {
                    sharePost(postId)
                  }}
                >
                  <FiShare2 fontSize={24} />
                </button>

                {isAuthor && (
                  <button
                    className="hover:bg-gray-100 rounded-full p-2"
                    onClick={handleDelete}
                  >
                    <RiDeleteBin6Line fontSize={24} />
                  </button>
                )}
              </div>
              <SaveButton postId={postId} userId={user.sub} />
            </div>
            <h2 className="xs:text-xl lg:text-2xl font-semibold mt-4">
              {post.title}
            </h2>
            <Link
              to={`/UserProfile/${post.authorId}`}
              className="flex items-center gap-2"
            >
              <img
                src={post.authorImage}
                className="w-11 rounded-full"
                alt="user-profile-pic"
              />
              <p className="font-medium ">{post.authorName}</p>
            </Link>

            <div className="xs:mt-2 lg:mt-16">
              <h2 className="xs:text-xl lg:text-2xl font-semibold">Comments</h2>
              <div
                style={{ maxHeight: `${maxContainerHeight / 2.65}px` }}
                className="mt-6 overflow-y-auto"
              >
                {post.comments ? (
                  post.comments.map((comment) => (
                    <div key={uuidv4()} className="max-h-64 mb-5">
                      <div className="flex items-start space-x-3">
                        <Link to={`/UserProfile/${comment.commenterId}`}>
                          <img
                            src={comment.commenterImage}
                            alt="Author"
                            className="w-11 h-11 rounded-full my-3"
                          />
                        </Link>
                        <div className="flex-grow bg-slate-50 rounded-3xl px-5 py-3">
                          <h4 className="font-bold">{comment.commenterName}</h4>
                          <p className="mt-1">{comment.commentText}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    className="
                text-gray-500"
                  >
                    No one commented yet!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 justify-center comment-details">
            <div
              className="
          xs:mt-2 md:mt-
          w-full h-0.5 bg-slate-50"
            ></div>

            <div className="flex items-center gap-4">
              <img
                src={user.picture}
                alt="user-profile-pic"
                className="w-11 h-11 rounded-full"
              />
              <form
                onSubmit={handleSubmit}
                className="flex justify-between items-center border border-gray-300 rounded-2xl py-2 px-2 w-full"
              >
                <textarea
                  className="resize-none w-full mr-4 outline-none"
                  placeholder="Enter comment here"
                  rows={1}
                  value={textAreaValue}
                  onChange={(e) => {
                    setTextAreaValue(e.target.value);
                    setFormError("");
                  }}
                />
                <button
                  disabled={formError !== ""}
                  type="submit"
                  className="rounded-full mr-3 p-2 bg-cta-500 hover:bg-cta-700"
                >
                  <BsFillSendFill color="white" fontSize={18} />
                </button>
              </form>
            </div>
            {formError && <p className="text-red-500 ml-2">{formError}</p>}
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h1 className="font-semibold text-2xl text-center">You might like</h1>
        <div className="mt-8">
          <SimilarPosts postId={postId} postTitle={post.title} />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
