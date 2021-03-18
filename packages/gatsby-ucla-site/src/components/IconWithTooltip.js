import React from "react"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import InfoIcon from "../../content/assets/info-icon.svg"
import CloseIcon from "../../content/assets/close-icon.svg"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  iconWrapper: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary + " !important",
    textDecoration: "none !important",
    fontSize: theme.typography.pxToRem(14),
    display: "block",
    lineHeight: "30px",
    background: "none",
    border: "none",
    "& img": {
      paddingRight: theme.spacing(1),
      verticalAlign: "middle",
    },
    "&:hover": {
      "& img": {
        transform: "scale(1.1)",
        filter: "brightness(.98)",
      },
      color: "#353510 !important",
    },
  },
  close: {
    position: "absolute",
    right: "1.2rem",
    top: "1.2rem",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  tooltip: {
    zIndex: "2000 !important",
    padding: theme.spacing(3) + " !important",
    maxWidth: "80vw",
    [theme.breakpoints.up("sm")]: {
      maxWidth: "400px",
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "450px",
    },
  },
  title: {
    display: "block",
    fontSize: theme.typography.pxToRem(16),
    marginTop: 0,
    paddingBottom: theme.spacing(1),
    borderBottom: "dotted white 1px",
    marginBottom: theme.spacing(1),
  },
  note: {
    fontSize: theme.typography.pxToRem(14),
    "&:last-of-type": {
      marginBottom: 0,
    },
  },
}))

const IconWithTooltip = ({
  iconText = "Data notes",
  title = "Data notes",
  notes = [],
  id: idSuffix,
  ...props
}) => {
  const classes = useStyles()

  const id = "icon-tooltip-" + idSuffix
  return (
    <div className={classes.root}>
      <button className={classes.iconWrapper} data-tip data-for={id}>
        <img alt="info" src={InfoIcon} />
        {iconText}
      </button>

      <ReactTooltip
        className={classes.tooltip}
        place="top"
        id={id}
        effect="solid"
        arrowColor="transparent"
      >
        {title && <h4 className={classes.title}>{title}</h4>}
        {/* {children} */}
        <img alt="close" className={classes.close} src={CloseIcon} />
        {notes.map((note) => (
          <p className={classes.note} key={note}>
            {note}
          </p>
        ))}
      </ReactTooltip>
    </div>
  )
}

IconWithTooltip.propTypes = {
  id: PropTypes.string.isRequired,
  notes: PropTypes.array,
  title: PropTypes.string,
  iconText: PropTypes.string,
}

export default IconWithTooltip
