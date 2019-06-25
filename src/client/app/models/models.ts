interface Schema<T> {
  readonly fields: any;
  readonly embedded: any;
  readonly formFields: any;
  readonly createForm: any;
}

export class ModelSchemaProperties {
  [propertyName: string]: string;
}

export class ModelSchema {
  id: number;
  props: ModelSchemaProperties;
  name: string;
  previewText: string;
  detailText: string;
  dateCreate: string;
  createdDate: string;
  detailPicture: string;
  previewPicture: string;
}
