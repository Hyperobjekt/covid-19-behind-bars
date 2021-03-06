import React from "react";
import clsx from "clsx";
import { graphql, navigate } from "gatsby";
import Layout from "gatsby-theme-hypersite/src/layout";
import { makeStyles, Typography } from "@material-ui/core";
import { Step, Scrollama } from "@hyperobjekt/react-scrollama";
import {
  ResidentsSummary,
  Facilities,
  Filings,
  Releases,
  Scorecard,
  StaffSummary,
} from "../components/states/sections";
import useStatesStore from "../components/states/useStatesStore";
import shallow from "zustand/shallow";
import SectionNavigation from "../components/SectionNavigation";
import content from "../../content/lang/federal.json";
import { Block } from "@hyperobjekt/material-ui-website";

const useStyles = makeStyles((theme) => ({
  block: {
    padding: theme.spacing(0, 2),
    alignItems: "flex-start",
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(0, 3),
    },
  },
  // visual: {
  //   position: "sticky",
  //   top: `calc(${theme.layout.headerHeight} + 56px)`,
  //   width: `calc(100% - 26.25rem)`,
  //   // full vertical height, minus header
  //   height: `calc(100vh - ${theme.layout.headerHeight} - 56px)`,
  //   marginLeft: "auto",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "stretch",
  //   // make some space for the legend
  //   "& .rsm-svg": {
  //     flex: 1,
  //     maxHeight: `calc(100% - 5rem)`,
  //   },
  // },
  title: {
    marginTop: theme.spacing(0),
  },
  step: {
    display: "flex",
    //minHeight: `calc(100vh - ${theme.layout.headerHeight})`,
    padding: theme.spacing(3, 0),
  },
  first: {
    /*minHeight: `calc(100vh - ${theme.layout.headerHeight} - ${theme.spacing(
      10
    )})`,*/
  },
  content: {
    position: "relative",
    // DEPARTURES FROM STATES PAGES
    marginTop: `calc(${theme.layout.headerHeight} + 24px)`,

    "& .embedded-stats": {
      padding: theme.spacing(3, 2),
    },

    // mobile/tablet cards take full width
    "& .step-wrapper": {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      "& .step-wrapper": {
        width: "unset",
      },
      maxWidth: "44rem",
    },
    // break out of maxWidth to give space for full-width layout
    [theme.breakpoints.up("lg")]: {
      "& #scorecard": {
        marginRight: "-14rem",
      },
    },
    // HACK: filings overrides, need to restyle this page but this is here for now
    "& .filings": {
      width: `54rem`,
      "& .MuiBox-root .MuiBox-root": { marginLeft: `2rem`, transform: "none" },
    },
  },
}));

const SECTION_COMPONENTS = {
  residents: ResidentsSummary,
  staff: StaffSummary,
  facilities: Facilities,
  scorecard: Scorecard,
  filings: Filings,
  releases: Releases,
};

const StateTemplate = ({ pageContext, data }) => {
  // classes used on this page
  const classes = useStyles();
  const state = "Federal";
  // track current step index for scrollytelling
  const [currentStep, setCurrentStep, setStateName, setData, setContent] =
    useStatesStore(
      (state) => [
        state.currentStep,
        state.setCurrentStep,
        state.setStateName,
        state.setData,
        state.setContent,
      ],
      shallow
    );
  // set the state name in the store
  setStateName(state);
  // set the data in the store
  setData(data);
  // set the content for the page
  setContent(content);

  // update current step when entering
  const handleStepEnter = ({ data }) => {
    setCurrentStep(data);
  };

  const handleNavigation = (section) => {
    navigate("#" + section);
    setCurrentStep(section);
  };

  // setctions for section nav
  const sections = Object.values(content);
  const sectionNav = sections.map((section) => ({
    id: section.id,
    name: section.link,
  }));

  return (
    <Layout title={state}>
      <SectionNavigation
        current={currentStep}
        sections={sectionNav}
        onSelect={handleNavigation}
      />
      <Block>
        {/* <Visual className={classes.visual} /> */}
        <div className={classes.content}>
          <Scrollama onStepEnter={handleStepEnter}>
            {sections.map((section, index) => {
              const { id, ...lang } = section;
              const Component = SECTION_COMPONENTS[id];
              return (
                <Step key={id} data={id}>
                  <div id={id}>
                    {index === 0 && (
                      <Typography variant="h2" className={classes.title}>
                        Federal Facilities in the United States
                      </Typography>
                    )}
                    <Component
                      isFederal={true}
                      className={clsx(classes.step, {
                        [classes.first]: index === 0,
                      })}
                      data={data}
                      lang={lang}
                    />
                  </div>
                </Step>
              );
            })}
          </Scrollama>
        </div>
      </Block>
    </Layout>
  );
};

StateTemplate.propTypes = {};

export const query = graphql`
  query {
    allFacilities(filter: { jurisdiction: { eq: "federal" } }) {
      edges {
        node {
          city
          coords
          id
          jurisdiction
          name
          residents {
            active
            active_rate
            confirmed
            confirmed_rate
            deaths
            deaths_rate
            tested
            tested_rate
          }
          staff {
            active
            confirmed
            deaths
          }
        }
      }
    }
    allPrisonReleases(filter: { state: { eq: "Federal BOP" } }) {
      edges {
        node {
          id
          releases
          facility
          source
          state
          capacity
        }
      }
    }
    allFilings(filter: { state: { eq: "federal" } }) {
      edges {
        node {
          courtCount
          facilityCount
          granted
          total
        }
      }
    }
    scorecard: allScorecard(filter: { state: { eq: "Federal (BOP)" } }) {
      nodes {
        score
        date
        machine
        regularly
        history
        defined
        cases_residents
        deaths_residents
        active_residents
        tests_residents
        population_residents
        vaccinations_residents
        cases_staff
        deaths_staff
        tests_staff
        vaccinations_staff
        active_staff
        population_staff
      }
    }
  }
`;

export default StateTemplate;
