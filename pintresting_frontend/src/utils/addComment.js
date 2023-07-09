import { client } from "../client";

export function submitComment(postId, comment, setTextAreaValue, setPost) {
  client
    .patch(postId)
    .setIfMissing({ comments: [] })
    .append("comments", [comment])
    .commit()
    .then((res) => {
      console.log("Comment added:", res);
      setTextAreaValue("");
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), comment],
      }));
    })
    .catch((err) => {
      console.error("Error adding comment:", err);
    });
}
