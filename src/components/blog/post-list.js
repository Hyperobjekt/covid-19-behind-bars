import React from "react";
import PostTeaser from "./post-teaser";

/** Renders a list of posts */
const PostList = ({ posts }) => {
  return (
    <>
      {posts.map((p) => (
        <PostTeaser {...p} key={p.url} />
      ))}
    </>
  );
};

export default PostList;
