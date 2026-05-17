import { Button, Dropdown, Switch, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import type { User, UserFilters } from "../../../types/typesUsers";
import type { MenuProps } from "antd";

interface UsersTableProps {
  users: User[];
  filters: UserFilters;
  isLoading: boolean;
  isAdmin: boolean;
  deletingId: number | null;
  totalAmount: number;
  onTableChange: (
    pagination: TablePaginationConfig,
    sorter: SorterResult<User>,
  ) => void;
  onToggleBlock: (user: User) => void;
  onEditRoles: (user: User) => void;
  getMenuItems: (user: User) => MenuProps["items"];
}

export default function UsersTable({
  users,
  filters,
  isLoading,
  isAdmin,
  deletingId,
  totalAmount,
  onTableChange,
  onToggleBlock,
  onEditRoles,
  getMenuItems,
}: UsersTableProps) {
  const getSortOrder = (field: string) =>
    filters.sortBy === field
      ? filters.sortOrder === "asc"
        ? "ascend"
        : "descend"
      : null;

  const columns: ColumnsType<User> = [
    {
      title: "Имя пользователя",
      dataIndex: "username",
      key: "username",
      sorter: true,
      sortOrder: getSortOrder("username"),
    },
    {
      title: "Email пользователя",
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortOrder: getSortOrder("email"),
    },
    {
      title: "Дата регистрации",
      dataIndex: "date",
      key: "date",

      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Блокировка",
      dataIndex: "isBlocked",
      key: "isBlocked",
      sorter: true,
      sortOrder: getSortOrder("isBlocked"),
      render: (_: unknown, user: User) => (
        <Switch
          checked={!user.isBlocked}
          onChange={() => onToggleBlock(user)}
          checkedChildren="Активен"
          unCheckedChildren="Заблокирован"
        />
      ),
    },
    {
      title: "Роли",
      key: "roles",
      render: (_: unknown, user: User) => (
        <div style={{ display: "flex", gap: 8 }}>
          <span>{user.roles.join(", ") || "-"}</span>
          {}
          {isAdmin && (
            <Button size="small" onClick={() => onEditRoles(user)}>
              Изменить
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Номер телефона",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Dropdown menu={{ items: getMenuItems(record) }} trigger={["click"]}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            size="small"
            disabled={deletingId === record.id}
          />
        </Dropdown>
      ),
    },
  ];

  const handleChange = (
    pagination: TablePaginationConfig,
    _: Record<string, unknown>,
    sorter: SorterResult<User> | SorterResult<User>[],
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    onTableChange(pagination, singleSorter);
  };

  return (
    <Table<User>
      columns={columns}
      dataSource={users ?? []}
      rowKey="id"
      loading={isLoading}
      onChange={handleChange}
      pagination={{
        current: filters.page ?? 1,
        pageSize: filters.limit ?? 20,
        total: totalAmount,
      }}
    />
  );
}
