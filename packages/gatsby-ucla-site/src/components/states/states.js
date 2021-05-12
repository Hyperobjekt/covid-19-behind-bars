import React from "react"
import clsx from "clsx"
import { graphql } from "gatsby"
import { Layout } from "gatsby-theme-hyperobjekt-core"
import {
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core"

import { Step, Scrollama } from "@hyperobjekt/react-scrollama"
import {
  ResidentsSummary,
  Facilities,
  Filings,
  // Grassroots,
  // Immigration,
  // Releases,
  Scorecard,
  ReleasesTable,
  GrassrootsTable,
  StaffSummary,
} from "./sections"
import useStatesStore from "./useStatesStore"
import Visual from "./Visual"
import shallow from "zustand/shallow"
import SectionNavigation from "../SectionNavigation"
import ResponsiveContainer from "../ResponsiveContainer"
import content from "../../../content/states.json"

const useStyles = makeStyles((theme) => ({
  block: {
    padding: theme.spacing(0, 2),
    alignItems: "flex-start",
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(0, 3),
    },
  },
  visual: {
    position: "sticky",
    top: `calc(${theme.layout.headerHeight} + 56px)`,
    // full vertical height, minus header
    height: `calc(80vh - ${theme.layout.headerHeight} - 56px)`,
    minHeight: 420,
    // span full viewport width
    width: `calc(100% + ${theme.spacing(6)})`,
    margin: theme.spacing(0, -3),
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    [theme.breakpoints.up("md")]: {
      // so tooltips appear above scrolling content, once they're side by side
      zIndex: 1,
      marginLeft: "auto",
      height: `calc(100vh - ${theme.layout.headerHeight} - 6rem)`,
      width: `calc(100% - 26.25rem)`,
      // shift up so legend doesn't start off screen
      margin: theme.spacing(-2, 0, 0, 0),
    },
    // make some space for the legend
    "& .rsm-svg": {
      flex: 1,
      maxHeight: `calc(100% - 5rem)`,
      [theme.breakpoints.up("md")]: {
        transform: `none`,
      },
    },
  },
  title: {
    marginTop: theme.spacing(4),
  },
  step: {
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(0, -2),
    paddingTop: `calc(100vh - ${theme.layout.headerHeight})`,
    [theme.breakpoints.up("md")]: {
      minHeight: `calc(100vh - ${theme.layout.headerHeight})`,
      paddingTop: 0,
      margin: 0,
      alignItems: "center",
    },
  },
  first: {
    [theme.breakpoints.up("md")]: {
      minHeight: `calc(100vh - ${theme.layout.headerHeight} - ${theme.spacing(
        10
      )})`,
    },
  },
  content: {
    marginTop: `calc(-100vh + ${theme.layout.headerHeight} + 56px)`,
    position: "relative",
    maxWidth: "26.25rem",
    marginLeft: `auto`,
    marginRight: `auto`,
    [theme.breakpoints.up("md")]: {
      marginLeft: 0,
      marginRight: `auto`,
      paddingTop: "3rem",
    },
  },
  bottomSections: {
    // cut padding to add some space on small devices
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  fullWidthContent: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: "50vh",
    },
    paddingBottom: theme.spacing(4),

    "& .embedded-stats": {
      padding: theme.spacing(3, 2),
    },
    "& .empty-embedded-stats": {
      padding: theme.spacing(3, 2),
      textAlign: "center",
    },
  },
}))

const SECTION_COMPONENTS = {
  residents: ResidentsSummary,
  staff: StaffSummary,
  facilities: Facilities,
  filings: Filings,
  // releases: Releases,
  // immigration: Immigration,
  // grassroots: Grassroots,
  scorecard: Scorecard,
  releases: ReleasesTable,
  grassroots: GrassrootsTable,
}

