import { getImage } from "gatsby-plugin-image";

/**
 * Takes the data post object and maps it to <Post /> props
 */
export const postDataToProps = (post) => {
  if (!post || !post.frontmatter) return null;
  // grab attributes from post frontmatter
  const {
    date,
    name: title,
    description,
    image,
    category,
    path,
    meta,
  } = post.frontmatter;
  // check if path is set in the frontmatter, use that as the URL
  // otherwise use the auto-generated slug
  const url = path || post.slug;
  // make sure we use an absolute path for proper linking (e.g. "/blog/my-post" instead of "blog/my-post")
  const absoluteUrl = url[0] === "/" ? url : "/" + url;
  // pull author info if it exists
  const author = meta && meta.author;
  return {
    date,
    title,
    description,
    author,
    category,
    image: image && getImage(image),
    url: absoluteUrl,
  };
};
