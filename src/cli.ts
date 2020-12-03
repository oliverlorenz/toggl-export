#!/usr/bin/env node

import { Command } from "commander";
import { ExportHandler } from "./exportHandler";
import { stringify } from "yaml";

var TogglClient = require("toggl-api");

const command = new Command()
  .requiredOption("-f, --format <format>", "export file format")
  .option("-t, --toggl-token <token>", "toggl token")
  .option("-s, --start-date <startDate>", "start date")
  .parse(process.argv);

const token = command.togglToken || process.env.TOGGL_API_TOKEN;

if (!token) throw new Error("token not set");

const togglClient = new TogglClient({
  apiToken: command.togglToken || process.env.TOGGL_API_TOKEN,
});

(async () => {
  const handler = new ExportHandler(togglClient);
  const data = await handler.export();

  switch (command["format"].toLowerCase()) {
    case "json":
      console.log(JSON.stringify(data, null, 2));
      break;
    case "yaml":
      console.log(stringify(data));
      break;

    default:
      break;
  }
})();
