import {Component, ViewChild } from '@angular/core';
import {Project} from '../shared/project.model';
import {ProjectService} from '../shared/project.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {AppConfig} from '../../config/app.config';
import { Params, Router} from '@angular/router';
import {LoggerService} from '../../core/logger.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})

export class ProjectListComponent  {
  projects: Project[] = [];
  // project: Project;
  projectId: number;
  newProjectForm: FormGroup;
  canVote = false;
  error: string;

  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
     // private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.canVote = this.projectService.checkIfUserCanVote();

    this.newProjectForm = this.formBuilder.group({
      'name': ['', [Validators.required]],
      'alterEgo': ['', [Validators.required]]
    });

    this.projectService.getAllProjects().subscribe((projects: Array<Project>) => {
      this.projects = projects.sort((a, b) => {
        return b.likes - a.likes;
      });
    });
  }

  // ngOnInit() {
  //   this.activatedRoute.params.forEach((params: Params) => {
  //     let id = +params['id'];
  //     // this.getProject(id);
  //   });
  // }



  like(project: Project) {
    this.projectService.like(project).subscribe(() => {
      this.canVote = this.projectService.checkIfUserCanVote();
    }, (error: Response) => {
      LoggerService.error('maximum votes limit reached', error);
    });
  }

  createNewProject(newProject: Project) {
    this.projectService.createProject(newProject).subscribe((newProjectWithId) => {
      this.projects.push(newProjectWithId);
      this.myNgForm.resetForm();
    }, (response: Response) => {
      if (response.status === 500) {
        this.error = 'errorHasOcurred';
      }
    });
  }

  seeProjectDetails(project): void {
    if (project.default) {
      this.router.navigate([AppConfig.routes.projects + '/' + project.id]);
    }
    else {
      this.router.navigate([AppConfig.routes.projects + '/' + project.id]);
      console.log('else statement of seeProjectDetails, project-list.component.ts');
    }
  }

  //  getProject(id: number) {

  //   // this.activatedRoute.params.forEach((params: Params) => {
  //     // let id = +params['id'];
  //     // let id = this.project.id;
  //     // this.getProject(id);
  //   // });
  //   if (id === 0) {
  //     return;
  //   }
  //   this.projectService.getProject(id).subscribe((project: Project) => {
  //     this.project = project;
  //     this.projectId = project.id;
  //   }, (err: any) => {
  //     // this._toastService.error('Customer did not load properly');
  //    console.log('Project list did not load properly');
  //   });
  // }

  remove(projectToRemove: Project): void {
    let dialogRef = this.dialog.open(RemoveProjectDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProjectById(projectToRemove.id).subscribe(() => {
          this.projectService.showSnackBar('projectRemoved');
          this.projects = this.projects.filter(project => project.id !== projectToRemove.id);
        }, (response: Response) => {
          if (response.status === 500) {
            this.error = 'projectDefault';
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-remove-project-dialog',
  templateUrl: './remove-project.dialog.html',
})

export class RemoveProjectDialogComponent {
  constructor() {
  }
}
