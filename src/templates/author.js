import React from "react";
import { graphql } from "gatsby";
import Layout from "gatsby-theme-hypersite/src/layout";
import {
  Box,
  ListItem,
  Typography,
  List,
  ListItemText,
} from "@material-ui/core";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { getMdxProps } from "gatsby-theme-hypercore/src/templates/page";
import { Block } from "@hyperobjekt/material-ui-website";
const PageTemplate = (props) => {
  const { body, ...mdxProps } = getMdxProps(props);
  const {
    frontmatter: { name, image },
  } = props.data.mdx;
  const posts = props.data.allMdx.nodes
    .map((node) => ({
      authors: node.frontmatter.meta.author || [],
      path: node.frontmatter.path || node.slug,
      name: node.frontmatter.name,
      date: node.frontmatter.date,
    }))
    .filter((post) => post.authors.indexOf(name) > -1);
  if (!mdxProps.meta.title) mdxProps.meta.title = `Posts by ${name}`;
  return (
    <Layout {...mdxProps}>
      <Block>
        <Box mb={3} maxWidth="50em">
          <Box display="flex">
            <Typography gutterBottom variant="h1">
              {name}
            </Typography>
            {image && (
              <Box
                clone
                borderRadius="50%"
                width={52}
                height={52}
                ml={2}
                mt={0.5}
              >
                <GatsbyImage image={getImage(image)} alt={`Photo of ${name}`} />
              </Box>
            )}
          </Box>
          {body && <MDXRenderer>{body}</MDXRenderer>}
        </Box>

        <List>
          {posts &&
            posts.map(({ name, path, date }) => (
              <ListItem disableGutters>
                <ListItemText
                  primary={<Link to={`/${path}`}>{name}</Link>}
                  secondary={date}
                />
              </ListItem>
            ))}
        </List>
      </Block>
    </Layout>
  );
};

export const pageQuery = graphql`
  query AuthorQuery($id: String) {
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
        name
        image {
          childImageSharp {
            gatsbyImageData(
              transformOptions: { fit: COVER, cropFocus: CENTER }
              width: 128
              height: 128
            )
          }
        }
      }
    }
    allMdx(
      filter: { frontmatter: { template: { eq: "blog" } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        slug
        frontmatter {
          meta {
            author
          }
          path
          name
          date(formatString: "LL")
        }
      }
    }
  }
`;

export default PageTemplate;
