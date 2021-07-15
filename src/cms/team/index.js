import { createFileCollection, createFile } from "@hyperobjekt/cms-config";

const team = createFile(
  {
    label: "Team Members",
    name: "team",
    file: "content/data/team.json",
    extension: "json",
    format: "json",
    fields: [
      {
        label: "Team ID",
        name: "id",
        default: "project-team",
        widget: "hidden",
      },
      {
        label: "Teams",
        name: "teams",
        allow_add: true,
        widget: "list",
        summary: "{{fields.name}}",
        fields: [
          {
            label: "Team Name",
            name: "name",
            widget: "string",
            required: true,
          },
          {
            label: "Members",
            name: "members",
            allow_add: true,
            widget: "list",
            fields: [
              { label: "Name", name: "name", widget: "string", required: true },
              {
                label: "URL",
                name: "url",
                widget: "string",
                hint: "optional URL to link the team members name",
              },
              {
                label: "Roles",
                name: "roles",
                widget: "list",
                hint: "comma separated list of roles",
              },
            ],
          },
        ],
      },
    ],
  },
  { mergeFields: false }
);

const data = createFileCollection({
  label: "Project Team",
  name: "project-team",
  extension: "json",
  format: "json",
  files: [team],
});

export default data;
