import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import { Link } from "gatsby-theme-material-ui";
import slugify from "slugify";
import moment from "moment";

const Wrapper = withStyles((theme) => ({
  // different underline for blog author links (per mockup)
  root: {
    "& .MuiLink-underlineHover": {
      textDecorationColor: `rgba(85, 85, 38, 0.3)`,
      "&:hover": { textDecorationColor: theme.palette.secondary.main },
    },
    marginBottom: theme.spacing(3),
  },
}))(Typography);

const PostMeta = ({ author = [], date, ...props }) => {
  const formattedDate = moment(date).format("MMMM Do, YYYY");
  return (
    <Wrapper variant="body2" {...props}>
      {formattedDate}
      {author && author.length > 0 && " • "}
      {author &&
        author.map((a, i) => (
          <React.Fragment key={a}>
            <Link to={`/blog/authors/${slugify(a, { lower: true })}`}>{a}</Link>
            {/* {author.length === 2 && i === 0 && " and "} */}
            {author.length > 2 && i !== author.length - 1 && ", "}
            {author.length >= 2 && i === author.length - 2 && " and "}
          </React.Fragment>
        ))}
    </Wrapper>
  );
};

PostMeta.propTypes = {};

export default PostMeta;
