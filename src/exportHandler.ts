import { Client } from "./clientHandler";
import { Project } from "./projectsHandler";
import { Raw } from "./raw";
import { TimeEntry, TimeEntryHandler } from "./timeEntryHandler";
import { User } from "./userHandler";
import { Workspace } from "./workspaceHandler";

export class ExportHandler {
  constructor(
    private togglClient: any,
    private workspaces: any,
    private projects: any,
    private users: any,
    private clients: any
  ) {}

  async export(startDate: Date) {
    const timeEntries = new TimeEntryHandler(this.togglClient, startDate);
    let timeEntryList = await timeEntries.getAll();
    // timeEntryList = [timeEntryList[0]];

    return timeEntryList
      .map((entry: TimeEntry) => {
        const clientId = (this.projects.map.get(entry.pid) as Project)?.cid;
        const raw: Raw = {
          workspace: this.workspaces.map.get(entry.wid) as Workspace,
          project: this.projects.map.get(entry.pid) as Project,
          user: this.users.map.get(entry.uid) as User,
          client: this.clients.map.get(clientId) as Client,
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
            description: entry.raw.description,
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
