import { Typography } from "@material-ui/core";
import React from "react";
import { TeamList } from "./team-list";

export const TeamBlock = ({
  name,
  members = [],
  headingComponent = "h3",
  ...props
}) => {
  return (
    <div {...props}>
      <Typography variant={headingComponent} component={headingComponent}>
        {name}
      </Typography>
      <TeamList members={members} />
    </div>
  );
};
