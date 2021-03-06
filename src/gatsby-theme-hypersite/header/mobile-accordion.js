import React from "react";
import clsx from "clsx";
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  NativeSelect as MuiNativeSelect,
  Typography,
  makeStyles,
  withStyles,
  List,
  ListItem,
} from "@material-ui/core";
import { Link } from "gatsby-theme-material-ui";
import { navigate } from "gatsby";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import { sansSerifyTypography } from "../../gatsby-theme-hypercore/theme";
import useSiteLinks from "../../common/hooks/use-site-links";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(22),
    fontWeight: 500,
  },
  link: {
    ...sansSerifyTypography,
    fontSize: theme.typography.pxToRem(16),
  },
}));

const NativeSelect = withStyles((theme) => ({
  root: {
    fontSize: theme.typography.pxToRem(16),
    padding: theme.spacing(1),
    "&:before": { display: "none" },
    "& .MuiNativeSelect-icon": {
      top: `calc(50% - 10px)`,
    },
  },
}))(MuiNativeSelect);

const Accordion = withStyles((theme) => ({
  root: {
    border: "1px solid #F1F1EB",
    "&:first-of-type": {
      borderTop: 0,
    },
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
}))(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
  root: {
    borderBottom: "1px solid #F1F1EB",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 1),
  },
}))(MuiAccordionDetails);

export default function MobileAccordion(props) {
  const classes = useStyles();
  const menuLinks = useSiteLinks();

  // close menu and navigate on state selection
  const handleSelect = (event) => {
    // setIsNavOpen(false);
    navigate(event.target.value);
  };
  const handleLinkClick = () => {
    // setIsNavOpen(false);
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleAccordionToggle = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div {...props}>
      {menuLinks
        .filter((m) => ["all", "header"].includes(m.location.toLowerCase()))
        .map((menuItem) => {
          const subMenuItems = menuItem.subMenu.filter(
            (item) => !item.link.includes("states/")
          );
          const stateDropdownItems = menuItem.subMenu.filter((item) =>
            item.link.includes("states/")
          );

          return (
            <Accordion
              key={menuItem.link}
              expanded={expanded === menuItem.name}
              onChange={handleAccordionToggle(menuItem.name)}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDown />}
                aria-controls={menuItem.link + "-content"}
                id={menuItem.link + "-header"}
              >
                <Typography variant="body" className={classes.heading}>
                  {menuItem.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {!!stateDropdownItems.length && (
                    <ListItem>
                      <NativeSelect onChange={handleSelect}>
                        <option value="">State</option>
                        {stateDropdownItems.map((opt) => (
                          <option key={opt.link} value={opt.link}>
                            {opt.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </ListItem>
                  )}
                  {subMenuItems.map((subMenuItem) => {
                    return (
                      <ListItem key={subMenuItem.name}>
                        <Link
                          className={clsx("SubMenu-link", classes.link)}
                          onClick={handleLinkClick}
                          to={subMenuItem.link}
                        >
                          {subMenuItem.name}
                        </Link>
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </div>
  );
}
