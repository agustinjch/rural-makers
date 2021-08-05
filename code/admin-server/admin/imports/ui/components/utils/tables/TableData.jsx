import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import moment from "moment";
import {
  Table,
  Label,
  Icon,
  Button,
  Segment,
  Loader,
  Header,
  Grid,
  Dimmer,
} from "semantic-ui-react";
import SearchBox from "./SearchBox.jsx";
import { cleanFieldName } from "./Utils";
import { booleanToIcon } from "../../../utils/utils";

export default class TableData extends Component {
  getFieldName = (obj, fullField) => {
    const field = cleanFieldName(fullField);
    const result = obj[field];

    if (_.isString(result)) {
      return result;
    }

    if (_.isBoolean(result)) {
      return booleanToIcon(result);
    }

    if (_.isNumber(result)) {
      return result;
    }

    if (_.isDate(result)) {
      return (
        <span>
          {moment(result).fromNow()} <br />
          <small>{moment(result).format("DD/MM/YY (HH:mm:ss)")}</small>
        </span>
      );
    }
    if (_.isArray(result)) {
      let chips = "";
      _.each(result, (data) => {
        chips += _.values(data);
      });
      return chips;
    }
    if (_.isObject(result)) {
      let chips = "";
      _.each(_.values(result), (data) => {
        if (_.isString(data)) {
          const subField = fullField.replace(field, "").replace(".", "");
          chips = result[subField];
          return;
        }
        chips += data;
      });
      return chips;
    }
    return result;
  };

  handleOrderBy = (field) => {
    const { orderBy, changeOptions } = this.props;
    let ordering = orderBy.ordering;
    if (field === orderBy.field) {
      ordering = ordering * -1;
    }
    changeOptions({ orderBy: { field, ordering } });
  };

  handleOrderByIcon = (column) => {
    if (_.isUndefined(column.orderable)) {
      return null;
    }
    let color = "#444";
    let iconClass = "sort-amount-desc";
    if (column.data == this.props.orderBy.field) {
      color = "#666";
      if (this.props.orderBy.ordering == -1) {
        iconClass = "sort";
      }
    }
    return <Icon name="sort" />;
  };

  _renderColumn = (column, obj) => {
    if (column.component) {
      return <column.component key={obj._id} doc={obj} {...column.props} />;
    } else if (column.render) {
      return column.render(obj);
    }
    return <span>{this.getFieldName(obj, column.data)}</span>;
  };

  render() {
    const {
      columns,
      title,
      data,
      loading,
      search,
      changeOptions,
      actions,
      hasMore,
      loadingMore,
      loadMore,
      count,
      countReady,
      hideHeader,
      filters,
      activeFilters,
      toggleFilter,
      additionalHeaderItems,
      hideFilters,
      showCounter,
      compact,
    } = this.props;

    const tableBodyRows = data.length ? (
      data.map((obj) => (
        <Table.Row key={obj._id}>
          {columns.map((column) => (
            <Table.Cell key={`${obj._id}-${column.label}`}>
              {/* eslint-disable-next-line no-underscore-dangle */}
              {this._renderColumn(column, obj)}
            </Table.Cell>
          ))}
        </Table.Row>
      ))
    ) : (
      <Table.Row key="empty">
        <Table.Cell />
      </Table.Row>
    );

    const filterComponents = filters.map((group) => [
      <Label
        key={group.title}
        size="small"
        basic
        style={{ marginRight: 5 }}
        icon="filter"
        content={group.title}
        className="filter-name"
      />,
      group.items.map((filter, index) => {
        const { name, field, value } = filter;
        const operator = filter.operator || "$and";

        const filterString = `${field}-${name}-${operator}`;
        const curentFilterValue = activeFilters[filterString];
        const active =
          JSON.stringify(curentFilterValue) === JSON.stringify(value);

        return (
          <Label
            key={name || index}
            size="small"
            as="a"
            content={name}
            style={{ margin: "1px 1px 0 0" }}
            color={active ? "green" : null}
            onClick={() => toggleFilter(filter)}
          />
        );
      }),
    ]);

    const hasMoreHeaderItems =
      additionalHeaderItems && additionalHeaderItems.length;

    const counter = showCounter ? (
      <Label size="mini" circular>
        {count}
      </Label>
    ) : null;

    const header = !hideHeader ? (
      <Segment id="table-header">
        <Grid columns="equal" verticalAlign="middle">
          <Grid.Row centered>
            <Grid.Column width="2" floated="left">
              <Header as="h4">
                {title} {counter}
              </Header>
            </Grid.Column>

            <Grid.Column>
              {hasMoreHeaderItems ? additionalHeaderItems : null}
              {hasMoreHeaderItems && !hideFilters && filters.length ? (
                <span style={{ margin: "0 4px" }}>|</span>
              ) : null}
              {!hideFilters && filters.length ? filterComponents : null}
            </Grid.Column>

            <Grid.Column width="3" floated="right">
              <SearchBox autoFocus search={changeOptions} value={search} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    ) : null;

    return (
      <>
        {header}
        <Segment basic className="table-segment">
          <Dimmer active={loading} inverted>
            <Loader content={`Fetching ${title || "Data"}`} />
          </Dimmer>
          <Table compact={compact}>
            <Table.Header>
              <Table.Row>
                {columns.map((column) => (
                  <Table.HeaderCell key={column.label}>
                    {column.label} {this.handleOrderByIcon(column)}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>{tableBodyRows}</Table.Body>
            {hasMore ? (
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan={columns.length} textAlign="center">
                    <Button onClick={loadMore} loading={loadingMore}>
                      Load More
                    </Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            ) : (
              <Table.Footer />
            )}
          </Table>
        </Segment>
      </>
    );
  }
}

TableData.propTypes = {
  publication: PropTypes.string.isRequired,
  collection: PropTypes.object.isRequired,
  selector: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  orderBy: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  showLoadMore: PropTypes.bool.isRequired,
  limit: PropTypes.number.isRequired,
  extraFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchableFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  hideHeader: PropTypes.bool.isRequired,
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  additionalHeaderItems: PropTypes.arrayOf(PropTypes.object),
  hideFilters: PropTypes.bool,
  activeFilters: PropTypes.object,
  toggleFilter: PropTypes.func,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool,
  search: PropTypes.string,
  changeOptions: PropTypes.func,
  showCounter: PropTypes.bool,
  count: PropTypes.number,
  countReady: PropTypes.bool,
};

TableData.defaultProps = {
  hideFilters: true,
  activeFilters: {},
  toggleFilter: () => {},
  hasMore: false,
  loadingMore: false,
  additionalHeaderItems: [],
  search: "",
  changeOptions: () => {},
  showCounter: false,
  count: 0,
  countReady: false,
};
