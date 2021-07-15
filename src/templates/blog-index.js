import React from "react";
import PageTemplate from "gatsby-theme-hypercore/src/templates/page";
import { graphql } from "gatsby";
import { createStyles, makeStyles } from "@material-ui/core";
import { postDataToProps } from "../components/blog";

/** Global page styles */
const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".HypMain-root": {
        background: theme.palette.background.paper,
      },
    },
  })
);

export default function BlogIndexTemplate(props) {
  useStyles();
  const postsData =
    props.data.allMdx.nodes.map((node) => {
      node.frontmatter.path = node.frontmatter.path || node.slug;
      return node;
    }) || [];
  const featuredPost = postsData.find((p) => p.frontmatter?.featured) || {};
  const otherPosts = postsData
    .filter((p) => p.id !== featuredPost.id)
    .map(postDataToProps);
  return (
    <PageTemplate
      featuredPost={postDataToProps(featuredPost)}
      posts={otherPosts}
      {...props}
    />
  );
}

export const pageQuery = graphql`
  query BlogIndexQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        meta {
          title
          description
          keywords
          image {
            childImageSharp {
              gatsbyImageData(
                transformOptions: { fit: COVER, cropFocus: CENTER }
                width: 1200
                height: 630
              )
            }
          }
          isBlogPost
        }
      }
    }
    allMdx(
      sort: { fields: frontmatter___date, order: DESC }
      filter: { frontmatter: { category: { eq: "blog" } } }
    ) {
      nodes {
        id
        slug
        frontmatter {
          meta {
            author
          }
          featured
          description
          name
          path
          date
        }
      }
    }
  }
`;
