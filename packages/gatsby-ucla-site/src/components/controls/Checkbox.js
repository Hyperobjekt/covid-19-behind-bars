import React from "react"
import clsx from "clsx"
import { fade, makeStyles } from "@material-ui/core/styles"
import { default as MuiCheckbox } from "@material-ui/core/Checkbox"

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: 0,
    width: 16,
    height: 16,
    boxShadow: "inset 0 0 0 1px #555526, inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "transparent",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: fade("#555526", 0.2),
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: fade("#555526", 0.333),
    },
  },
  checkedIcon: {
    backgroundColor: "transparent",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23555526'/%3E%3C/svg%3E\")",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: fade("#555526", 0.2),
    },
  },
})

export default function Checkbox({ className, ...props }) {
  const classes = useStyles()

  return (
    <MuiCheckbox
      className={clsx(classes.root, className)}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  )
}
