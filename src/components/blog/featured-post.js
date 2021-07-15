import { withStyles } from "@material-ui/core";
import { compactTitleTypography } from "../../gatsby-theme-hypercore/theme";
import PostTeaser from "./post-teaser";

const FeaturedPost = withStyles((theme) => ({
  title: {
    ...compactTitleTypography,
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(48),
    lineHeight: 1.1,
    maxWidth: "10em",
    "& a": {
      color: theme.palette.text.secondary,
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: theme.typography.pxToRem(62),
    },
  },
}))(PostTeaser);

export default FeaturedPost;
