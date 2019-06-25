// libs
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter, isUndefined, remove, sortBy, uniqueId } from 'lodash';

import { Observer } from 'rxjs/Observer';

class Queues<T> {
  [queueName: string]: Array<ObservableInQueue<T>>;
}

export class ObservableInQueue<T> {
  completed = false;
  inProgress = false;

  eventEmitter: Subject<T> = new Subject();
  resObservable: Observable<T>;

  private uniqueId: number = +uniqueId();

  constructor(
    public srcObservable: Observable<T>,
    private queue: Array<ObservableInQueue<T>>
  ) {
    this.resObservable = Observable
      .create((observer: Observer<T>) => this.onSubscribe(observer));

    this.queue.push(this);
  }

  get id(): number {
    return this.uniqueId;
  }

  readyToProcessInThisQueue(): Array<ObservableInQueue<T>> {
    return filter(this.queue, srcObservable => (!srcObservable.inProgress && !srcObservable.completed));
  }

  inProgressInThisQueue(): Array<ObservableInQueue<T>> {
    return filter(this.queue, srcObservable => srcObservable.inProgress);
  }

  setInProgress(): void {
    this.inProgress = true;
  }

  private onSubscribe(observer: Observer<T>): void {
    this.eventEmitter.subscribe(
      value => observer.next(value),
      error => observer.error(error),
      () => {
        this.complete();
        observer.complete();
      }
    );

    if (this.inProgressInThisQueue().length === 0 && this.readyToProcessInThisQueue().length > 0) {
      this.runNextInQueue();
    }
  }

  private complete(): void {
    this.completed = true;
    this.inProgress = false;
    remove(this.queue, srcObservable => srcObservable.id === this.id);
    if (this.readyToProcessInThisQueue().length > 0) {
      this.runNextInQueue();
    }
  }

  private getNext(): ObservableInQueue<T> {
    return sortBy(
      filter(this.queue, srcObservable => (!srcObservable.inProgress && !srcObservable.completed)),
      srcObservable => srcObservable.id
    )[0];
  }

  private runNextInQueue(): void {
    const requestObject = this.getNext();
    if (!isUndefined(requestObject)) {
      requestObject.setInProgress();
      this.srcObservable
        .subscribe(
          requestObject.eventEmitter
        );
    }
  }
}

export class ObservableQueues<O> {
  private queues: Queues<O> = {};

  add(srcObservable: Observable<O>, queueName: string): Observable<O> {
    if (typeof this.queues[queueName] === 'undefined') {
      this.queues[queueName] = [];
    }

    return new ObservableInQueue<O>(srcObservable, this.queues[queueName]).resObservable;
  }

  getNextInQueue(queueName: string): ObservableInQueue<O> {
    return sortBy(
      filter(this.queues[queueName], srcObservable => (!srcObservable.inProgress && !srcObservable.completed)),
      srcObservable => srcObservable.id
    )[0];
  }
}
