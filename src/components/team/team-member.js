import {
  ListItem,
  ListItemText,
  Typography,
  withStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { Link } from "gatsby-theme-material-ui";
import React from "react";

export const TeamMember = withStyles({
  root: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  name: {},
  role: {
    "&.MuiTypography-body2": {
      display: "block",
      marginBottom: 0 + "!important",
      paddingRight: "1rem",
    },
  },
})(({ classes, className, name, url, roles, ...props }) => {
  const primary = url ? <Link to={url}>{name}</Link> : name;
  const secondary =
    roles &&
    roles.length > 0 &&
    roles.map((r) => (
      <Typography component="span" className={classes.role} variant="body2">
        {r}
      </Typography>
    ));
  return (
    <ListItem
      className={clsx(classes.root, className)}
      disableGutters
      {...props}
    >
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  );
});
