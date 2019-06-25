// angular
import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

// libs
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { filter, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

const loadingClassActive = 'loading-control loading';
const loadingClassLoaded = 'loading-control loaded';
const loadingClassFirstLoad = 'loading-control loaded first-load';

export class LoadingStreamEvent {
  loading: Loading | ProgressLoading;
  event: string;
}

export class Loading {
  loading = false;
  loadingClass: string = loadingClassFirstLoad;
  name: string;
  status: BehaviorSubject<boolean> = new BehaviorSubject(this.loading);
  concurrentCount = 0;

  constructor(public method: string, public resource = 'main') {
    this.name = `${resource}.${method}`;
  }

  /**
   * StartLoading
   * Start loading and change loading_class to loadingClassActive constant value
   */
  startLoading(): boolean {
    this.loadingClass = loadingClassActive;
    this.status.next(true);
    this.concurrentCount += 1;
    this.loading = true;

    return true;
  }

  /**
   * StopLoading
   * Stop loading and change loading_class to loadingClassLoaded constant value
   */
  stopLoading(): boolean {
    this.loadingClass = loadingClassLoaded;
    this.status.next(false);
    this.concurrentCount -= 1;
    if (this.concurrentCount < 1) {
      this.concurrentCount = 0;
      this.loading = false;
    }

    return false;
  }
}

export class ProgressLoading extends Loading {
  progress: BehaviorSubject<number> = new BehaviorSubject(0);
  progressMax = 0;

  constructor(public method: string, public resource = 'main') {
    super(method, resource);
  }

  startLoading(): boolean {
    // TODO: write startLoading method to process status of background requests
    return super.startLoading();
  }

  stopLoading(): boolean {
    // TODO: write stopLoading method to process status of background requests
    return super.stopLoading();
  }
}

@Injectable()
export class LoadingService {
  loading = false;
  eventStream: ReplaySubject<any> = new ReplaySubject();
  private stream: Subject<LoadingStreamEvent> = new Subject();
  private loadings: Array<Loading | ProgressLoading> = [];

  constructor(
    private router: Router
  ) {
    this.buildInternalStream()
      .subscribe(this.eventStream);

    this.subscribeToRouterChanges();
  }

  onlyStartStopFilter(ev: LoadingStreamEvent): boolean {
    return (ev.event === 'start' && this.loadingsCount === 1) || (ev.event === 'stop' && this.loadingsCount === 0);
  }

  startLoading(method: string, resource: string): boolean {
    let loading = this.findLoading(method, resource);
    if (typeof loading === 'undefined') {
      loading = new Loading(method, resource);
      this.loadings.push(loading);
      this[loading.name] = loading;
    }
    this.stream.next({loading, event: 'start'});

    return true;
  }

  stopLoading(method: string, resource: string): boolean {
    const loading = this.findLoading(method, resource);
    if (typeof loading !== 'undefined') {
      this.stream.next({loading, event: 'stop'});
    } else {
      this.startLoading(method, resource);
      this.stopLoading(method, resource);
    }

    return false;
  }

  private findLoading(method: string, resource: string): Loading | ProgressLoading | undefined {
    let loading: Loading | ProgressLoading;

    this.loadings.forEach(
      (l, k) => {
        if (
          this.loadings[k].method === method &&
          this.loadings[k].resource === resource
        ) {
          loading = this.loadings[k];
        }
      }
    );

    return loading;
  }

  private buildInternalStream(): Observable<LoadingStreamEvent> {
    return this.stream.pipe(
      tap(ev => this.startStopLoading(ev)),
      tap(ev => this.toggleLoadingStatus(ev)),
      filter(ev => this.isChanged(ev))
    );
  }

  private toggleLoadingStatus(ev: LoadingStreamEvent): boolean {
    return this.loading = this.loadingsCount > 0;
  }

  private get loadingsCount(): number {
    let count = 0;
    this.loadings.forEach(
      (l, k) => {
        if (
          l.loading
        ) {
          count++;
        }
      }
    );

    return count;
  }

  private startStopLoading(ev: LoadingStreamEvent): void {
    const loading = this.findLoading(ev.loading.method, ev.loading.resource);
    if (ev.event === 'start') {
      loading.startLoading();
    }
    if (ev.event === 'stop') {
      loading.stopLoading();
    }
  }

  private isChanged(ev: LoadingStreamEvent): boolean {
    const loading = this.findLoading(ev.loading.method, ev.loading.resource);

    return (ev.event === 'start' && loading.loading === true) ||
      (ev.event === 'stop' && loading.concurrentCount === 0);
  }

  private subscribeToRouterChanges(): void {
    this.router.events.pipe(filter(
          ev => ev instanceof NavigationStart))
        .subscribe(() => {
          this.startLoading('show', 'page');
        });

    this.router.events.pipe(
        filter(ev => (ev instanceof NavigationEnd) ||
            (ev instanceof NavigationError) ||
            (ev instanceof NavigationCancel)))
        .subscribe(() => {
      this.stopLoading('show', 'page');
    });
  }
}
