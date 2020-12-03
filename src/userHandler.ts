import { WorkspaceHandler } from "./workspaceHandler";

export interface User {
  id: number;
  name: string;
}

export class UserHandler {
  readonly map: Map<number, User>;
  constructor(
    private toggleClient: any,
    private workspaceHandler: WorkspaceHandler
  ) {
    this.map = new Map<number, User>();
  }

  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async getAll() {
    const workspaceIdList = await this.workspaceHandler.getAllIds();
    for (const workspaceId of workspaceIdList) {
      const users = await new Promise((resolve: (list: any[]) => void) => {
        this.toggleClient.getWorkspaceUsers(
          workspaceId,
          false,
          (err: Error, users: User[]) => {
            if (err) throw err;
            if (!users) {
              resolve([]);
            }
            resolve(users);
          }
        );
      });
      for (const user of users) {
        this.map.set(user.uid, user);
      }
    }
    return this.map;
  }

  async getAllIds() {
    const ids = Array.from(await this.map.entries()).map((params) => params[0]);
    // console.log(ids);
    return ids;
  }
}
