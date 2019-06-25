// angular
import { Component } from '@angular/core';

// framework
import { getWorkingLanguage, Language } from '../../../framework/i18n/i18n.module';
import { ProjectsService } from '../../models/projects.service';

@Component({
  selector: 'app-recent-projects',
  templateUrl: './recent-projects.component.html'
})
export class RecentProjectsComponent {
  projects$ = this.projects.recent();

  constructor(private readonly projects: ProjectsService) { }
}
