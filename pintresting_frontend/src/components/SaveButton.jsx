import React, { useState, useEffect } from "react";
import { client } from "../client";
client;

const SaveButton = ({ postId, userId }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // check if user saved the post
    client
      .fetch(
        `*[_type == "post" && _id == $postId]{
      savedBy[]->{
        _id
      }
    }[0]`,
        { postId }
      )
      .then((res) => {
        if ( 
          res &&
          res.savedBy &&
          res.savedBy.some((user) => user._id === userId)
        ) {
          setIsSaved(true);
        }
      });
  }, []);

  const handleSave = () => {
    if (isSaved) {
      // remove the user from save list if they click the button again
      client
        .fetch(
          `*[_type == "post" && _id == $postId]{
            savedBy[]->{
              _id
            }
          }[0]`,
          { postId }
        )
        .then((res) => {
          if (res && res.savedBy) {
            const newSavedBy = res.savedBy.filter(
              (user) => user._id !== userId
            );
            client
              .patch(postId)
              .set({ savedBy: newSavedBy })
              .commit()
              .then(() => setIsSaved(false));
          }
        });
    } else {
      // if they didnt save the post add them to the list of people who saved it
      client
        .patch(postId)
        .setIfMissing({ savedBy: [] })
        .append("savedBy", [{ _type: "reference", _ref: userId, _key: userId }])
        .commit()
        .then(() => setIsSaved(true));
    }
  };

  return (
    <button
      className="bg-cta-500 hover:bg-cta-700
              text-white
              rounded rounded-2xl
              m-3 px-5 py-2 font-semibold"
      onClick={handleSave}
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  );
};

export default SaveButton;
