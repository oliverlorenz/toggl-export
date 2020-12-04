import { Client, ClientHandler } from "./clientHandler";
import { Project, ProjectHandler } from "./projectsHandler";
import { Raw } from "./raw";
import { TimeEntry, TimeEntryHandler } from "./timeEntryHandler";
import { User, UserHandler } from "./userHandler";
import { Workspace, WorkspaceHandler } from "./workspaceHandler";

export class ExportHandler {
  constructor(private togglClient: any) {}

  async export() {
    const startDate = new Date(process.env.START_DATE || "2015-01-01");
    const timeEntries = new TimeEntryHandler(this.togglClient, startDate);
    let timeEntryList = await timeEntries.getAll();
    // timeEntryList = [timeEntryList[0]];
    const workspaces = new WorkspaceHandler(this.togglClient);
    await workspaces.getAll();
    const projects = new ProjectHandler(this.togglClient, workspaces);
    await projects.getAll();
    const users = new UserHandler(this.togglClient, workspaces);
    await users.getAll();
    const clients = new ClientHandler(this.togglClient);
    await clients.getAll();

    return timeEntryList
      .map((entry: TimeEntry) => {
        const clientId = (projects.map.get(entry.pid) as Project)?.cid;
        const raw: Raw = {
          workspace: workspaces.map.get(entry.wid) as Workspace,
          project: projects.map.get(entry.pid) as Project,
          user: users.map.get(entry.uid) as User,
          client: clients.map.get(clientId) as Client,
          raw: entry,
        };
        return raw;
      })
      .map((entry) => {
        return {
          toggl: {
            workspace: {
              ...entry.workspace,
            },
            project: {
              ...entry.project,
            },
            user: {
              ...entry.user,
            },
            client: {
              ...entry.client,
            },
          },

          time: {
            id: entry.raw.guid,
            name: entry.user.name,
            project: entry.project?.name,
            client: entry.client?.name,
            date: {
              year: new Date(entry.raw.start).getFullYear(),
              month: new Date(entry.raw.start).getMonth() + 1,
              day: new Date(entry.raw.start).getDate(),
              hour: new Date(entry.raw.start).getHours(),
              minute: new Date(entry.raw.start).getMinutes(),
              second: new Date(entry.raw.start).getSeconds(),
            },
            start: entry.raw.start,
            stop: entry.raw.stop,
            duration: entry.raw.duration,
          },
        };
      });
  }
}
