import { Input, Dropdown, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import type { UserFilters } from "../../../types/typesUsers";

interface UsersFiltersProps {
  filters: UserFilters;
  onSearch: (value: string) => void;
  onBlockedFilterChange: (key: string) => void;
}

export default function UsersFilters({
  filters,
  onSearch,
  onBlockedFilterChange,
}: UsersFiltersProps) {
  const selectedFilterKey =
    filters.isBlocked === undefined
      ? "all"
      : filters.isBlocked
        ? "blocked"
        : "active";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 12,
        marginBottom: 16,
      }}
    >
      {}
      <Input
        placeholder="Поиск по имени или email"
        style={{ width: 300 }}
        defaultValue={filters.search || ""}
        onChange={(e) => onSearch(e.target.value)}
        allowClear
      />

      {}
      <Dropdown
        trigger={["click"]}
        menu={{
          selectable: true,
          selectedKeys: [selectedFilterKey],
          onClick: ({ key }) => onBlockedFilterChange(key),
          items: [
            { key: "all", label: "Все пользователи" },
            { key: "active", label: "Только активные" },
            { key: "blocked", label: "Только заблокированные" },
          ],
        }}
      >
        <Button icon={<FilterOutlined />}>Filter</Button>
      </Dropdown>
    </div>
  );
}
