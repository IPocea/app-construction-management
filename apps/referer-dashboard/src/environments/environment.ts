// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  languages:           ['ro', 'en'],
  THEMES:              ['auto', 'light', 'dark'],
  // to be changed on production with the real urls
  baseUrl: 'http://localhost:3333/api/',
  projectDocumebtsBaseUrl: 'http://localhost:3333/api/project-details/documents/',
  baseMenuType: 'dynamic'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
