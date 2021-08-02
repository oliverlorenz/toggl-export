#!/usr/bin/env node

import { Command } from "commander";
import { ExportHandler } from "./exportHandler";
import { stringify } from "yaml";
import { WorkspaceHandler } from "./workspaceHandler";
import { ProjectHandler } from "./projectsHandler";
import { UserHandler } from "./userHandler";
import { ClientHandler } from "./clientHandler";

var TogglClient = require("@natterstefan/toggl-api");

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
  const workspaces = new WorkspaceHandler(togglClient);
  await workspaces.getAll();
  const projects = new ProjectHandler(togglClient, workspaces);
  await projects.getAll();
  const users = new UserHandler(togglClient, workspaces);
  await users.getAll();
  const clients = new ClientHandler(togglClient);
  await clients.getAll();

  const handler = new ExportHandler(
    togglClient,
    workspaces,
    projects,
    users,
    clients
  );
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
