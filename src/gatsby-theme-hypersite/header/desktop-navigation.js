import React from "react";
import { withStyles } from "@material-ui/core";
import { sansSerifyTypography } from "../../gatsby-theme-hypercore/theme";
import { HorizontalNavigation } from "@hyperobjekt/material-ui-website";
import { useLocation } from "@reach/router";
/** number of cols for the subnav */
const cols = 5;

const styles = (theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  depth0: {
    height: 64,
    zIndex: 2,
    // health is justice link style
    "& $list > $listItem:nth-child(2) .HypNavigation-listItem:last-child": {
      borderTop: `1px solid ${theme.palette.divider}`,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z' /%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: `90% 50%`,
    },
  },
  depth1: {
    position: "absolute",
    top: 64,
    left: 1,
    zIndex: 1,
    width: "12rem",
    marginLeft: 0,
    transform: `translate3d(0, -10%, 0)`,
    pointerEvents: "none",
    background: theme.palette.background.paper,
    borderTop: `1px solid #F1F1EB`,
    transition: `transform 400ms ${theme.transitions.easing.easeInOut}, opacity 400ms ${theme.transitions.easing.easeInOut}`,
    opacity: 0,
    display: "block",
    // height: theme.typography.pxToRem(264),
    // padding: theme.spacing(0, 0),
    boxShadow: `0px 5px 10px rgb(0 0 0 / 5%)`,
    "& $list": {},
    "& $listItem": {},
    "& $link": {
      ...sansSerifyTypography,
      fontSize: theme.typography.pxToRem(14),
    },
    "& $linkActive": {
      color: theme.palette.secondary.main,
    },
  },
  list: {
    display: "flex",
    height: "100%",
  },
  listItem: {
    zIndex: 999,
    "& .MuiSvgIcon-root": {
      transition: `transform 150ms ${theme.transitions.easing.easeInOut}, fill 200ms ${theme.transitions.easing.easeInOut} 0ms`,
    },
    "&:hover .MuiSvgIcon-root": {
      transform: "rotate(180deg)",
    },
    "&:first-child $depth1": {
      position: "fixed",
      top: 64,
      width: "100%",
      padding: theme.spacing(3),
      // by state nav items
      "& $list": {
        display: "block",
        columnCount: cols,
        marginLeft: theme.spacing(27),
        position: "relative",
        paddingTop: theme.spacing(5),
        "&:before": {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          content: "'By State'",
          paddingBottom: theme.spacing(1),
          paddingLeft: theme.spacing(2),
          display: "block",
          marginTop: 4,
          borderBottom: "1px solid",
          borderBottomColor: theme.palette.divider,
          color: theme.palette.text.secondary,
        },
      },

      "& $listItem": {
        display: "inline-block",
        // by federal agency nav items
        "&:first-child, &:nth-child(2)": {
          left: theme.spacing(-27),
        },
        "&:first-child": {
          position: "absolute",
          top: theme.spacing(5),
          width: theme.spacing(25),
          "&:before": {
            position: "absolute",
            top: theme.spacing(-5),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            content: "'By Federal Agency'",
            display: "block",
            marginTop: theme.spacing(0.5),
            width: theme.spacing(25),
            borderBottom: "1px solid",
            borderBottomColor: theme.palette.divider,
            color: theme.palette.text.secondary,
          },
        },
        "&:nth-child(2)": {
          position: "absolute",
          width: theme.spacing(25),
          top: theme.spacing(8.5),
        },
        // by state nav items
        "&:nth-child(3)": {},
      },
      "& $link": {
        display: "inline-flex",
        alignItems: "center",
        minHeight: theme.spacing(3.5),
        paddingTop: theme.spacing(0.25),
        paddingBottom: theme.spacing(0.25),
      },
    },
    "&:hover $depth1, &:focus-within $depth1": {
      pointerEvents: "all",
      transform: "translate3d(0, 0, 0)",
      opacity: 1,
    },
  },
  link: {
    ...sansSerifyTypography,
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  linkActive: {
    fontWeight: "bold",
  },
});

const StyledNavigation = withStyles(styles)(HorizontalNavigation);

const hasChildUrl = (links, url) => Boolean(getChildLinkItem(links, url));

/**
 * Returns true if any of the provided links (or child links) contain the provided URL
 * @param {Array<{name, link, subMenu}>} links
 * @param {string} url
 * @returns {boolean}
 */
const getChildLinkItem = (links, url) => {
  if (!links || links.length === 0) return false;
  return links.find(
    (linkItem) =>
      linkItem.link === url || getChildLinkItem(linkItem.subMenu, url)
  );
};

/**
 * Changes the "Explore Data" link item to the child name if viewing a page in that section
 * otherwise, returns the linkItem.name prop
 * @param {*} linkItem
 * @param {*} url
 */
const getLinkName = (linkItem, url) => {
  if (linkItem.name === "Explore Data" || url.indexOf("/states/") > -1) {
    const currentLinkItem = getChildLinkItem(linkItem.subMenu, url);
    return currentLinkItem ? currentLinkItem.name : linkItem.name;
  }
  return linkItem.name;
};

export default function UclaNavigation({ links, ...props }) {
  const { pathname } = useLocation();
  // add active state to links
  const updatedLinks = links.map((linkItem) => ({
    ...linkItem,
    name: getLinkName(linkItem, pathname), // change the name of "Explore Data" to active data page if needed
    active: hasChildUrl(linkItem.subMenu, pathname), // set active state on top level if its subMenu contains the active page
  }));
  return <StyledNavigation links={updatedLinks} {...props} />;
}