const StateTemplate = ({ pageContext, data }) => {
  // classes used on this page
  const classes = useStyles()
  // pull state name from page context
  const { state } = pageContext
  // track current step index for scrollytelling
  const [
    currentStep,
    setCurrentStep,
    setStateName,
    setData,
    setContent,
  ] = useStatesStore(
    (state) => [
      state.currentStep,
      state.setCurrentStep,
      state.setStateName,
      state.setData,
      state.setContent,
    ],
    shallow
  )
  const scorecardData = data.scorecard?.nodes[0]

  if (!scorecardData) {
    content.sections = content.sections.filter((s) => s.id !== "scorecard")
  }

  // set the state name in the store
  setStateName(state)
  // set the data in the store
  setData(data)
  // set the content for the page
  setContent(content)

  // update current step when entering
  const handleStepEnter = ({ data }) => {
    setCurrentStep(data)
  }

  // setctions for section nav
  const sections = content.sections.map((s) => ({
    id: s.id,
    name: s.lang.link,
  }))
  const theme = useTheme()
  const isHorizontalLayout = useMediaQuery(theme.breakpoints.up("md"))

  const scrollSections = content.sections.filter((s) => !s.fullWidth)
  const fullWidthSections = content.sections.filter((s) => s.fullWidth)

  return (
    <Layout title={state}>
      <SectionNavigation current={currentStep} sections={sections} />
      <ResponsiveContainer>
        <Typography variant="h2" className={classes.title}>
          {state}
        </Typography>
        <Visual className={classes.visual} />
        <div className={classes.content}>
          <Scrollama
            onStepEnter={handleStepEnter}
            offset={isHorizontalLayout ? 0.3 : 0.15}
          >
            {scrollSections.map((section, index) => {
              const Component = SECTION_COMPONENTS[section.id]
              return (
                <Step key={section.id} data={section.id}>
                  <div id={section.id}>
                    <Component
                      className={clsx(classes.step, {
                        [classes.first]: index === 0,
                      })}
                      data={data}
                      {...section}
                    />
                  </div>
                </Step>
              )
            })}
          </Scrollama>
        </div>
      </ResponsiveContainer>
      <ResponsiveContainer className={classes.bottomSections}>
        <div className={classes.fullWidthContent}>
          <Scrollama
            onStepEnter={handleStepEnter}
            offset={isHorizontalLayout ? 0.3 : 0.15}
          >
            {fullWidthSections.map((section, index) => {
              const Component = SECTION_COMPONENTS[section.id]
              const { fullWidth, ...sectionData } = section
              return (
                <Step key={section.id} data={section.id}>
                  <div id={section.id}>
                    <Component data={data} state={state} {...sectionData} />
                  </div>
                </Step>
              )
            })}
          </Scrollama>
        </div>
      </ResponsiveContainer>
    </Layout>
  )
}

StateTemplate.propTypes = {}

export const query = graphql`
  query($state: String!) {
    allFacilities(filter: { state: { eq: $state } }) {
      edges {
        node {
          id
          name
          coords
          city
          jurisdiction
          residents {
            active
            active_rate
            confirmed
            confirmed_rate
            deaths
            deaths_rate
            tested
            tested_rate
            population
          }
          staff {
            active
            confirmed
            deaths
            tested
          }
          date
        }
      }
    }
    allFilings(filter: { state: { eq: $state } }) {
      edges {
        node {
          courtCount
          facilityCount
          granted
          total
        }
      }
    }
    scorecard: allScorecard(filter: { state: { eq: $state } }) {
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
    fedScorecard: allScorecard(filter: { state: { eq: "Federal (BOP)" } }) {
      nodes {
        score
      }
    }
    iceScorecard: allScorecard(filter: { state: { eq: "Immigration (ICE)" } }) {
      nodes {
        score
      }
    }
    allGrassroots(filter: { state: { eq: $state } }) {
      edges {
        node {
          county
          date
          external_effort
          facility
          internal_effort
          organization
          releases
          response
          sanitary
          source
          success
          testing
          type
        }
      }
    }
    allJailReleases(filter: { state: { eq: $state } }) {
      edges {
        node {
          facility
          capacity
          releases
          population
          source
          jurisdiction
          date
          authority
          detailParole
          detailMinor
          detailBail
          detailShort
          detailVulnerable
          detailOther
        }
      }
    }
    allPrisonReleases(filter: { state: { eq: $state } }) {
      edges {
        node {
          facility
          capacity
          releases
          population
          source
          jurisdiction
          date
          authority
          detailParole
          detailMinor
          detailShort
          detailVulnerable
          detailOther
        }
      }
    }
  }
`

/*
 * Unused sections

  allImmigrationCases(filter: { state: { eq: $state } }) {
    edges {
      node {
        cases
        deaths
        facility
        fieldOffice
      }
    }
  }
  allImmigrationFilings(filter: { state: { eq: $state } }) {
    edges {
      node {
        cancer
        diabetes
        heart
        facility
        lung
        medication
        other
        smoking
        substance
      }
    }
  }
  allFundraisers(filter: { state: { eq: $state } }) {
    edges {
      node {
        ongoing
        goal
        fundraiser
        date
        organization
        sources
      }
    }
  }
  allYouth(filter: { state: { eq: $state } }) {
    edges {
      node {
        cases_staff
        cases_youth
        county
        facility
      }
    }
  }
*/

export default StateTemplate
