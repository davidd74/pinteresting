import { useState, useEffect } from 'react';
import { client } from '../client';

const useSaveButton = (postId, userId) => {
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
  }, [postId, userId]);

  const handleSave = () => {
    if (isSaved) {
      // remove the user from save list if they click the button again
      client
        .patch(postId)
        .unset(['savedBy[_ref == $userId]'])
        .commit()
        .then(() => setIsSaved(false));
    } else {
      // if they didnt save the post add them to the list of people who saved it
      client
        .patch(postId)
        .setIfMissing({ savedBy: [] })
        .append('savedBy', [{ _type: 'reference', _ref: userId, _key: userId }])
        .commit()
        .then(() => setIsSaved(true));
    }
  };

  return { isSaved, handleSave };
};

export default useSaveButton;