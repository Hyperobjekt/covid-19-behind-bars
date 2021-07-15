import CMS from "netlify-cms-app";
import { config, createFolderCollection } from "@hyperobjekt/cms-config";
import blog from "./blog";
import data from "./data";
import lang from "./lang";
import authors from "./authors";
import reports from "./reports";
import team from "./team";

window.CMS_MANUAL_INIT = true;

const pages = createFolderCollection({
  label: "Pages",
  folder: "content/pages",
  media_folder: "/content/pages/images",
  public_folder: "./images",
});

CMS.init({
  config: {
    load_config_file: false,
    // remember to run npx netlify-cms-proxy-server if running locally
    local_backend: process.env.CI !== true,
    publish_mode: "editorial_workflow",
    backend: {
      name: "git-gateway",
      repo: "Hyperobjekt/covid-19-behind-bars",
      branch: process.env.BRANCH || "production",
    },
    media_folder: "/static/images",
    public_folder: "/images",
    collections: [config, pages, blog, authors, reports, data, team, lang],
  },
});

CMS.registerEditorComponent({
  id: "dynamicContent",
  label: "Dynamic Content",
  fields: [
    {
      name: "content",
      label: "jsx",
      widget: "code",
      default_language: "javascript",
      output_code_only: true,
    },
  ],
  pattern: /^<>([\S\s]*?)<\/>/,
  fromBlock: function (match) {
    return {
      content: match[1],
    };
  },
  toBlock: function (obj) {
    return `
<>${obj.content}</>
`;
  },
  toPreview: function (obj) {
    return obj.content;
  },
});
