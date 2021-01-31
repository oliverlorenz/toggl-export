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
  let startDate = new Date(
    process.env.START_DATE || "2007-01-01T00:00:00.000Z"
  );

  let data: Object[] = [];
  let dataSet: { time: { start: Date } }[] = [];
  do {
    dataSet = await handler.export(startDate);
    const lastElement = dataSet[dataSet.length - 1];
    startDate = new Date(lastElement.time.start);
    data = data.concat(dataSet);
  } while (dataSet.length === 1000);

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
