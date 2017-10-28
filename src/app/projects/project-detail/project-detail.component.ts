import {Component} from '@angular/core';
import {Project} from '../shared/project.model';
import {ProjectService} from '../shared/project.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})

export class ProjectDetailComponent {
  // project: Project[] = [];
  // project: Project = <Project>{};
  project: Project;
  canVote: boolean;
  // projectId: string;
  // id: any;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.params.subscribe((params: Params) => {
      // let projectId = +params['id'];
      // this.project = null;
      // this.activatedRoute.params.subscribe((params: any) => {
      if (params['id']) {
        this.projectService.getProjectById(params['id']).subscribe((project: Project) => {
        // this.projectService.getProjectById(params['id']).subscribe((project: Project) => {
          // console.log(this.project);
          this.project = project;
          // this.projectItem = project;
          // console.log(this.project[projectId]);
          // console.log(this.projectItem);
          console.log(this.project);
        //  this.project.id = project.id;
        });
      }
      else {
        console.log('else statement from project-detail component');
      }
    });
  }

  like(project: Project) {
    return new Promise((resolve, reject) => {
      this.projectService.like(project).subscribe(() => {
        this.canVote = this.projectService.checkIfUserCanVote();
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }
}
