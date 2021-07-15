import { makeStringField, makeTextField } from "../utils";
import intro from "./sections/intro";
import map from "./sections/map";
import table from "./sections/table";

const home = {
  label: "Home Page",
  name: "home",
  file: "content/lang/home.json",
  extension: "json",
  format: "json",
  fields: [
    intro,
    map,
    table,
    {
      ...table,
      label: "Vaccine Table",
      name: "vaccineTable",
      fields: [
        table.fields[0], // title
        makeTextField("Subtitle"),
        table.fields[1], // notes
        {
          label: "Flag Notes",
          name: "flag_note",
          widget: "list",
          summary: "{{fields.entity}}",
          fields: [
            makeStringField("entity", { label: "Entry" }),
            makeStringField("text"),
          ],
        },
      ],
    },
    {
      label: "Sponsors",
      name: "sponsors",
      widget: "object",
      fields: [
        makeStringField("Title"),
        {
          label: "Logos",
          name: "logos",
          widget: "list",
          fields: [
            { label: "Logo", name: "image", widget: "image" },
            makeStringField("Link"),
            makeStringField("Alt"),
          ],
        },
      ],
    },
  ],
};

export default home;
