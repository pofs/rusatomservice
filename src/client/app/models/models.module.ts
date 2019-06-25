// angular
import { NgModule } from '@angular/core';
import { WorkdirectionsService } from './workdirections.service';
import { ProjectsService } from './projects.service';
import { NewsService } from './news.service';
import { AtexHistoryService } from './atex-history.service';
import { AtekCertificatesService } from './atek-certs.service';
import { AtekDealerinfoesService } from './atek-dealerinfo.service';
import { DealerAdvantagesService } from './dealer-advantages.service';
import { CustomerAdvantagesService } from './customer-advantages.service';
import { CertificatesService } from './certificates.service';
import { ReferencesService } from './references.service';
import { TeamService } from './team.service';
import { VacanciesService } from './vacancies.service';
import { AesService } from './aes.service';
import { ResultService } from './result.service';
import { StepsService } from './steps.service';
import { WorkVolumeService } from './work-volume.service';
import { SmiService } from './smi.service';
import { GalleryService } from './gallery.service';

@NgModule({
  providers: [
    WorkdirectionsService,
    ProjectsService,
    NewsService,
    AtexHistoryService,
    AtekCertificatesService,
    AtekDealerinfoesService,
    DealerAdvantagesService,
    CustomerAdvantagesService,
    CertificatesService,
    ReferencesService,
    TeamService,
    VacanciesService,
    AesService,
    ResultService,
    StepsService,
    WorkVolumeService,
    SmiService,
    GalleryService
  ]
})
export class ModelsModule { }
