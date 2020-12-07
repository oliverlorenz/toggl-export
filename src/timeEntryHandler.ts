export interface TimeEntry {
  wid: number;
  pid: number;
  uid: number;
  guid: string;
  start: Date;
  stop: Date;
  duration: number;
  description: string;
}

export class TimeEntryHandler {
  constructor(private toggleClient: any, private startDate: Date) {}

  async getAll(): Promise<TimeEntry[]> {
    return await new Promise((resolve, reject) => {
      this.toggleClient.getTimeEntries(
        this.startDate,
        new Date(),
        (err: Error, timeEntries: TimeEntry[]) => {
          if (err) return reject(err);
          resolve(timeEntries);
        }
      );
    });
  }
}
