import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import {
  CONTENT_MAXWIDTH_LG,
  CONTENT_MAXWIDTH_XL,
  subtitleTypography,
} from "../../gatsby-theme-hypercore/theme";
import PostTeaser from "./post-teaser";
import { Block } from "@hyperobjekt/material-ui-website";

const LinkedBlock = withStyles((theme) => ({
  root: {
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 0,
    },
  },
  container: {
    background: theme.palette.background.alt3,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    marginRight: 0, // shift container so it is pushed to the right side of the page
    // extend container widths at different resolutions, so left margin aligns with content
    [theme.breakpoints.up("sm")]: {
      maxWidth: `calc((100% - 6rem) + ((100vw - (100% - 6rem)) / 2))`,
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: theme.spacing(12),
      maxWidth: `calc((${CONTENT_MAXWIDTH_LG}px - 15rem) + ((100vw - (${CONTENT_MAXWIDTH_LG}px - 15rem)) / 2))`,
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: `calc((${CONTENT_MAXWIDTH_XL}px - 15rem) + ((100vw - (${CONTENT_MAXWIDTH_XL}px - 15rem)) / 2))`,
    },
  },
}))(Block);

const styles = (theme) => ({
  sectionTitle: {
    ...subtitleTypography,
    color: theme.palette.secondary.main,
    fontSize: theme.typography.pxToRem(28),
    letterSpacing: 18 / 25,
    marginTop: 0,
    marginBottom: theme.spacing(5),
  },
  root: {
    paddingBottom: theme.spacing(2),
  },
});

const RelatedBlock = ({ classes, nextPost, previousPost }) => {
  const post = nextPost || previousPost;
  if (!post) {
    return null;
  }
  const sectionTitle = (nextPost ? "next" : "previous") + " post";
  return (
    <LinkedBlock bgcolor="background.paper">
      <div className={classes.root}>
        <Typography
          variant="h2"
          component="h2"
          className={classes.sectionTitle}
        >
          {sectionTitle}
        </Typography>
        <PostTeaser {...post} />
      </div>
    </LinkedBlock>
  );
};

export default withStyles(styles)(RelatedBlock);
