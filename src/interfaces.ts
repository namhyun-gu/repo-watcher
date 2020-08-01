export interface Repository {
  owner: string;
  name: string;
  commits: Commit[] | undefined;
}

export interface User {
  name: string;
  email: string;
  date: string;
}

export interface Commit {
  author: User;
  committer: User;
  message: string;
  url: string;
}

export abstract class Notification<T extends NotificationArgument<any, any>> {
  arg: T;

  constructor(arg: T) {
    this.arg = arg;
  }

  abstract notify(repos: Repository[]): void;
}

export class NotificationArgument<Config, Environment> {
  configs: Config;
  envs: Environment;

  constructor(configs: Config, envs: Environment) {
    this.configs = configs;
    this.envs = envs;
  }
}
