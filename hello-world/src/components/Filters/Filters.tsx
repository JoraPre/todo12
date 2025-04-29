import React from "react";
import styles from "./Filters.module.css";

export const Filters = ({ filter, onChangeFilter, counts }) => {
  return (
    <div className={styles.filters}>
      <button
        className={`${styles.button} ${filter === "all" ? styles.active : ""}`}
        onClick={() => onChangeFilter("all")}
      >
        Все ({counts.all})
      </button>
      <button
        className={`${styles.button} ${
          filter === "inWork" ? styles.active : ""
        }`}
        onClick={() => onChangeFilter("inWork")}
      >
        В работе ({counts.inWork})
      </button>
      <button
        className={`${styles.button} ${
          filter === "completed" ? styles.active : ""
        }`}
        onClick={() => onChangeFilter("completed")}
      >
        Выполнено ({counts.completed})
      </button>
    </div>
  );
};
