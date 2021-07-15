import React from "react";
import { graphql } from "gatsby";
import { getMdxProps } from "gatsby-theme-hypercore/src/templates/page";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "gatsby-theme-hypersite/src/layout";
import { GatsbyImage } from "gatsby-plugin-image";
import {
  PostHeroBlock,
  PostRelatedBlock,
  PostContentBlock,
  PostSocialLinks,
  postDataToProps,
} from "../components/blog";

const BlogPostTemplate = (props) => {
  const { mdx, allMdx } = props.data;
  const post = postDataToProps(mdx);
  const postNode = allMdx.edges.find((edge) => edge.node.id === mdx.id);
  const nextPost = postNode && postDataToProps(postNode.next);
  const previousPost = postNode && postDataToProps(postNode.previous);
  const { body, ...mdxProps } = getMdxProps(props);
  // fallback title if it is not set in metadata
  if (!mdxProps.meta.title) mdxProps.meta.title = post.title;
  // fallback description if it is not set in metadata
  if (!mdxProps.meta.description) mdxProps.meta.description = post.description;
  return (
    <Layout post={post} {...mdxProps} {...props}>
      <PostHeroBlock {...post} />
      <PostSocialLinks
        className="HypPostContent-social"
        shareText={post.title}
        baseUrl="https://uclacovidbehindbars.org"
      />
      <PostContentBlock
        bgcolor="background.paper"
        ContainerProps={{ style: { position: "relative" } }}
      >
        {post.image && (
          <GatsbyImage
            className="HypPostContent-featuredImage"
            image={post.image}
          />
        )}
        <MDXRenderer {...{ previousPost, nextPost, post, ...mdxProps }}>
          {body}
        </MDXRenderer>
      </PostContentBlock>
      {(previousPost || nextPost) && (
        <PostRelatedBlock {...{ previousPost, nextPost }} />
      )}
    </Layout>
  );
};
export default BlogPostTemplate;

export const query = graphql`
  query ($id: String!) {
    # get post itself (could instead pull this data off allMdx node by path === $pathSlug)
    mdx(id: { eq: $id }) {
      id
      slug
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
          author
        }
        date
        name
        description
        category
        image {
          childImageSharp {
            gatsbyImageData(
              transformOptions: { fit: CONTAIN, cropFocus: CENTER }
              width: 1200
            )
          }
        }
        path
      }
      body
    }
    # get all posts to connect the next/prev
    allMdx(
      sort: { fields: frontmatter___date, order: ASC }
      filter: { frontmatter: { category: { eq: "blog" } } }
    ) {
      edges {
        node {
          id
        }
        next {
          slug
          frontmatter {
            meta {
              author
            }
            name
            description
            path
            date
          }
        }
        previous {
          slug
          frontmatter {
            meta {
              author
            }
            name
            description
            path
            date
          }
        }
      }
    }
  }
`;
