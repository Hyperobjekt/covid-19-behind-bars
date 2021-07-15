import { List, withStyles } from "@material-ui/core";
import React from "react";
import { TeamMember } from "./team-member";

export const TeamList = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "wrap",
      "& > .MuiListItem-root": {
        width: "50%",
      },
    },
  },
}))(({ members, ...props }) => {
  return (
    <List disablePadding {...props}>
      {members.map((member) => (
        <TeamMember key={member.name} {...member} />
      ))}
    </List>
  );
});
