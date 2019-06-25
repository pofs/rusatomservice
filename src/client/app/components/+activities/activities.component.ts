// angular
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WorkDirections, WorkdirectionsService } from '../../models/workdirections.service';
import { Observable } from 'rxjs/Observable';
import { ApiError } from '../../netlab-framework/api/src/api.service';
import { filter } from 'rxjs/operators';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activities.component.html',
  styleUrls: ['activities.component.scss']
})
export class ActivitiesComponent {
  workDirections$: Observable<WorkDirections> = this.workDirections
    .index()
    .pipe(
      filter(res => !(res instanceof ApiError))
    ) as Observable<WorkDirections>;

  constructor(
    readonly workDirections: WorkdirectionsService
  ) { }

  onActivate($event: any, scrollContainer: any): void {
    scrollContainer.scrollTop = 0;
  }
}
