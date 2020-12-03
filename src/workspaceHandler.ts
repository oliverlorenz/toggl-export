export interface Workspace {
  id: number;
}

export class WorkspaceHandler {
  readonly map: Map<number, Workspace>;
  constructor(private toggleClient: any) {
    this.map = new Map<number, Workspace>();
  }

  async getAll() {
    const workspacesList = await new Promise(
      (resolve: (workspaces: Workspace[]) => void, reject) => {
        this.toggleClient.getWorkspaces(
          (err: Error, workspaces: Workspace[]) => {
            if (err) return reject(err);
            resolve(workspaces);
          }
        );
      }
    );
    workspacesList.forEach((workspace) => {
      this.map.set(workspace.id, workspace);
    });
    return this.map;
  }

  async getAllIds() {
    const ids = Array.from(this.map.entries()).map((params) => params[0]);
    return ids;
  }
}
