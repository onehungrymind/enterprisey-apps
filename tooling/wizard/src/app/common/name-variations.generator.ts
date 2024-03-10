import { NameVariations, Prop, Schema, RelationType } from './api-interfaces';

// BASIC STRING MANIPULATION
export const DASH = '-';
export const UNDERSCORE = '_';
export const SPACE = ' ';
export const EMPTY = '';

export const lowercase = (s) => s.toLowerCase();
export const uppercase = (s) => s.toUpperCase();
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const decapitalize = (s) => s.charAt(0).toLowerCase() + s.slice(1);
export const capitalizeWords = (s) =>
  s.split(SPACE).map(capitalize).join(SPACE);

export const replace = (s, targ, sub) => s.split(targ).join(sub);
export const stripDashes = (s) => replace(s, DASH, SPACE);
export const stripUnderscores = (s) => replace(s, UNDERSCORE, SPACE);
export const stripSpaces = (s) => replace(s, SPACE, EMPTY);
export const addDashes = (s) => replace(s, SPACE, DASH);
export const addUnderscores = (s) => replace(s, SPACE, UNDERSCORE);

// CASING
const _pipe = (a, b) => (arg) => b(a(arg));
export const transformPipe = (...ops) => ops.reduce(_pipe);

export const strip = transformPipe(stripDashes, stripUnderscores);
export const startCase = transformPipe(strip, capitalizeWords);
export const pascalCase = transformPipe(startCase, stripSpaces);
export const camelCase = transformPipe(pascalCase, decapitalize);
export const kebabCase = transformPipe(strip, addDashes, lowercase);
export const snakeCase = transformPipe(strip, addUnderscores, lowercase);
export const constantCase = transformPipe(strip, addUnderscores, uppercase);

// BUILDING
export const buildBase = (schema: Schema): NameVariations => ({
  ref: camelCase(schema.model),
  refs: camelCase(schema.modelPlural),
  model: pascalCase(schema.model),
  models: pascalCase(schema.modelPlural),
  selector: kebabCase(schema.model),
  selectors: kebabCase(schema.modelPlural),
  snake: snakeCase(schema.model),
  snakes: snakeCase(schema.modelPlural),
});

export const buildSingleParam = (v: NameVariations) => `${v.ref}: ${v.model}`;
export const buildMultiParam = (v: NameVariations) => `${v.refs}: ${v.model}[]`;

export const addParams = (variations: NameVariations) => ({
  ...variations,
  singleParam: buildSingleParam(variations),
  multiParam: buildMultiParam(variations),
});

export const generateNameVariations = transformPipe(buildBase, addParams);

export const buildBaseRelationVariations = ({
  relation: { relatedSchema },
}: Prop): NameVariations => ({
  ref: camelCase(relatedSchema.model),
  refs: camelCase(relatedSchema.modelPlural),
  model: pascalCase(relatedSchema.model),
  models: pascalCase(relatedSchema.modelPlural),
  selector: kebabCase(relatedSchema.model),
  selectors: kebabCase(relatedSchema.modelPlural),
  snake: snakeCase(relatedSchema.model),
  snakes: snakeCase(relatedSchema.modelPlural),
});

export const generateRelationNameVariations: (prop: Prop) => NameVariations =
  transformPipe(buildBaseRelationVariations, addParams);

export const getPropFieldName = (prop: Prop) => {
  switch (prop.relation?.type) {
    case RelationType.OneToMany:
      return `${snakeCase(prop.relation.relatedSchema.model)}_ids`;
    case RelationType.ManyToOne:
      return `${snakeCase(prop.relation.relatedSchema.model)}_id`;
    case RelationType.ManyToMany:
      return `${snakeCase(prop.relation.relatedSchema.model)}_ids`;
    default:
      return snakeCase(prop['key']);
  }
};
