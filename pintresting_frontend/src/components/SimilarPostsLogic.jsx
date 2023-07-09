import React from "react";
import { useState, useEffect } from "react";
import { client } from "../client";
import { RenderPosts } from "./RenderPosts";

const SimilarPosts = (props) => {
  const [similarPosts, setSimilarPosts] = useState(null);


  const postId = props.postId;
  const postTitle = props.postTitle;
  console.log(postId, postTitle);

  useEffect(() => {
    const titleWords = postTitle.split(" ");
    const titleQuery = titleWords
      .map((word) => `title match "${word}"`)
      .join(" || ");

    client
      .fetch(
        `*[_type == "post" && (${titleQuery}) && _id != $postId]{
              _id,
              title,
              slug,
              image{
                asset->{
                  _id,
                  url
                },
                alt
              }
            }`,
        { postId }
      )
      .then((data) => {
        setSimilarPosts(data);
      })
      .catch(console.error);
  }, [postTitle, postId]);

  return (
    <>
      {similarPosts && similarPosts.length > 0 ? (
        <div className="mt-24">
          <RenderPosts posts={similarPosts} />
        </div>
      ) : (
        <p className="text-center">We couldn't find any similar posts.</p>
      )}
    </>
  );
};

export default SimilarPosts;
