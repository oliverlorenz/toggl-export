import { WorkspaceHandler } from "./workspaceHandler";

export interface Project {
  id: number;
  name: string;
}

export class ProjectHandler {
  readonly map: Map<number, Project>;
  constructor(
    private toggleClient: any,
    private workspaceHandler: WorkspaceHandler
  ) {
    this.map = new Map<number, Project>();
  }

  async getAll() {
    const workspaceIdList = await this.workspaceHandler.getAllIds();
    return await new Promise((resolve: (list: any) => void) => {
      workspaceIdList.forEach((workspaceId: number) => {
        this.toggleClient.getWorkspaceProjects(
          workspaceId,
          (err: Error, projects: Project[]) => {
            if (err) throw err;
            projects.forEach((project) => {
              this.map.set(project.id, project);
            });
            resolve(this.map);
          }
        );
      });
    });
  }

  async getAllIds() {
    const ids = Array.from(await this.map.entries()).map((params) => params[0]);
    return ids;
  }
}
