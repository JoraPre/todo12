import { Radio } from "antd";
import type { Filter, Stats } from "../types/typesTodo";

interface TodoFilterProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  status: Stats;
}

export default function TodoFilter({
  filter,
  onFilterChange,
  status,
}: TodoFilterProps) {
  return (
    <Radio.Group
      value={filter}
      onChange={(e) => onFilterChange(e.target.value)}
      style={{ marginBottom: 16 }}
    >
      <Radio.Button value="all">Все ({status.all})</Radio.Button>
      <Radio.Button value="inWork">В работе ({status.inWork})</Radio.Button>
      <Radio.Button value="completed">
        Выполнено ({status.completed})
      </Radio.Button>
    </Radio.Group>
  );
}
