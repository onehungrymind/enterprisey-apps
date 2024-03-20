export interface BaseEntity {
  id?: string | null;
}

export interface NameVariations extends BaseEntity {
  ref: string;
  refs: string;
  model: string;
  models: string;
  selector: string;
  selectors: string;
  snake: string;
  snakes: string;
  allUp: string;
  allUps: string;
  singleParam?: string;
  multiParam?: string;
}

export interface Schema extends BaseEntity {
  model: string;
  modelPlural: string;
  description?: string;
  nameVariations?: NameVariations;
  props: Prop[];
  detached?: boolean;
  visible?: boolean;
}

export interface Prop {
  [key: string]: any;
  relation?: Relation;
  scope?: Scope;
  scope_id?: string; // 0 for global, client_id, workspace_id, schema_id
}

export interface Relation extends BaseEntity {
  type: RelationType;
  relatedSchema: Schema;
  relatedField: string;
}

export enum RelationType {
  OneToOne = 'OneToOne',
  OneToMany = 'OneToMany',
  ManyToOne = 'ManyToOne',
  ManyToMany = 'ManyToMany',
}

export enum Scope {
  Global = 'global',
  Client = 'client',
  Workspace = 'workspace',
  Schema = 'schema',
}
