import React from "react";
import { graphql } from "gatsby";
import { getMdxProps } from "gatsby-theme-hypercore/src/templates/page";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "gatsby-theme-hypersite/src/layout";
import Content from "../components/Content";

const PageTemplate = (props) => {
  const { body, ...mdxProps } = getMdxProps(props);
  return (
    <Layout {...mdxProps} {...props}>
      {body && (
        <Content>
          <MDXRenderer {...mdxProps} {...props}>
            {body}
          </MDXRenderer>
        </Content>
      )}
    </Layout>
  );
};

export const pageQuery = graphql`
  query UclaPageQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      slug
      timeToRead
      tableOfContents
      wordCount {
        sentences
        words
      }
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
        embeddedImages {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
        store {
          key
          value
        }
      }
    }
  }
`;

export default PageTemplate;
