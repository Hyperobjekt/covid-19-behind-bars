import React from "react";
import clsx from "clsx";
import FbIcon from "../../common/icons/fb-icon.svg";
import TwitterIcon from "@material-ui/icons/Twitter";
import EmailIcon from "@material-ui/icons/Email";
import IconButton from "@material-ui/core/IconButton";
import { useLocation } from "@reach/router";
import { Box, withStyles } from "@material-ui/core";
import { Block } from "@hyperobjekt/material-ui-website";

const styles = (theme) => ({
  root: {
    [theme.breakpoints.up("lg")]: {
      position: "sticky",
      top: theme.spacing(4),
    },
  },
  container: {
    position: "relative",
    margin: "auto",
  },
  button: {
    background: theme.palette.background.alt2,
    color: theme.palette.text.secondary,
    padding: "10px",
    marginRight: theme.spacing(1),
    width: theme.spacing(6),
    height: theme.spacing(6),
    "& a": {
      color: theme.palette.text.secondary + "!important",
      fontSize: "0",
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: "0",
      transform: "scale(0.8)",
    },
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing(6),
    [theme.breakpoints.up("lg")]: {
      position: "absolute",
      left: theme.spacing(5),
      top: 0,
      flexDirection: "column",
      // marginLeft: theme.spacing(-1),
      "& $button": {
        padding: "12px",
        marginBottom: theme.spacing(1),
      },
    },
  },
});

export const PostSocialLinks = ({
  classes,
  className,
  shareText,
  baseUrl,
  ...props
}) => {
  const location = useLocation();
  const url = baseUrl + location.pathname;

  const twitterClick = (e) => {
    window
      .open(
        `https://twitter.com/share?text=${shareText}&url=${url}`,
        "_blank",
        "width=550,height=420"
      )
      .focus();
  };

  const facebookClick = (e) => {
    window
      .open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank",
        "width=550,height=420"
      )
      .focus();
  };

  return (
    <Block
      bgcolor="background.paper"
      noPadding
      classes={{
        root: clsx(classes.root, className),
        container: classes.container,
      }}
      {...props}
    >
      <Box className={clsx(classes.buttonGroup)}>
        <IconButton className={classes.button} onClick={twitterClick}>
          <TwitterIcon />
        </IconButton>
        <IconButton className={classes.button} onClick={facebookClick}>
          <img alt="share on Facebook" src={FbIcon} />
        </IconButton>
        <IconButton className={classes.button}>
          <a
            target="_blank"
            href={`mailto:?subject=${shareText}&body=${url}`}
            rel="noreferrer"
          >
            <EmailIcon />
          </a>
        </IconButton>
      </Box>
    </Block>
  );
};

export default withStyles(styles)(PostSocialLinks);
