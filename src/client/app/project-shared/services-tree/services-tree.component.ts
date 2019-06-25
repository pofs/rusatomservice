// angular
import { Component, OnInit } from '@angular/core';

// framework
import { getWorkingLanguage, Language } from '../../../framework/i18n/i18n.module';
import { WorkDirection, WorkdirectionsService } from '../../models/workdirections.service';
import { isUndefined } from 'lodash';

@Component({
  selector: 'app-services-tree',
  templateUrl: './services-tree.component.html',
  styleUrls: ['./services-tree.component.scss']
})
export class ServicesTreeComponent {
  workdirections$ = this.workdirections.index();
  hoveredDirection: WorkDirection;

  constructor(private readonly workdirections: WorkdirectionsService) { }

  hovered(workdirection: WorkDirection): void {
    this.hoveredDirection = workdirection;
  }

  unHovered(workdirection?: WorkDirection): void {
    this.hoveredDirection = undefined;
  }

  isHovered(workdirection: WorkDirection): boolean {
    return (!isUndefined(this.hoveredDirection) && this.hoveredDirection.id === workdirection.id);
  }

  getColorFor(workdirection: WorkDirection): string {
    if (this.isHovered(workdirection)) {
      return workdirection.props.color;
    } else {
      return '#232323';
    }
  }
}
