import React from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./DatatableSearch.module.scss";

// Datatable search design

const DatatableSearch = (props) => {
  const { value, onChange, placeholder } = props;
  return (
    <>
      <InputGroup className={styles.dataSearchMain}>
        <FormControl
          className="test"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <InputGroup.Text>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </InputGroup.Text>
      </InputGroup>
    </>
  );
};

export default DatatableSearch;
