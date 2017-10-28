import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {AppConfig} from '../../config/app.config';

import {Project} from './project.model';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

let projectsUrl = AppConfig.endpoints.projects;

@Injectable()
export class ProjectService {
  request$: EventEmitter<any>;

  private headers: HttpHeaders;
  private projectsUrl: string;
  private translations: any;

  private handleError(error: any) {
    this.request$.emit('finished');
    if (error instanceof Response) {
      return Observable.throw(error.json()['error'] || 'backend server error');
    }
    return Observable.throw(error || 'backend server error');
  }

  constructor(private http: HttpClient,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {
    this.request$ = new EventEmitter();

    this.projectsUrl = AppConfig.endpoints.projects;
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.translateService.get(['projectCreated', 'saved', 'projectLikeMaximum', 'projectRemoved'], {
      'value': AppConfig.votesLimit
    }).subscribe((texts) => {
      this.translations = texts;
    });
  }

  getAllProjects(): Observable<Project[]> {
    this.request$.emit('starting');
    return this.http.get(this.projectsUrl)
      .map(response => {
        this.request$.emit('finished');
        return response;
      })
      .catch(error => this.handleError(error));
  }

  // TEST FOR PROJECT DETAILS PAGE

  getProject(id: number) {
    return Promise.resolve().then(
      (project => project.id === id)[0]
    );
    // return this.http.get(`${projectsUrl}/${id}`);
  }

  // END TEST FOR PROJECT DETAILS PAGE

  getProjectById(projectId: string): Observable<Project> {
    this.request$.emit('starting');
    // return this.http.get(this.projectsUrl + '/' + projectId)
    return this.http.get(this.projectsUrl)
      .map(response => {
        console.log(projectId);
        // console.log(parseInt(projectId));
        // console.log(Project[projectId]);
        console.log(Project);
        console.log(this.projectsUrl);
        console.log('almost done gettting project by id');
        this.request$.emit('finished');
        console.log(response);
        return response;
      })
      .catch(error => this.handleError(error));
  }

  createProject(project: any): Observable<Project> {
    this.request$.emit('starting');
    return this.http
      .post(this.projectsUrl, JSON.stringify({
        name: project.name,
        alterEgo: project.alterEgo
      }), {headers: this.headers})
      .map(response => {
        this.request$.emit('finished');
        this.showSnackBar('projectCreated');
        return response;
      })
      .catch(error => this.handleError(error));
  }

  like(project: Project) {
    if (this.checkIfUserCanVote()) {
      this.request$.emit('starting');
      const url = `${this.projectsUrl}/${project.id}/like`;
      return this.http
        .post(url, {}, {headers: this.headers})
        .map((response) => {
          this.request$.emit('finished');
          localStorage.setItem('votes', '' + (Number(localStorage.getItem('votes')) + 1));
          project.likes += 1;
          this.showSnackBar('saved');
          return response;
        })
        .catch(error => this.handleError(error));
    } else {
      this.showSnackBar('projectLikeMaximum');
      return Observable.throw('maximum votes');
    }
  }

  checkIfUserCanVote(): boolean {
    return Number(localStorage.getItem('votes')) < AppConfig.votesLimit;
  }

  deleteProjectById(id: any): Observable<Array<Project>> {
    this.request$.emit('starting');
    const url = `${this.projectsUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .map((response) => {
        this.request$.emit('finished');
        this.showSnackBar('projectRemoved');
        return response;
      })
      .catch(error => this.handleError(error));
  }

  showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(this.translations[name], 'OK', config);
  }
}
