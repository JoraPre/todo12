import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  Space,
  Card,
  Typography,
  Badge,
  Button,
  Popconfirm,
  Tooltip,
  message,
} from "antd";
import {
  SearchOutlined,
  StopOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchUsersThunk,
  blockUserThunk,
  unblockUserThunk,
  updateUserThunk,
} from "../store/users/slices/usersSlice";
import type { User } from "../types.ts/types";
import UserModal from "../components/UserModal";

const { Title } = Typography;

function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading, actionLoading } = useAppSelector(
    (state) => state.users,
  );

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const allRoles = Array.from(new Set(users.flatMap((u) => u.roles)));

  const filtered = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.roles.includes(roleFilter);
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !u.isBlocked) ||
      (statusFilter === "blocked" && u.isBlocked);
    return matchSearch && matchRole && matchStatus;
  });

  const handleBlock = async (id: number) => {
    const result = await dispatch(blockUserThunk(id));
    if (blockUserThunk.fulfilled.match(result)) {
      message.success("Пользователь заблокирован");
    } else {
      message.error("Не удалось заблокировать");
    }
  };

  const handleUnblock = async (id: number) => {
    const result = await dispatch(unblockUserThunk(id));
    if (unblockUserThunk.fulfilled.match(result)) {
      message.success("Пользователь разблокирован");
    } else {
      message.error("Не удалось разблокировать");
    }
  };

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleSave = async (
    id: number,
    data: Partial<Pick<User, "username" | "email" | "phoneNumber" | "roles">>,
  ) => {
    setSaveLoading(true);
    const result = await dispatch(updateUserThunk({ id, data }));
    setSaveLoading(false);
    if (updateUserThunk.fulfilled.match(result)) {
      message.success("Изменения сохранены");
      setModalOpen(false);
    } else {
      message.error("Ошибка при сохранении");
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Пользователь",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Роли",
      dataIndex: "roles",
      key: "roles",
      render: (roles: string[]) =>
        roles.map((role) => (
          <Tag color="blue" key={role}>
            {role}
          </Tag>
        )),
    },
    {
      title: "Статус",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked: boolean) =>
        isBlocked ? (
          <Badge status="error" text="Заблокирован" />
        ) : (
          <Badge status="success" text="Активен" />
        ),
    },
    {
      title: "Дата регистрации",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString("ru-RU"),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Действия",
      key: "actions",
      width: 130,
      render: (_, record) => (
        <Space>
          <Tooltip title="Просмотр / Редактировать">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>

          {record.isBlocked ? (
            <Tooltip title="Разблокировать">
              <Popconfirm
                title="Разблокировать пользователя?"
                onConfirm={() => handleUnblock(record.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  icon={<CheckCircleOutlined />}
                  size="small"
                  type="primary"
                  loading={actionLoading === record.id}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Заблокировать">
              <Popconfirm
                title="Заблокировать пользователя?"
                onConfirm={() => handleBlock(record.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  icon={<StopOutlined />}
                  size="small"
                  danger
                  loading={actionLoading === record.id}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>
          Пользователи
        </Title>

        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="Поиск по имени или email"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ width: 280 }}
            allowClear
          />

          <Select
            value={roleFilter}
            onChange={(v) => {
              setRoleFilter(v);
              setPage(1);
            }}
            style={{ width: 160 }}
            options={[
              { value: "all", label: "Все роли" },
              ...allRoles.map((r) => ({ value: r, label: r })),
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            style={{ width: 160 }}
            options={[
              { value: "all", label: "Все статусы" },
              { value: "active", label: "Активные" },
              { value: "blocked", label: "Заблокированные" },
            ]}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: filtered.length,
            onChange: setPage,
            showSizeChanger: false,
            showTotal: (total) => `Всего: ${total}`,
          }}
        />
      </Card>

      <UserModal
        user={selectedUser}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      />
    </>
  );
}

export default UsersPage;
