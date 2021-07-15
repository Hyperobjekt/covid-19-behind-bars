import { createMuiTheme } from "@material-ui/core";
import { deepmerge } from "@material-ui/utils";
import { fade as alpha, fade } from "@material-ui/core/styles";

/**
 * Content container widths
 */
export const CONTENT_MAXWIDTH_LG = 1360; // 1280+
export const CONTENT_MAXWIDTH_XL = 1600; // 1920+

/**
 * Base theme definitions
 */
const base = {
  palette: {
    primary: {
      main: "#414A3E",
    },
    secondary: {
      main: "#D7790F",
    },
    background: {
      default: "#F9FCF8",
      paper: "#fff",
      alt1: "#FEF3E7",
      alt2: "#F5F5ED",
      alt3: "#FBFBF7",
    },
    text: {
      primary: "#283224",
      secondary: "#555526",
      tertiary: "rgba(85, 85, 38, 0.666)",
    },
    action: {
      hover: fade("#555526", 0.05),
      selected: fade("#555526", 0.1),
      active: fade("#555526", 0.2),
    },
  },

  columnSpacing: (n) => `${n * (100 / 12)}vw`,
  spacing: (factor) => `${0.5 * factor}rem`,
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: "neue-haas-grotesk-display, sans-serif",
    // typography scale
    h1: {
      fontSize: `3rem`,
    },
    h2: {
      fontSize: `2.125rem`,
    },
    h3: { fontSize: `1.625rem` },
    h4: {
      fontSize: "1.5rem",
    },
    h5: { fontSize: `1.25rem` },
    h6: { fontSize: `1rem` },
  },
  // only one level of shadows
  shadows: [
    "none",
    "0 3px 4px rgba(0,0,0,0.2)",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
  overrides: {
    MuiCssBaseline: {
      "@global": {
        ":root": { "--reach-skip-nav": 1 },
        code: {
          background: "#eee",
        },
      },
    },
    HypCodeBlock: {
      root: {
        fontFamily: ["Fira Mono", "monospace"].join(","),
        backgroundColor: "#021029!important",
      },
    },
  },
};

export const sansSerifyTypography = {
  fontFamily: "neue-haas-grotesk-display, sans-serif",
  textTransform: "none",
};

export const serifTypography = {
  fontFamily: "plantin, serif",
  textTransform: "none",
};
export const titleTypography = {
  fontFamily: `"Champion Middlewt A", "Champion Middlewt B", "Impact", sans-serif`,
  fontStyle: "normal",
  fontWeight: 400,
  textTransform: "uppercase",
};
export const compactTitleTypography = {
  fontFamily: `"Champion Featherwt A", "Champion Featherwt B", "Oswald", "Impact", sans-serif`,
  fontStyle: "normal",
  fontWeight: 400,
  textTransform: "uppercase",
};
export const subtitleTypography = {
  fontFamily: `"Champion Bantamwt A", "Champion Bantamwt B", "Impact", sans-serif`,
  fontStyle: "normal",
  fontWeight: 400,
  textTransform: "uppercase",
};

/**
 * A function that accepts site context (currently only `isDarkMode`)
 * and returns a theme object that is applied to the site.
 */
