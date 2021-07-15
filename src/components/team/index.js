export { TeamBlock } from "./team-block";

export const getTeams = (teams, allTeams, options = {}) => {
  const lcTeams = teams.map((t) => t.toLowerCase());
  const selector = options.inverse
    ? (t) => lcTeams.indexOf(t.name.toLowerCase()) === -1
    : (t) => lcTeams.indexOf(t.name.toLowerCase()) > -1;
  return allTeams.filter(selector);
};
