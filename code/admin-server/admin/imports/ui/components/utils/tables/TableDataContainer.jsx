import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/kadira:flow-router";
import { withTracker } from "meteor/react-meteor-data";
import { SubsManager } from "meteor/meteorhacks:subs-manager";
import { Counts } from "meteor/tmeasday:publish-counts";
import moment from "moment";
import { ReactiveDict } from "meteor/reactive-dict";
import TableData from "./TableData.jsx";
import { prepareSubscriptionFields, prepareSearch } from "./Utils";

const CollectionSubs = new SubsManager();

const reactiveFilters = new ReactiveDict({});
FlowRouter.triggers.exit([() => reactiveFilters.destroy()]);

export default withTracker((props) => {
  const defaultLimit = 20;
  const {
    selector,
    collection,
    columns,
    limit,
    orderBy,
    publication,
    extraFields,
    searchableFields,
    textSearch,
    getDataIds,
    showCounter,
  } = props;
  let { search } = props;
  const query = search;
  const currentUser = Meteor.user();

  const preparedSearch = search
    ? prepareSearch(search, searchableFields, textSearch)
    : {};
  search = Object.assign(preparedSearch, selector);

  // filter management
  const activeFilters = reactiveFilters.all();

  // check if there are query params in url already and merge with existing one
  FlowRouter.watchPathChange();
  const currentContext = FlowRouter.current();

  const queryParamList =
    currentContext && Object.entries(currentContext.queryParams);
  if (Array.isArray(queryParamList) && queryParamList.length) {
    queryParamList.forEach(([filterQueryKeyString, value]) => {
      const [field, name, operator] = filterQueryKeyString.split("-");

      // check if current filter exists
      const filterKeyStirng = `${field}-${name}-${operator}`;
      const currentFilter = reactiveFilters.get(filterKeyStirng);

      if (!currentFilter) {
        let parsedValue = value;
        try {
          parsedValue = JSON.parse(value);
        } catch (error) {}

        return reactiveFilters.set(filterKeyStirng, parsedValue);
      }

      return null;
    });
  }

  // filter preparation
  if (activeFilters) {
    const filters = {};
    Object.entries(activeFilters).forEach(([filterKeyString, value]) => {
      // if no value is present remove filter from object
      const isBoolean = typeof value === "boolean";
      const isObject = typeof value === "object" && value !== null;
      if (!value && !isBoolean) {
        return;
      }
      const [field, name, operator] = filterKeyString.split("-");

      const queryParamKey = `${field}-${name}-${operator}`;
      if (!queryParamList.map(([key]) => key).includes(queryParamKey)) {
        let queryValue = value;
        if (isObject || isBoolean) {
          queryValue = JSON.stringify(value);
        }

        FlowRouter.setQueryParams({
          [queryParamKey]: queryValue || null,
        });
      }

      // modify actual filter used in query for subscription
      filters[operator] = filters[operator]
        ? [...filters[operator], { [field]: value }]
        : [{ [field]: value }];
    });

    search = Object.assign(search, filters);
  }

  // only for Switchain (pairs:XXX-YYY)
  // explanation at table Utils.js prepareSearch
  // eslint-disable-next-line no-underscore-dangle
  if (query.startsWith("-") && collection._name === "shifts") {
    search = Object.assign(search, {
      createdAt: {
        $gte: new Date(moment().subtract(7, "days").format("YYYY-MM-DD")),
      },
    });
  }

  const fields = prepareSubscriptionFields(columns, selector);
  if (extraFields) {
    extraFields.forEach((field) => (fields[field] = 1));
  }

  const options = {
    limit: limit || defaultLimit,
    orderBy: orderBy || { field: "createdAt", ordering: -1 },
    search,
    fields,
  };

  let countReady = true;
  let count = 0;
  if (showCounter) {
    const counterHandle = Meteor.subscribe(`${publication}.counter`, {
      search,
    });
    countReady = counterHandle.ready();
    count = Counts.get(`${publication}.counter`);
  }

  CollectionSubs.subscribe(publication, options);

  const findOptions = { sort: {}, limit: options.limit };
  findOptions.sort = Array.isArray(options.orderBy)
    ? options.orderBy
    : { [options.orderBy.field]: options.orderBy.ordering };
  findOptions.fields = fields;

  let clientSearch = search;
  // minimongo has not $text search operator
  if (clientSearch.$text) {
    clientSearch = Object.assign(
      prepareSearch(query, searchableFields),
      selector
    );
  }

  const data = collection.find(clientSearch, findOptions).fetch();

  if (getDataIds) {
    getDataIds({ dataIds: data.map((entry) => entry._id) });
  }

  const loading =
    !countReady || (count > 0 && data.length === 0) || !CollectionSubs.ready();
  const hasMore = showCounter ? data.length < count : true;
  const loadingMore = showCounter
    ? data.length > 0 && data.length < limit
    : false;

  return {
    currentUser,
    options,
    loading,
    data,
    count,
    countReady,
    hasMore,
    loadingMore,
    toggleFilter,
    activeFilters,
  };
})(TableData);

function toggleFilter(filter) {
  const { name, field, value } = filter;
  const operator = filter.operator || "$and";
  const filterKeyStirng = `${field}-${name}-${operator}`;

  const previousFilterValue = reactiveFilters.get(filterKeyStirng);

  if (!previousFilterValue && previousFilterValue !== false) {
    return reactiveFilters.set(filterKeyStirng, value);
  }

  // remove value from filter
  reactiveFilters.set(filterKeyStirng, null);
  return FlowRouter.setQueryParams({ [filterKeyStirng]: null });
}
