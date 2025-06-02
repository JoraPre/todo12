import React from "react";
import { Segmented } from "antd";
import { FilterStatus } from "../../types.ts/Todot";

export type FiltersProps = {
  filter: FilterStatus;
  onChangeFilter: (status: FilterStatus) => void;
  counts: {
    all: number;
    inWork: number;
    completed: number;
  };
};

export const Filters: React.FC<FiltersProps> = ({
  filter,
  onChangeFilter,
  counts,
}) => {
  const options = [
    { label: `Все (${counts.all})`, value: "all" },
    { label: `В работе (${counts.inWork})`, value: "inWork" },
    { label: `Выполнено (${counts.completed})`, value: "completed" },
  ];

  return (
    <Segmented
      options={options}
      value={filter}
      onChange={(value) => onChangeFilter(value as FilterStatus)}
    />
  );
};
