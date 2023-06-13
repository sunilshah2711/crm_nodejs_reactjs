import React, { useState } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useRowSelect,
} from "react-table";

import { Row, Col, Table, Button, Form } from "react-bootstrap";

import styles from "./DatatableHalf.module.scss";

import DatatableSearch from "../DatatableSearch/DatatableSearch";

// Datatabel design

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <>
      <Row className="align-items-center">
        <Col sm={6} md={4} lg={3}>
          <DatatableSearch
            value={value || ""}
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Search this list..."
          />
        </Col>
        <Col sm={6} md={8} lg={9}>
          <div className={`text-end ${styles.TotalData}`}>
            <span>Total : {count}</span>
          </div>
        </Col>
      </Row>
    </>
  );
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const DatatableHalf = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    // selectedFlatRows,
    state: { pageIndex, pageSize }, // selectedRowIds
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <Table
        responsive
        bordered
        hover
        className={styles.Datatable}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <br />
      <div className="d-flex align-items-center justify-content-between">
        <ul className="pagination">
          <li
            className="page-item"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <Button variant="outline-secondary" className="me-2">
              First
            </Button>
          </li>
          <li
            className="page-item"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <Button variant="outline-primary" className="me-2">
              {"<"}
            </Button>
          </li>
          <li
            className="page-item"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <Button variant="outline-primary">{">"}</Button>
          </li>
          <li
            className="page-item"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <Button variant="outline-secondary" className="mx-2">
              Last
            </Button>
          </li>
          <li>
            <Form.Select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Form.Select>
          </li>
        </ul>
        <ul className="pagination">
          <li className="d-flex align-items-center">
            <p>
              Page
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </p>
          </li>
          <li className="ms-2">
            <Form.Control
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              min={1}
              max={pageOptions.length}
            />
          </li>
        </ul>
      </div>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowIds: selectedRowIds,
              "selectedFlatRows[].original": selectedFlatRows.map(
                (d) => d.original
              ),
            },
            null,
            2
          )}
        </code>
      </pre> */}
    </>
  );
};

export default DatatableHalf;
