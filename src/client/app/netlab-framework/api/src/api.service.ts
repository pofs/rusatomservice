// angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

// libs
import { Observable } from 'rxjs/Observable';
import { of as ObservableOf } from 'rxjs/observable/of';
import { catchError, map, merge, tap } from 'rxjs/operators';
import { camelCase, forEach, isArray, isNull, isPlainObject, isString, isUndefined, snakeCase } from 'lodash';

// services
import { LoadingService } from './loading.service';
import { UiNotificationsService } from '../../../netlab-modules/ui/notifications';

// libs
import { Observer } from 'rxjs/Observer';

export interface IResourceParams {
  page: number;
  per: number;
}

export class Collection<T> extends Array<T> {
  pageCount: number;
  currentPage: number;
  perPage: number;
  total: number;

  constructor(arrayCollection: Array<T> = []) {
    super();

    arrayCollection.forEach(t => {
      this.push(t);
    });

    Object.setPrototypeOf(this, Object.create(Collection.prototype));
  }
}

export class ApiError {
  error: any;
  status: number;
  statusText: string;
  message: string;
  ok: boolean;

  constructor(httpRes: HttpErrorResponse) {
    this.error = httpRes.error;
    this.status = httpRes.status;
    this.statusText = httpRes.statusText;
    this.message = httpRes. message;
    this.ok = httpRes.ok;
  }
}

export class Resource<T> {
  // TODO: Write processing HTTP stauses

  private params: IResourceParams = {
    page: 1,
    per: 10
  };

  private usePaginationParams = false;

  constructor(
    public collection: string,
    private readonly api: ApiClientService,
    private readonly loading: LoadingService,
    private readonly http: HttpClient,
    private singular = false,
    private onlyActions?: Array<string>
  ) {
    if (typeof onlyActions !== 'undefined') {
      ['index', 'show', 'create', 'update', 'destroy'].forEach(
        i => { if (onlyActions.indexOf(i) === -1) this[i] = undefined; }
      );
    }
  }

  /**
   * Page
   * Set current page for REST queries, not for singular resource
   */
  page(p: number): Resource<T> {
    if (this.singular) {
      console.error('Setting page param on singular resource not allowed!');
    } else {
      this.params.page = p;
    }

    return this;
  }

  /**
   * Per
   * Set current per items count for REST queries, not for singular resource
   */
  per(p: number): Resource<T> {
    if (this.singular) {
      console.error('Setting per param on singular resource not allowed!');
    } else {
      this.params.per = p;
    }

    return this;
  }

  /**
   * DisallowPageNav
   * Disallow page navigaion
   */
  disallowPageNav(): Resource<T> {
    return this.page(0)
        .per(0);
  }

  /**
   * Index
   * Return resource index
   */
  index(params?: HttpParams): Observable<Collection<T> | ApiError> {
    return this.restIndex(params);
  }

  /**
   * Show
   * Return resource by id
   */
  show(id?: number | string, params?: HttpParams): Observable<T | ApiError> {
    return this.restShow(id, params);
  }

  /**
   * Build (New alias)
   * Create resource and return it
   */
  build(): Observable<T | ApiError> {
    return this.restNew();
  }

  /**
   * Create
   * Create resource and return it
   */
  create(resource: T): Observable<T | ApiError> {
    return this.restCreate(resource);
  }

  /**
   * Update
   * Update resource and return it
   */
  update(resource: T): Observable<T | ApiError> {
    return this.restUpdate(resource);
  }

  /**
   * Destroy
   * Destroy resource
   */
  destroy(resource: T): Observable<T | ApiError> {
    return this.restDestroy(resource);
  }

