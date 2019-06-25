// libs
import { cloneDeep, isArray, isNumber, isString, merge } from 'lodash';
import { syncArrays } from '../utilites/sync-arrays.function';
import { Observable } from 'rxjs/Observable';
import { of as ObservableOf } from 'rxjs/observable/of';
import { asap } from 'rxjs/Scheduler/asap';

// TODO: Написать методы удаления из кеша

class MemoryIndexElement {
  pristine = true;

  constructor(
    public id: number,
    public key: number,
    public page: number
  ) { }
}

class MemoryIndex<T> {
  [indexElement: number]: MemoryIndexElement;

  push(id: number, key: number, page = 1): MemoryIndexElement {
    return this[id] = new MemoryIndexElement(id, key, page);
  }

  reIndex(items: Array<T>, page = 1): void {
    items.forEach((item, key) => {
      const id = item['id'];
      this[id] = new MemoryIndexElement(id, key, page);
    });
  }

  get(id: number): MemoryIndexElement {
    return this[id];
  }
}

class InMemoryStorage<T> {
  pristine = false;
  private index: MemoryIndex<T> = new MemoryIndex<T>();

  store(value: T | Array<T>, page = 1): void {
    this[`page:${page}`] || (this[`page:${page}`] = []);
    if (isArray(value)) {
      syncArrays(this[`page:${page}`], value);
      this.index.reIndex(value, page);
      this.pristine = true;
    } else {
      const id = value['id'];
      const index = this.index[id];
      if (typeof index !== 'undefined') {
        merge(this[`page:${index.page}`][index.key], value);
      } else {
        const key = this[`page:${page}`].push(value) - 1;
        this.index.push(id, key, page);
      }
    }
  }

  read(id = 0, page = 1): T | Array<T> {
    if (id > 0) {
      const index = this.index[id];
      if (typeof index === 'undefined') {
        console.error(`Record ${id} not found`);
      } else {
        return this[`page:${index.page}`][index.key] as T;
      }
    } else {
      return this[`page:${page}`] as Array<T>;
    }
  }

  isMemoryPristine(): boolean {
    return this.pristine;
  }

  setDirty(id?: number): void {
    if (typeof id === 'undefined') {
      this.pristine = false;
    } else {
      this.index[id].pristine = false;
    }
  }

  isRecordPristine(id: number): boolean {
    const index = this.index.get(id);
    if (typeof index === 'undefined') {
      return false;
    } else {
      return index.pristine;
    }
  }
}

class Storages<T> {
  [key: string]: InMemoryStorage<T>;
}

class ActionObject {
  constructor(
    public actionName: string,
    public indexOrId?: string | number,
    public page?: number
  ) {}
}

export class IndexCache<T> {
  private storage: InMemoryStorage<T> = new InMemoryStorage<T>();
  private indexStorages: Storages<T> = new Storages<T>();

  static processActionString(action: string): ActionObject {
    const actionString = action.split(':');
    const actionName = actionString[0];
    if (actionName === 'index') {
      let index;
      let page;
      if (actionString.length === 2) {
        index = actionString[1];
      }
      if (actionString.length === 3) {
        index = actionString[1];
        page = +actionString[2];
      }

      return new ActionObject(actionName, index, page);
    }
    if (actionName === 'show') {
      const id = +actionString[1];

      return new ActionObject(actionName, id);
    }
  }

  getValue(indexOrId?: number | string): T | Array<T> {
    /* if indexOrId is ID */
    if (isNumber(indexOrId)) {
      return this.storage.read(indexOrId);
    }

    if (isString(indexOrId)) {
      const storage = this.indexStorages[indexOrId] || (this.indexStorages[indexOrId] = new InMemoryStorage<T>());

      return storage.read();
    }

    return this.storage.read();
  }

  setValue(value: T | Array<T>, index?: string, page?: number): void {
    if (typeof index !== 'undefined') {
      const storage = this.indexStorages[index] || (this.indexStorages[index] = new InMemoryStorage<T>());
      storage.store(cloneDeep(value), page);
    } else {
      this.storage.store(cloneDeep(value), page);
    }
  }

  pristine(action: string, indexOrId?: string | number): boolean {
    if (action === 'index') {
      if (typeof indexOrId !== 'undefined') {
        const storage = this.indexStorages[indexOrId] || (this.indexStorages[indexOrId] = new InMemoryStorage<T>());

        return storage.isMemoryPristine();
      } else {
        return this.storage.isMemoryPristine();
      }
    }
    if (action === 'show') {
      const id = indexOrId as number;

      return this.storage.isRecordPristine(id);
    }
  }

  isRecordPristine(id: number): boolean {
    return this.storage.isRecordPristine(id);
  }

  getValueAsObservable(action: string, indexOrId?: string | number, page?: number): Observable<T | Array<T>> {
    if (action === 'index') {
      return ObservableOf(this.getValue(indexOrId) as Array<T>, asap);
    }
    if (action === 'show') {
      return ObservableOf(this.getValue(indexOrId) as T, asap);
    }
  }

  setDirty(action?: string, indexOrId?: string | number): void {
    if (action === 'index') {
      this.storage.setDirty();
    }
    if (action === 'show') {
      const id = +indexOrId;

      this.storage.setDirty(id);
    }
  }
}
