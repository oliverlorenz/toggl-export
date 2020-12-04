import { Project, ProjectHandler } from "./projectsHandler";
import { WorkspaceHandler } from "./workspaceHandler";

export interface Client {
  id: number;
  name: string;
}

export class ClientHandler {
  readonly map: Map<number, Client>;
  constructor(private toggleClient: any) {
    this.map = new Map<number, Client>();
  }

  async getAll() {
    return await new Promise((resolve: (list: any) => void) => {
      this.toggleClient.getClients((err: Error, clients: Client[]) => {
        if (err) throw err;
        clients.forEach((client) => {
          this.map.set(client.id, client);
        });
        resolve(this.map);
      });
    });
  }

  async getAllIds() {
    const ids = Array.from(await this.map.entries()).map((params) => params[0]);
    return ids;
  }
}
