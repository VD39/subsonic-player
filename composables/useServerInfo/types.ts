export interface AboutInformation {
  appInformation: AppInformation;
  serverInformation: ServerInformation;
}

export interface AppInformation {
  bugReportUrl?: string;
  githubReleaseUrl?: string;
  githubUrl?: string;
  homepageUrl?: string;
  releaseDate?: string;
  version?: string;
}

export interface ServerInformation {
  name?: string;
  openSubsonic?: string;
  url?: string;
  version?: string;
}
