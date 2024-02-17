import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { getUser } from "../utils/getUser";
import { RiDeleteBin6Line } from "react-icons/ri";
import { client } from "../client";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const CreatePost = () => {
  const user = getUser();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [title, setTitle] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [postUploading, setPostUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setImageUploading(true);
      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setUploadedImage(document);
          console.log(document);
          setImageUploading(false);
        })
        .catch((error) => {
          console.log("Image upload error", error);
        });
    }
    {
      console.log("Wrong image type.");
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (title.trim() === "" || title.length > 65) {
      setTitleError("Title length must be between 1 and 65 characters.");
      isValid = false;
    } else {
      setTitleError("");
    }

    return isValid;
  };

  const publishPost = (title, uploadedImage) => {
    if (validateForm()) {
      const doc = {
        _type: "post",
        title,
        author: {
          _ref: user.sub,
          _type: "reference",
        },
        image: {
          asset: {
            _type: "reference",
            _ref: uploadedImage._id,
          },
        },
      };

      setPostUploading(true);
      client.create(doc).then(() => {
          setPostUploading(false);
      });
      navigate("/");
    }
  };

  return (
    <>
      {postUploading ? (
        <div className="flex flex-col justify-center items-center mt-72 align-center">
          <HashLoader color={"#E60023"} size={50} />
          <p className="mt-8 font-semibold">Your post is uploading...</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            publishPost(title, uploadedImage);
          }}
          className="xs:mt-12 xs:max-w-sm sm:max-w-lg lg:max-w-2xl xs:mt-12 max-w-sm mx-auto flex justify-between xs:flex-col bg-white xs:p-7 rounded-2xl shadow-bnbm mx-auto flex justify-between xs:flex-col bg-white xs:p-7 rounded-2xl shadow-bnb"
        >
          <div className="xs:w-full xs:h-72 lg:h-[30rem] bg-gray-100 p-4 rounded-xl mx-auto">
            {imageUploading ? (
              <div className="flex flex-col w-full h-full justify-center items-center align-center">
                <HashLoader color={"#E60023"} size={50} />
                <p className="mt-8 ml-4 font-semibold">
                  Uploading your image...
                </p>
              </div>
            ) : (
              <div className="border-2 border-gray-300 border-dashed w-full h-full rounded-lg relative">
                {uploadedImage && (
                  <>
                    <img
                      src={uploadedImage.url}
                      alt="Uploaded"
                      className="w-full h-full object-contain rounded-lg absolute top-0 left-0"
                    />
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                      }}
                      type="button"
                      className="bg-cta-500 hover:bg-cta-700 rounded-full p-2 absolute top-2 left-2"
                    >
                      <RiDeleteBin6Line color="white" fontSize={24} />
                    </button>
                  </>
                )}
                <label className="cursor-pointer flex flex-col justify-center items-center h-full">
                  {!uploadedImage && (
                    <>
                      <AiOutlineCloudUpload fontSize={30} />
                      <p className="mt-2 w-48 text-md font-semibold text-center">
                        Click to upload a file here.
                      </p>
                      <p className="w-5/6 mt-3 text-center text-xs">
                        Use high-quality .jpg images under 20MB.
                      </p>
                    </>
                  )}
                  <input
                    className="hidden"
                    type="file"
                    accept=".png,.jpg,.gif,.mp4"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
          </div>
          {/* second col */}

          <div className="flex flex-col gap-6 mt-6">
            <div>
              <input
                type="text"
                className="p-1 xs:w-full xs:text-xl border-gray-400 border-b-2 focus:border-blue-400 outline-none"
                placeholder="Post title (e.g. Dogs)"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              {titleError && <p className="text-red-500">{titleError}</p>}
            </div>

            <div className="">
              <div className="flex items-center gap-2">
                <img
                  src={user?.picture}
                  className="w-8 rounded-full"
                  alt="user-profile-picture"
                />
                <p>{user?.name}</p>
              </div>
              <button
                type="submit"
                className="
        bg-cta-500 hover:bg-cta-700 rounded-xl mt-6 py-3 px-12 text-white font-semibold"
              >
                Post
              </button>
            </div>

            <div></div>
          </div>
        </form>
      )}
    </>
  );
};

export default CreatePost;
