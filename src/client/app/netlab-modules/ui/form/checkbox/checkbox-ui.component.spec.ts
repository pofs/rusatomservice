import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  inject,
  async,
  TestBed,
  ComponentFixture,
  getTestBed
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

/**
 * Load the implementations that should be tested.
 */
import { CheckboxUiComponent } from './checkbox-ui.component';

describe('CheckboxUiComponent', () => {
  let comp: CheckboxUiComponent;
  let fixture: ComponentFixture<CheckboxUiComponent>;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  /**
   * async beforeEach.
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxUiComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule]
    })

      /**
       * Compile template and css.
       */
      .compileComponents();
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  }));

  /**
   * Synchronous beforeEach.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxUiComponent);
    comp = fixture.componentInstance;

    /**
     * Trigger initial data binding.
     */
    fixture.detectChanges();
  });

  it('should log ngOnInit', () => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    comp.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  });

});
