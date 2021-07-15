import { useStaticQuery, graphql } from "gatsby";
import { useMemo } from "react";

export default function useVaccineData() {
  const {
    allVaccines: { nodes },
  } = useStaticQuery(
    graphql`
      query {
        allVaccines {
          nodes {
            id
            jurisdiction
            isState
            isFederal
            isIce
            residents {
              initiated
              population
            }
            staff {
              initiated
              population
            }
          }
        }
      }
    `
  );

  return useMemo(() => {
    // const total = {
    //   isState: false,
    //   isTotal: true,
    //   jurisdiction: getLang("total"),
    //   residents: { initiated: 0, population: 0 },
    //   staff: { initiated: 0, population: 0 },
    // }
    const filtered = nodes.filter((n) => {
      if (!n.residents.initiated && !n.staff.initiated) {
        return false;
      }
      // total.residents.initiated += n.residents.initiated || 0
      // total.residents.population += n.residents.population || 0

      // total.staff.initiated += n.staff.initiated || 0
      // total.staff.population += n.staff.population || 0

      if (n.residents.initiated && n.residents.population) {
        n.residents.percentInitiated =
          n.residents.initiated / n.residents.population;
      }
      if (n.staff.initiated && n.staff.population) {
        n.staff.percentInitiated = n.staff.initiated / n.staff.population;
      }
      return true;
    });

    // total.residents.percentInitiated =
    //   total.residents.initiated / total.residents.population
    // total.staff.percentInitiated =
    //   total.staff.initiated / total.staff.population

    return filtered;
  }, [nodes]);
}
