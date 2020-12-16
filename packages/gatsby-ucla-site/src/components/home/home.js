import React from "react"
import { graphql } from "gatsby"
import { Layout } from "gatsby-theme-hyperobjekt-core"
import Intro from "./HomeIntro"
import HomeMap from "./HomeMap"
import Sponsors from "./HomeSponsors"
import Table from "./HomeTable"
import CdcLogo from "../../../content/assets/cdc-logo.svg"
import VitalProjectsFundLogo from "../../../content/assets/vital-projects-fund-logo.svg"
import ArnoldVenturesLogo from "../../../content/assets/arnold-ventures-logo.svg"
import MapTooltip from "./HomeMapTooltip"

export const query = graphql`
  query($pathSlug: String!) {
    mdx(frontmatter: { path: { eq: $pathSlug } }) {
      frontmatter {
        intro {
          body
          subtitle
          title
        }
        map {
          description
          title
        }
        title
        sponsors {
          title
        }
        table {
          note
          title
        }
      }
      body
    }
  }
`
// TODO: put logos in front matter
const logos = [
  {
    image: CdcLogo,
    link: "",
    alt: "center for disease control logo",
  },
  {
    image: VitalProjectsFundLogo,
    link: "",
    alt: "Vital Projects Fund logo",
  },
  {
    image: ArnoldVenturesLogo,
    link: "",
    alt: "Arnold Ventures logo",
  },
]

const HomeTemplate = ({
  pageContext,
  data: { mdx },
  classes,
  className,
  ...props
}) => {
  const content = mdx.frontmatter
  content.sponsors.logos = logos
  return (
    <Layout title={content.title}>
      <Intro
        title={content.intro.title}
        subtitle={content.intro.subtitle}
        body={content.intro.body}
      />
      <HomeMap
        title={content.map.title}
        description={content.map.description}
      />
      <MapTooltip />
      <Table title={content.table.title} note={content.table.note} />
      <Sponsors title={content.sponsors.title} logos={content.sponsors.logos} />
    </Layout>
  )
}

export default HomeTemplate
