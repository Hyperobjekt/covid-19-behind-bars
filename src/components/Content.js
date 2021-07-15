import { withStyles } from "@material-ui/core";
import { Block } from "@hyperobjekt/material-ui-website";

/** base content page block wrapper */
const Content = withStyles((theme) => ({
  root: {
    paddingTop: 0,
  },
  container: {
    margin: "auto",
    paddingBottom: theme.spacing(6),
    maxWidth: `41.5rem`,
    "& > .MuiTypography-root": {
      marginBottom: `1rem`,
      "& + .MuiList-root": {
        marginTop: 0,
      },
    },
    "& .MuiListItem-root > .MuiTypography-root": {
      marginBottom: `0.5rem`,
    },
    "& h1,h2,h3,h4,h5,h6": {
      marginTop: `1.5em`,
    },
    "& a": {
      color: theme.palette.text.primary,
      textDecoration: "underline",
      textUnderlineOffset: "3px",
      textDecorationColor: theme.palette.secondary.main,
    },
  },
}))(Block);

export default Content;
