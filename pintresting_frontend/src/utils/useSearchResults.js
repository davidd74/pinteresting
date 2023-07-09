import { useState, useEffect } from "react";
import { client } from "../client";

export const useSearchResults = (query) => {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && title match $query]{
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
        { query: `${query}*` }
      )
      .then((data) => {
        setSearchResults(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [query]);

  return { searchResults, loading };
};