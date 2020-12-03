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
    const timeEntryList = await timeEntries.getAll();
    const workspaces = new WorkspaceHandler(this.togglClient);
    await workspaces.getAll();
    const projects = new ProjectHandler(this.togglClient, workspaces);
    await projects.getAll();
    const users = new UserHandler(this.togglClient, workspaces);
    await users.getAll();

    return timeEntryList
      .map((entry: TimeEntry) => {
        const raw: Raw = {
          workspace: workspaces.map.get(entry.wid) as Workspace,
          project: projects.map.get(entry.pid) as Project,
          user: users.map.get(entry.uid) as User,
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
          },

          time: {
            id: entry.raw.guid,
            name: entry.user.name,
            project: entry.project?.name,
            start: entry.raw.start,
            stop: entry.raw.stop,
            duration: entry.raw.duration,
          },
        };
      });
  }
}
