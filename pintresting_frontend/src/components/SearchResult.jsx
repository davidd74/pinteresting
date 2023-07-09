import React, { useState, useEffect } from "react";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";
import { useParams } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { useSearchResults } from "../utils/useSearchResults";
import {RenderPosts} from "./RenderPosts";


const SearchResult = () => {
  const { query } = useParams(); // get query parameter
  const { searchResults, loading } = useSearchResults(query);

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center mt-72 align-center">
          <HashLoader color={"#E60023"} size={50} />
          <p className="mt-8 font-semibold ml-4">Finding pictures for you...</p>
        </div>
      ) : (
        <div className="flex xs:justify-center mt-28">
          {searchResults.length > 0 ? (
            <RenderPosts posts={searchResults}/>
          ) : (
            <p className="text-center font-semibold text-xl">We couldn't find the picture that you were looking for.</p>
          )}
        </div>
      )}
    </>
  );
};

export default SearchResult;
