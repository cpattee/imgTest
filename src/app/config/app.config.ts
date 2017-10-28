import {InjectionToken} from '@angular/core';

import {IAppConfig} from './iapp.config';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: IAppConfig = {
  routes: {
    heroes: 'heroes',
    projects: 'projects',
    error404: '404'
  },
  endpoints: {
    heroes: 'https://nodejs-example-app.herokuapp.com/heroes',
    // projects: 'https://test2.fittech.io:8443/api/latest/test/test.js'
    projects: 'https://raw.githubusercontent.com/cpattee/dbTest/master/projects'
    // projects: 'https://test2.fittech.io:8443/static/legacy/test.js'
    // projects: 'https://test2.fittech.io:8443/static/legacy/test.js'
  },
  votesLimit: 3,
  topHeroesLimit: 4,
  topProjectsLimit: 4,
  snackBarDuration: 3000,
  repositoryURL: 'https://github.com/Ismaestro/angular4-example-app'
};
