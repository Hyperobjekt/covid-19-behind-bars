import React from "react";
import { withStyles } from "@material-ui/core";
import { subtitleTypography } from "../../gatsby-theme-hypercore/theme";
import clsx from "clsx";
import FeaturedPost from "./featured-post";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(14),
    background: theme.palette.background.alt3,
    paddingLeft: theme.columnSpacing(1),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.columnSpacing(2),
      marginLeft: theme.columnSpacing(1),
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

/**
 * Featured post section on the index
 */
function FeaturedBlock({ classes, className, title, post }) {
  return (
    <div className={clsx(classes.root, className)}>
      <h2 className={classes.title}>{title}</h2>
      <FeaturedPost {...post} isFeatured={true} />
    </div>
  );
}

export default withStyles(styles)(FeaturedBlock);
