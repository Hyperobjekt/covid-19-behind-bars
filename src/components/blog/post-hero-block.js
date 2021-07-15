import React from "react";
import Block from "gatsby-theme-hypersite/src/main/block";
import { Typography, withStyles } from "@material-ui/core";
import { compactTitleTypography } from "../../gatsby-theme-hypercore/theme";
import PostMeta from "./post-meta";

const styles = (theme) => ({
  hero: {
    [theme.breakpoints.up("md")]: {
      paddingRight: theme.columnSpacing(2),
    },
  },
  date: {
    fontSize: theme.typography.pxToRem(14),
  },
  postTitle: {
    ...compactTitleTypography,
    color: theme.palette.text.secondary,
    lineHeight: 1.05,
    margin: 0,
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(5),
    fontSize: theme.typography.pxToRem(55),
    [theme.breakpoints.up("sm")]: {
      fontSize: theme.typography.pxToRem(70),
    },
    [theme.breakpoints.up("md")]: {
      fontSize: theme.typography.pxToRem(85),
    },
  },
});

const PostHeroBlock = ({ classes, author, date, title, ...props }) => {
  return (
    <Block>
      <div className={classes.hero} {...props}>
        <PostMeta author={author} date={date} />
        <Typography variant="h2" component="h2" className={classes.postTitle}>
          {title}
        </Typography>
      </div>
    </Block>
  );
};

export default withStyles(styles)(PostHeroBlock);
