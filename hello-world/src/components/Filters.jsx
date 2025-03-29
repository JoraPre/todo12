import React from "react";

export const Filters = ({ filter, onChangeFilter, counts }) => {
  return (
    <div className="filters">
      <button
        className={`ball ${filter === "all" ? "active" : ""}`}
        onClick={() => onChangeFilter("all")}
      >
        Все ({counts.all})
      </button>
      <button
        className={`bactive ${filter === "active" ? "active" : ""}`}
        onClick={() => onChangeFilter("active")}
      >
        В работе ({counts.active})
      </button>
      <button
        className={`bcompleted ${filter === "completed" ? "active" : ""}`}
        onClick={() => onChangeFilter("completed")}
      >
        Выполнено ({counts.completed})
      </button>
    </div>
  );
};
