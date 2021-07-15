import React from "react";
import { Block } from "@hyperobjekt/material-ui-website";
import { withStyles } from "@material-ui/core";
import { sansSerifyTypography } from "../../gatsby-theme-hypercore/theme";
import clsx from "clsx";
const styles = (theme) => ({
  root: {},
  content: {
    position: "relative",
    wordWrap: "break-word",
    margin: "auto",
    maxWidth: "43.5rem",
    // dividers within blog post
    "& > hr": {
      margin: theme.spacing(3, 0),
    },
    // headings within the blog post
    "& > h1, & > h2, & > h3, & > h4, & > h5, & > h6": {
      marginTop: "1.5em",
      marginBottom: "0.75em",
    },
    // default paragraph styles
    "& > p.MuiTypography-root": {
      marginBottom: "1.5em",
      fontSize: "1.2rem",
      // fontSize: theme.typography.pxToRem(16),
      // [theme.breakpoints.up('lg')]: {

      // }
    },
    "& > .MuiList-root .MuiTypography-root": {
      fontSize: "1.2rem",
    },
    "& > .MuiList-root .MuiListItem-root": {
      marginBottom: "1rem",
    },
    // image and figure margins
    "& > p > .gatsby-resp-image-wrapper, & > figure": {
      [theme.breakpoints.up("md")]: {
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(4),
        marginLeft: theme.spacing(-4),
        marginRight: theme.spacing(-4),
      },
      [theme.breakpoints.up("lg")]: {
        marginBottom: theme.spacing(6),
        marginTop: theme.spacing(6),
        marginLeft: theme.spacing(-6),
        marginRight: theme.spacing(-6),
      },
    },
    // image captions
    "& figcaption, & figcaption > p": {
      ...sansSerifyTypography,
      fontSize: theme.typography.pxToRem(14),
      fontStyle: "italic",
      margin: "auto",
      marginTop: theme.spacing(2),
      color: theme.palette.text.secondary,
      textAlign: "center",
      maxWidth: "36em",
    },
    // SCORECARD & VACCINE TABLE STYLES
    "& .scorecard-table, & .vaccine-table": {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginLeft: theme.columnSpacing(-1),
      marginRight: theme.columnSpacing(-1),
      width: `calc(100% + ${theme.columnSpacing(2)})`,
      maxWidth: "100vw",
      position: "relative",
      [theme.breakpoints.down("xs")]: {
        overflow: "auto",
      },
      [theme.breakpoints.up("md")]: {
        marginLeft: theme.columnSpacing(-0.5),
        marginRight: theme.columnSpacing(-0.5),
        width: `calc(100% + ${theme.columnSpacing(1)})`,
      },
      // links
      "& .MuiLink-root": {
        color: theme.palette.text.primary,
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        textDecorationColor: theme.palette.secondary.main,
      },
      // table body text
      "& .MuiTypography-body1": {
        ...sansSerifyTypography,
        fontSize: theme.typography.pxToRem(14),
      },
      "& .MuiTable-root": {
        position: "relative",
      },

      "& .MuiTableCell-head:nth-child(5), & .MuiTableCell-body:nth-child(2)": {
        minWidth: 100,
      },
      "& .MuiTableCell-head": {
        background: "#fff",
        fontWeight: 700,
        lineHeight: 1.333,
        verticalAlign: "bottom",
        textAlign: "center",
        zIndex: 999,
        borderBottom: `none`,
        boxShadow: `0 2px 0 ${theme.palette.text.primary}`,
        [theme.breakpoints.up("sm")]: {
          position: "sticky",
          top: 56,
        },
      },
      "& .MuiTableCell-head:first-child": {
        textAlign: "left",
      },
      "& .MuiTableCell-head span": {
        display: "block",
        fontWeight: 500,
        color: theme.palette.text.secondary,
      },
      "& .MuiTableCell-body": {
        textAlign: "center",
      },
      "& .MuiTableCell-body:first-child": {
        textAlign: "left",
      },
      "& .MuiTableCell-body span + span": {
        display: "block",
        margin: "auto",
        fontWeight: 500,
        color: theme.palette.text.secondary,
      },
      "& .MuiTableRow-root:nth-child(2) .MuiTableCell-body": {
        borderBottom: `1px solid ${theme.palette.text.primary}`,
      },
    },
    // letter grade
    "& .scorecard-table .MuiTableCell-body:nth-child(2) span:first-child": {
      fontWeight: 700,
      marginRight: 4,
      fontSize: theme.typography.pxToRem(16),
    },

    // END SCORECARD TABLE STYLES
    "& .continuousColumn": {
      [theme.breakpoints.up("sm")]: {
        columnCount: 2,
        columnGap: theme.spacing(3),
      },

      "& p": {
        [theme.breakpoints.only("sm")]: {
          fontSize: theme.typography.pxToRem(16),
        },
      },
    },
  },
  "& .HypPostContent-featuredImage": {
    [theme.breakpoints.up("sm")]: {
      width: "110%",
      marginLeft: "-5%",
      marginBottom: theme.spacing(4),
    },
    [theme.breakpoints.up("md")]: {
      marginBottom: theme.spacing(6),
    },
    [theme.breakpoints.up("lg")]: {
      marginBottom: theme.spacing(8),
    },
    marginBottom: theme.spacing(2),
  },
});

export const PostContentBlock = ({
  classes,
  className,
  children,
  ContainerProps = {},
  ...props
}) => {
  return (
    <Block
      className={clsx("HypPostContent-root", classes.root, className)}
      ContainerProps={{
        className: clsx("HypPostContent-content", classes.content),
        ...ContainerProps,
      }}
      {...props}
    >
      {children}
    </Block>
  );
};
export default withStyles(styles)(PostContentBlock);
