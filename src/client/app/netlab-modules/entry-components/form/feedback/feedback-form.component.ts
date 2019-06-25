import {
  ChangeDetectorRef, Component, Input, OnDestroy
} from '@angular/core';

// Libraries
import { DialogFormComponent } from '../../../../framework/models/model-from-components';
import { Dashboard, DashboardSchema, DashboardsService } from '../../../../models/dashboards/dashboards.service';
import { AccessRightsListComponent } from '../../lists/access-rights-list/access-rights-list.component';
import { UiNotificationsService } from '../../../ui/notifications/core';
import { UiDialogComponent } from '../../../ui/notifications/components';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-feedback-form',
  styleUrls: [ './feedback-form.component.scss' ],
  templateUrl: './feedback-form.component.html'
})
export class FeedbackFormComponent implements OnDestroy {
  @Input() dialogComponent: UiDialogComponent;
  @Input() form: FormGroup;
  submitted = false;
  success = false;

  protected subscriptions = new Subscription();

  constructor(
    readonly notifications: UiNotificationsService,
    readonly cd: ChangeDetectorRef,
    readonly httpClient: HttpClient
  ) {

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  submit($event: any): void {
    this.submitted = true;

    if (this.form.valid) {
      this.httpClient.post(
          'http://u8273857.isp.regruhosting.ru/api/form/feedback', this.form.value
        )
        .subscribe((e: any) => {
          if (e.status === 200) {
            this.success = true;
            this.cd.markForCheck();
          }
        });
    }
  }

  decline($event?: any): void {
    this.dialogComponent.close();
  }
}
