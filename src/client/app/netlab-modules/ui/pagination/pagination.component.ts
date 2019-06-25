// Angular
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

// Framework

// Libs
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pagination-ui',
  styleUrls: [ './pagination.component.scss' ],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnDestroy, OnInit {
  totalPages: Array<number>;

  @Input() set total(totalPages: number) {
    this.totalPages = [];
    for (let i = 0; i < totalPages; i++) {
      this.totalPages[i] = i + 1;
    }
  }

  @Input() set current(currentPage: number) {
    this._current.next(currentPage);
  }

  @Output() paginate: EventEmitter<number> = new EventEmitter();

  get total(): number {
    return this.totalPages.length;
  }

  _current: BehaviorSubject<number> = new BehaviorSubject(1);

  ngOnInit(): void {
    this._current
      .pipe(
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe(this.paginate);
  }

  ngOnDestroy(): void {
    this._current.complete();
  }

  hasPrev(): boolean {
    return this._current.value > 1;
  }

  hasNext(): boolean {
    return this._current.value < this.total;
  }

  paginateTo(page: number): void {
    this._current.next(page);
  }

  paginateToPrev(): void {
    if (this.hasPrev()) {
      this._current.next(this._current.value - 1);
    }
  }

  paginateToNext(): void {
    if (this.hasNext()) {
      this._current.next(this._current.value + 1);
    }
  }

  classForPageButton(page: number): {[key: string]: boolean} {
    const classList: {[key: string]: boolean} = {};
    if (this._current.value === page) {
      classList.current = true;
    }

    return classList;
  }
}