  /**
   * BuildRequestHeaders
   * Build headers for REST requests
   */
  private buildRequestHeaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return headers;
  }

  /**
   * BuildRequestDefaultParams
   * Build default params for REST requests
   */
  private buildRequestDefaultParams(params?: HttpParams): HttpParams {
    return (params || new HttpParams());
  }

  /**
   * BuildRequestOptions
   * Build options for REST requests
   */
  private buildRequestOptions(params?: HttpParams): any {
    return {
      observe: 'response',
      responseType: 'json',
      headers: this.buildRequestHeaders(),
      params: this.buildRequestDefaultParams(params)
    };
  }

  /**
   * ApiUrl
   * Accessor for api endpoint url for this resource
   */
  private get apiUrl(): string {
    return `${this.api.apiUrl}/${this.collection}/`;
  }

  /**
   * RestIndex
   * REST Method GET action index (Read): /resources
   */
  private restIndex(params?: HttpParams): Observable<Collection<T> | ApiError> {
    const options = this.buildRequestOptions(params);

    if (this.usePaginationParams) {
      if (!this.singular && (this.params.per > 0 || this.params.page > 0)) {
        if (isUndefined(params) || isNull(params.get('per'))) {
          options.params = options.params.set('per', this.params.per.toString());
        }
        if (isUndefined(params) || isNull(params.get('page'))) {
          options.params = options.params.set('page', this.params.page.toString());
        }
      }
    }

    const response: Observable<HttpResponse<Collection<T>>> =
      this.http.get<Collection<T>>(this.apiUrl, options) as Observable<HttpResponse<Collection<T>>>;

    return this.processResponse('index', response) as Observable<Collection<T> | ApiError>;
  }

  /**
   * RestShow
   * REST Method GET action show (Read): /resources/:id
   */
  private restShow(id?: string | number, params?: HttpParams): Observable<T | ApiError> {
    const options = this.buildRequestOptions(params);
    let response: Observable<HttpResponse<T>>;

    if (!this.singular) {
      if (typeof id === 'undefined') {
        console.warn(`Resource ${this.collection} is not singular, empty id attribute is not allowed`);
      }
      response = this.http.get<T>(`${this.apiUrl}${id}/`, options) as Observable<HttpResponse<T>>;
    } else {
      if (typeof id !== 'undefined') {
        console.warn(`Resource ${this.collection} is singular, id attribute is not allowed`);
      }
      response = this.http.get<T>(`${this.apiUrl}`, options) as Observable<HttpResponse<T>>;
    }

    return this.processResponse('show', response) as Observable<T | ApiError>;
  }

  /**
   * RestNew
   * REST Method GET action new: /resources/new
   */
  private restNew(params?: HttpParams): Observable<T | ApiError> {
    const options = this.buildRequestOptions(params);
    const response: Observable<HttpResponse<T>> =
      this.http.get<T>(`${this.apiUrl}new/`, options) as Observable<HttpResponse<T>>;

    return this.processResponse('new', response) as Observable<T | ApiError>;
  }

  /**
   * RestCreate
   * REST Method POST action create (Write/Read): /resources
   */
  private restCreate(resource: T, params?: HttpParams): Observable<T | ApiError> {
    const options = this.buildRequestOptions(params);
    const response: Observable<HttpResponse<T>> =
      this.http.post<T>(`${this.apiUrl}`,
        this.resFieldsNamesToSnakeCase(resource), options) as Observable<HttpResponse<T>>;

    return this.processResponse('create', response) as Observable<T>;
  }

  /**
   * RestUpdate
   * REST Method PUT action update (Write/Read): /resources/:id
   */
  private restUpdate(resource: T, params?: HttpParams): Observable<T | ApiError> {
    const options = this.buildRequestOptions(params);
    let response: Observable<HttpResponse<T>>;

    if (!this.singular) {
      const id = (resource as any).id;
      if (typeof id === 'undefined') {
        console.warn(`Resource ${this.collection} is not singular, empty id attribute is not allowed`);
      }
      response = this.http.put<T>(`${this.apiUrl}${id}/`,
        this.resFieldsNamesToSnakeCase(resource), options) as Observable<HttpResponse<T>>;
    } else {
      response = this.http.put<T>(`${this.apiUrl}`,
        this.resFieldsNamesToSnakeCase(resource), options) as Observable<HttpResponse<T>>;
    }

    return this.processResponse('update', response) as  Observable<T | ApiError>;
  }

  /**
   * RestDestroy
   * REST Method DESTROY action show (Read): /resources/:id
   */
  private restDestroy(resource: T, params?: HttpParams): Observable<T | ApiError> {
    const options = this.buildRequestOptions(params);
    let response: Observable<HttpResponse<T>>;

    if (!this.singular) {
      const id = (resource as any).id;
      if (typeof id === 'undefined') {
        console.warn(`Resource ${this.collection} is not singular, empty id attribute is not allowed`);
      }
      response = this.http.delete<T>(`${this.apiUrl}${id}/`, options) as Observable<HttpResponse<T>>;
    } else {
      response = this.http.delete<T>(`${this.apiUrl}`, options) as Observable<HttpResponse<T>>;
    }

    return this.processResponse('destroy', response) as  Observable<T | ApiError>;
  }

  /**
   * ProcessResponse
   * Send Stop command to loading stream and process response
   */
  private processResponse(
    action: string,
    response: Observable<HttpResponse<any> | HttpErrorResponse>
  ): Observable<ApiError | T | Collection<T>> {

    return response.pipe(
      catchError(err => this.api.handleError(err)),
      map((httpRes: HttpResponse<T | Collection<T>> | HttpErrorResponse) => {
        // проверка на то, что пришел ответ 200
        // если, 200 - то возвращаем тело ответа
        if (httpRes instanceof HttpResponse) {
          let respBody = this.resFieldsNamesToCamelCase(httpRes.body);

          if (action === 'index') {
            respBody = new Collection(respBody as Array<T>);
            respBody.total = +httpRes.headers.get('X-Total-Count');
            respBody.pageCount = +httpRes.headers.get('X-Page-Count');
            respBody.perPage = +httpRes.headers.get('X-Per-Page');
            respBody.currentPage = +httpRes.headers.get('X-Current-Page');
          }

          return respBody;
        }

        // Если ответ все-таки не 200
        // возвращаем объект ApiError
        return new ApiError(httpRes);
      }),
      tap(() => this.loading.stopLoading(action, this.collection)),
      merge(Observable.create((observer: Observer<T>) => {
        this.loading.startLoading(action, this.collection);
        observer.complete();
      }))
    );
  }

  /**
   * ResFieldsNamesToCamelCase
   * Mutates each field name of src response obj to camelCase
   */
  private resFieldsNamesToCamelCase(responseSrcElement: T | Collection<T>): T | Collection<T> {
    let responceDstElement: T | Collection<T>;
    if (isArray(responseSrcElement)) {
      responceDstElement = [] as Collection<T>;
      forEach(responseSrcElement, (el, i) => {
        responceDstElement[i] = isString(el) ? el : this.fieldsNamesToCamelCase(el);
      });
    } else {
      responceDstElement = {} as T;
      responceDstElement = this.fieldsNamesToCamelCase(responseSrcElement);
    }

    return responceDstElement;
  }

  /**
   * FieldsNamesToCamelCase
   * Changes each field name of obj to camelCase
   */
  private fieldsNamesToCamelCase(src: T): T {
    if (isArray(src)) {
      return src;
    }

    const dst: T = {} as T;
    forEach(src as any, (val, fieldName) => {
      dst[camelCase(fieldName as string)] = (isPlainObject(val) || isArray(val)) ? this.resFieldsNamesToCamelCase(val) : val;
    });

    return dst;
  }

  /**
   * ResFieldsNamesToSnakeCase
   * Mutates each field name of src response obj to snake_case
   */
  private resFieldsNamesToSnakeCase(responseSrcElement: T | Collection<T>): T | Collection<T> {
    let responceDstElement: T | Collection<T>;
    if (isArray(responseSrcElement)) {
      responceDstElement = [] as Collection<T>;
      forEach(responseSrcElement, (el, i) => {
        responceDstElement[i] = this.fieldsNamesToSnakeCase(el);
      });
    } else {
      responceDstElement = {} as T;
      responceDstElement = this.fieldsNamesToSnakeCase(responseSrcElement);
    }

    return responceDstElement;
  }

  /**
   * FieldsNamesToSnakeCase
   * Changes each field name of obj to snake_case
   */
  private fieldsNamesToSnakeCase(src: T): T {
    if (isArray(src)) {
      return src;
    }

    const dst: T = {} as T;
    forEach(src as any, (val, fieldName) => {
      dst[snakeCase(fieldName as string)] = (isPlainObject(val) || isArray(val)) ? this.fieldsNamesToSnakeCase(val) : val;
    });

    return dst;
  }
}

@Injectable()
export class ApiClientService {
  apiHost = 'http://new.rusatomservice.ru';

  constructor(
    private readonly http: HttpClient,
    private readonly loading: LoadingService
  ) { }

  build<T>(collection: string,
           singular?: boolean,
           onlyActions?: Array<string>): Resource<T> {
    return new Resource(collection, this, this.loading, this.http, singular, onlyActions);
  }

  /**
   * apiUrl
   * Accessor for public api url
   */
  get apiUrl(): string {
    return `${this.apiHost}/api`;
  }

  /**
   * HandleError
   * Error handler for Api Service
   */
  handleError(error: any): Observable<any> {
    console.error(error);

    return ObservableOf(error || 'Server error');
  }
}
