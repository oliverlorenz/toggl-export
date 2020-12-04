import { Client } from "./clientHandler";
import { Project } from "./projectsHandler";
import { TimeEntry } from "./timeEntryHandler";
import { User } from "./userHandler";
import { Workspace } from "./workspaceHandler";

export interface Raw {
  workspace: Workspace;
  project: Project;
  user: User;
  client: Client;
  raw: TimeEntry;
}
