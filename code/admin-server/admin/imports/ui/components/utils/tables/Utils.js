import { _ } from "meteor/underscore";
import { isUndefined } from "underscore";

export function cleanFieldName(fieldName) {
  let field = fieldName;
  const dot = field.indexOf(".");
  if (dot !== -1) field = field.slice(0, dot);

  // If it's referencing an array, strip off the brackets
  field = field.split("[")[0];

  return field;
}

export function prepareSearch(query, searchableFields, textSearch) {
  console.log({ textSearch });
  if (textSearch) return prepareTextSearch({ query });

  console.log({ query, searchableFields });

  const searches = [];
  const regex = new RegExp(`^${query}`);
  searchableFields.forEach(field => {
    if (isUndefined(searches.field)) {
      const m1 = {};
      m1[field] = { $regex: regex };
      searches.push(m1);
    }
  });
  const result = { $or: searches };
  return result;
}

export function prepareTextSearch({ query }) {
  const result = { $text: { $search: query } };
  return result;
}

export function prepareSubscriptionFields(columns, selector) {
  const fields = {};
  columns.forEach(obj => {
    if (obj.data) {
      const field = obj.data;
      fields[field] = 1;
    }
  });
  if (selector) {
    const keys = _.keys(selector);
    keys.forEach(obj => {
      fields[obj] = 1;
    });
  }
  return fields;
}
