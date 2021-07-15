import { withStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { subtitleTypography } from "../../gatsby-theme-hypercore/theme";
import PostList from "./post-list";

const styles = (theme) => ({
  root: {
    paddingTop: theme.spacing(13),
    paddingBottom: theme.spacing(13),
    paddingLeft: theme.columnSpacing(1),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.columnSpacing(2),
    },
  },
  title: {
    ...subtitleTypography,
    color: theme.palette.secondary.main,
    fontSize: theme.typography.pxToRem(32),
    letterSpacing: 12 / 25,
    margin: theme.spacing(0, 0, 4),
  },
});

const PostListBlock = ({ classes, className, title, posts, ...props }) => {
  return (
    <div className={clsx(classes.root, className)} {...props}>
      <h2 className={classes.title}>{title}</h2>
      <PostList posts={posts} />
    </div>
  );
};

export default withStyles(styles)(PostListBlock);