const CovidTheme = () => {
  // create a base theme to utilize theme values and functions
  const theme = createMuiTheme(base);
  // console.log("theme, ", theme)

  const headingStyles = {
    ...serifTypography,
  };
  // build overrides
  const overrides = {
    overrides: {
      /** Site wide global style overrides */
      MuiCssBaseline: {
        "@global": {
          // remove overflow from html to prevent shift on menu open
          html: {
            overflowX: "visible",
            // boost the font size when there is enough horizontal / vertical space
            // this will resize all elements that use rem values or theme.spacing functions
            [`@media (min-width: ${theme.breakpoints.values["lg"]}px) and (min-height: 666px)`]:
              {
                fontSize: 18,
              },
            [`@media (min-width: ${theme.breakpoints.values["xl"]}px) and (min-height: 666px)`]:
              {
                fontSize: 20,
              },
          },
          a: {
            "&:not([class])": {
              color: theme.palette.text.primary,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              textDecorationColor: theme.palette.secondary.main,
            },
            "&:not([class]):visited": {
              color: theme.palette.text.primary,
            },
            "&:not([class]):hover": {
              textDecoration: "underline",
            },
          },
          // update padding and font on <code> elements
          code: {
            padding: `2px ${theme.spacing(1)}px`,
            borderRadius: theme.shape.borderRadius,
            fontFamily: ["Fira Mono", "monospace"].join(","),
          },
          ".HypSocialLinks-root svg": {
            fontSize: 18, // reduce size of social share icons
          },
          /** Global react-tooltip overrides */
          ".ucla-tooltip": {
            fontSize: "14px!important",
            padding: "0.75rem 1rem!important",
            borderRadius: "4px!important",
            border: "none!important",
          },
          /** Utility Classes */
          ".w-700": {
            fontWeight: 700,
          },
          ".sans-serif": {
            ...sansSerifyTypography,
          },
          ".body-xs": {
            fontSize: theme.typography.pxToRem(12),
          },
          ".body-sm": {
            fontSize: theme.typography.pxToRem(14),
          },
          ".body-md": {
            fontSize: theme.typography.pxToRem(16),
          },
          ".body-lg": {
            fontSize: theme.typography.pxToRem(18),
          },
        },
      },
      /** Add margins to material UI typography */
      MuiTypography: {
        h1: headingStyles,
        h2: { ...headingStyles, fontSize: theme.typography.pxToRem(34) },
        h3: { ...headingStyles, fontSize: theme.typography.pxToRem(26) },
        h4: headingStyles,
        h5: headingStyles,
        h6: headingStyles,
        body1: {
          ...serifTypography,
          letterSpacing: `0.01em`,
        },
        body2: {
          ...sansSerifyTypography,
          color: theme.palette.text.secondary,
          letterSpacing: `0.01em`,
        },
        caption: {
          ...sansSerifyTypography,
          color: theme.palette.text.tertiary,
          fontSize: theme.typography.pxToRem(12),
          lineHeight: 1.43,
          "& a:not([class])": {
            color: theme.palette.text.tertiary,
          },
        },
      },
      MuiLink: {
        root: {
          color: theme.palette.text.primary,
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          textDecorationColor: theme.palette.secondary.main,
        },
        underlineHover: {
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          textDecorationColor: theme.palette.secondary.main,
        },
      },
      MuiListItem: {
        root: {
          ...serifTypography,
          fontSize: "1rem",
        },
      },
      MuiInputBase: {
        input: {
          padding: `10px 0 9px`,
          fontSize: theme.typography.pxToRem(14),
          letterSpacing: "0.03em",
          ...sansSerifyTypography,
        },
      },
      MuiTooltip: {
        tooltip: {
          backgroundColor: `rgba(32,32,32,0.9)`,
          padding: theme.spacing(1.5, 2),
          fontSize: 14,
          borderRadius: 4,
          lineHeight: 18.2 / 14,
        },
        arrow: {
          color: fade(theme.palette.text.primary, 0.9),
        },
      },
      MuiButton: {
        root: {
          ...sansSerifyTypography,
          background: "transparent",
          border: "1px solid",
          borderColor: "#92926C",
          color: theme.palette.text.secondary,
          fontSize: theme.typography.pxToRem(15),
          letterSpacing: "0.03em",
        },
        text: {
          padding: theme.spacing(0.5, 3),
        },
      },
      MuiButtonGroup: {
        root: {
          "& .active": {
            background: alpha("#A75E0C", 0.1),
            color: "#A75E0C",
            borderColor: "#A75E0C",
          },
          "& .active + .MuiButton-root": {
            borderLeftColor: "#A75E0C",
          },
          "& .active:hover": {
            background: alpha("#A75E0C", 0.25),
            borderColor: "#A75E0C",
          },
        },
      },
      MuiIconButton: {
        root: {
          color: theme.palette.text.secondary,
        },
      },
      MuiSelect: {
        icon: {
          color: theme.palette.text.secondary,
        },
      },
      MuiPopover: {
        paper: {
          boxShadow: `0 0 0 1px #DDDDCB`,
        },
      },
      MuiMenuItem: {
        root: {
          padding: theme.spacing(1, 2),
          borderBottom: `1px dotted #DDDDCB`,
        },
      },
      /** Page level overrides */
      HypPage: {
        root: {
          "&.page": {
            position: "relative",
            right: "auto",
            bottom: "auto",
          },
          // no header box shadow when there's a section nav
          "&.HypPage-states .HypHeader-root": {
            boxShadow: "none",
          },
          "&.HypPage-federal .HypHeader-root": {
            boxShadow: "none",
          },
          "&.page.page--home .logo": {
            clipPath: `inset(0px 152px 0px 0px)`,
          },
        },
      },
      HypContainer: {
        root: {
          [theme.breakpoints.up("lg")]: {
            maxWidth: CONTENT_MAXWIDTH_LG,
          },
          [theme.breakpoints.up("xl")]: {
            maxWidth: CONTENT_MAXWIDTH_XL,
          },
        },
      },
      /** Header style overrides */
      HypHeader: {
        root: {
          boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.05)",
          background: "#fff",
          borderBottom: `none`,
          // hide social links on mobile
          [theme.breakpoints.down("sm")]: {
            "& .HypSocialLinks-root": {
              display: "none",
            },
          },
        },
        toolbar: {},
        shrunk: {
          // boxShadow: `inset 0 -1px 0 #DDDDCB`,
          // "& .header__branding": {
          //   opacity: 1,
          // },
        },
        title: {
          color: theme.palette.text.primary,
          marginTop: 0,
        },
        nav: {
          "& a": {
            color: theme.palette.text.primary,
          },
        },
        menuButton: {
          height: theme.spacing(6),
          color: theme.palette.text.primary,
          marginTop: "auto",
          marginBottom: "auto",
        },
      },

      HypNavigation: {
        link: {
          ...sansSerifyTypography,
          fontSize: theme.typography.pxToRem(16),
        },
      },

      /** Content area style overrides */
      HypContent: {
        root: {
          maxWidth: "38.5rem",
          // override link colors in content
          "& .MuiLink-root.MuiTypography-root": {
            color: theme.palette.text.primary,
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            textDecorationColor: theme.palette.secondary.main,
          },
          // unset bottom padding
          "& > .block:last-child": {
            paddingBottom: undefined,
          },
          // add columns to Project Team page
          "& > .columns2": {
            display: "flex",
            flexDirection: "row",
            paddingBottom: 56,
            [theme.breakpoints.down("xs")]: {
              display: "block",
            },
          },
          "& > .columns2 .columnChild": {
            flex: 1,
            paddingRight: 24,
          },
        },
      },
      /** Code block style overrides */
      HypCodeBlock: {
        root: {
          borderRadius: 0,
          [theme.breakpoints.up(780)]: {
            borderRadius: theme.shape.borderRadius,
          },
        },
      },
    },
    /** Apply default props to components */
    props: {
      // Name of the component ⚛️
      MuiButtonBase: {
        variant: "contained", // All buttons have "contained" appearance
      },
    },
    layout: {
      headerHeight: "64px",
    },
  };
  // return the merged base theme with overrides
  return deepmerge(theme, overrides);
};

export default CovidTheme();
