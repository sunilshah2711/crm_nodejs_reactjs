import React from "react";

import styles from "./Checkbox.module.scss";

// Normal checkbox frontend design

const Checkbox = (props) => {
  const { Name, Checked = false, Click, Change, Tag } = props;
  return (
    <>
      <label className={styles.CustomCheckbox}>
        <input
          type="checkbox"
          name={Name}
          checked={Checked}
          onChange={Change}
          onClick={Click}
        />
        <p>{Name}</p>
        {Tag}
      </label>
    </>
  );
};

export default Checkbox;
