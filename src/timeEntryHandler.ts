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

  async next1000(start: Date) {
    let  timeEntries: TimeEntry[] = [];
    timeEntries = timeEntries.concat(
      await new Promise((resolve, reject) => {
        this.toggleClient.getTimeEntries(
          start,
          new Date(),
          (err: Error, timeEntries: TimeEntry[]) => {
            if (err) return reject(err);
            resolve(timeEntries);
          }
        );
      })
    );
    const lastEntry = timeEntries[timeEntries.length - 1];
    if (timeEntries.length === 1000) {
      timeEntries = timeEntries.concat(
        await this.next1000(
          new Date(lastEntry.start)
        )
      );
    }
    return timeEntries;
  }

  async getAll(): Promise<TimeEntry[]> {
    return await this.next1000(this.startDate);
  }
}
