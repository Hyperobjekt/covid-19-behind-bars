# UCLA COVID-19 Behind Bars Website

This is the main gatsby site for https://uclacovidbehindbars.org/

This site is based off of [gatsby-theme-hypersite](https://github.com/Hyperobjekt/gatsby-themes), which provides the basics:

- MDX Page creation (/content/pages)
  - SEO (customizable via MDX front matter)
- website components from [@hyperobjekt/material-ui-website](https://hyperobjekt.github.io/core/?path=/story/website-block--base) (header, footer, body, navigation, etc)
- Theming via [material styles](https://material-ui.com/styles/basics/)

All components from the core theme can be overridden using [component shadowing](https://www.gatsbyjs.com/blog/2019-04-29-component-shadowing/) (creating the same component from the core theme in `src/gatsby-theme-hypersite`).

See the [hyperobjekt core starter](https://gatsby-starter-hyperobjekt.netlify.app/) site for more details.

## Structure

- Website pages are automatically created from mdx files in `/content/pages`
- Explore data pages are created from scraped data in `gatsby-node.js`
- Custom page templates are in `/src/templates`
- Website theme definition is in `/src/gatsby-theme-hypercore/theme.js`
- Page layout overrides (header, footer, etc.) are shadowed in `/src/gatsby-theme-hypersite`
- data fetching and preprocessing is in `/scripts`

## Data Sources

Data is pulled from many sources:

- [UCLA Law COVID-19 Behind Bars Data Repo](https://github.com/uclalawcovid19behindbars/data)
- [UCLA Law COVID-19 Behind Bars Google Sheet](https://docs.google.com/spreadsheets/d/1X6uJkXXS-O6eePLxw2e4JeRtM41uPZ2eRcOA_HkPVTk/edit#gid=1641553906)
- [UCLA DOC Transparency Scorecard](https://docs.google.com/spreadsheets/d/1fHhRAjwYGVmgoHLUENvcYffHDjEQnpp7Rwt9tLeX_Xk/edit?gid=696812429)
- [UCLA Time Series Data](http://104.131.72.50:3838/scraper_data/summary_data/scraped_time_series.csv)

Data fetching and processing happens on build in `gatsby-node.js`, with the exception of time series data, which is fetched and processed in the loadTimeSeriesData.js prebuild script. For local development, run `yarn prebuild` to generate the `/static/data/` CSVs necessary for the time series visuals.

## Publishing the website

- [staging website](https://staging--covid-19-behind-bars.netlify.app/)
  - publishes on any pushes to the `staging` branch
  - publishes when new data is committed to the `master` branch of the [data repository](https://github.com/uclalawcovid19behindbars/data)
  - uses data in the `master` branch of the data repo
- [public website](https://uclacovidbehindbars.org/)
  - publishes on any pushes to the `production` branch
  - publishes when new data is committed to the `website` branch of the [data repository](https://github.com/uclalawcovid19behindbars/data)
  - uses data in the `website` branch of the data repo

## Content Management System

Netlify CMS configuration is located in `/src/cms/cms.js`.

CMS updates on the public website trigger commits to the `production` branch (with `editorial_workflow`, so a preview branch with the content updates is created on save before being published).
