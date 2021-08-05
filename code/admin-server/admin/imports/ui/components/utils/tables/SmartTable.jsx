import React, { Component } from "react";
import PropTypes from "prop-types";
import TableDataContainer from "./TableDataContainer.jsx";

const defaultPageSize = 25;

export default class SmartTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: props.limit ? props.limit : defaultPageSize,
      orderBy: props.orderBy,
      search: "",
      activeFilters: [],
    };
  }

  handleOptions = (options) => {
    this.setState(options);
  };

  loadMore = () => {
    const { limit } = this.props;
    const pageSize = limit || defaultPageSize;
    this.setState((prevState) => ({ limit: prevState.limit + pageSize }));
  };

  toggleFilter = (filter) => {
    this.setState((prevState) => {
      const { name, field, value } = filter;
      const operator = filter.operator || "$and";
      const stringifiedValue = JSON.stringify(value);
      const filterString = `${name}=${field}=${stringifiedValue}=${operator}`;
      const newFilterIsActive = prevState.activeFilters.includes(filterString);

      return {
        activeFilters: newFilterIsActive
          ? prevState.activeFilters.filter(
              (existingString) => existingString !== filterString
            )
          : [filterString, ...prevState.activeFilters],
      };
    });
  };

  render() {
    const { activeFilters, limit, orderBy, search } = this.state;
    const {
      columns,
      title,
      collection,
      publication,
      selector,
      extraFields,
      showLoadMore,
      searchableFields,
      textSearch,
      hideHeader,
      filters,
      additionalHeaderItems,
      hideFilters,
      getDataIds,
      showCounter,
      compact,
    } = this.props;

    return (
      <TableDataContainer
        title={title}
        columns={columns}
        collection={collection}
        selector={selector}
        filters={filters}
        activeFilters={activeFilters}
        toggleFilter={this.toggleFilter}
        extraFields={extraFields}
        searchableFields={searchableFields}
        textSearch={textSearch || false}
        publication={publication}
        limit={limit}
        orderBy={orderBy}
        search={search}
        changeOptions={this.handleOptions}
        loadMore={this.loadMore}
        showLoadMore={showLoadMore === undefined ? true : showLoadMore}
        hideHeader={hideHeader || false}
        additionalHeaderItems={additionalHeaderItems || []}
        hideFilters={hideFilters}
        getDataIds={getDataIds}
        showCounter={showCounter}
        compact={compact}
      />
    );
  }
}

export const propTypes = {
  publication: PropTypes.string,
  collection: PropTypes.object,
  selector: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  orderBy: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  showLoadMore: PropTypes.bool,
  limit: PropTypes.number,
  extraFields: PropTypes.arrayOf(PropTypes.string),
  searchableFields: PropTypes.arrayOf(PropTypes.string),
  hideHeader: PropTypes.bool,
  textSearch: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.object),
  additionalHeaderItems: PropTypes.arrayOf(PropTypes.object),
  hideFilters: PropTypes.bool,
  getDataIds: PropTypes.func,
  showCounter: PropTypes.bool,
  compact: PropTypes.bool,
};

export const defaultProps = {
  publication: "",
  collection: {},
  selector: {},
  columns: [],
  title: "",
  orderBy: {},
  showLoadMore: true,
  limit: 0,
  extraFields: [],
  searchableFields: [],
  hideHeader: false,
  textSearch: false,
  filters: [],
  additionalHeaderItems: [],
  hideFilters: false,
  getDataIds: null,
  showCounter: false,
  compact: false,
};

SmartTable.propTypes = propTypes;
SmartTable.defaultProps = defaultProps;
