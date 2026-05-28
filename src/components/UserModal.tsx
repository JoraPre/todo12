import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Descriptions,
  Badge,
  Typography,
  Tabs,
} from "antd";
import type { User } from "../types.ts/types";

const { Text } = Typography;

const ALL_ROLES = ["ADMIN", "USER", "MODERATOR"];

interface UserModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: number, data: Partial<Pick<User, "username" | "email" | "phoneNumber" | "roles">>) => void;
  loading?: boolean;
}

function UserModal({ user, open, onClose, onSave, loading }: UserModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber ?? "",
        roles: user.roles,
      });
    }
  }, [user, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    if (user) onSave(user.id, values);
  };

  const infoTab = user ? (
    <Descriptions column={1} size="small" bordered>
      <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
      <Descriptions.Item label="Имя пользователя">{user.username}</Descriptions.Item>
      <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
      <Descriptions.Item label="Телефон">
        {user.phoneNumber ?? <Text type="secondary">—</Text>}
      </Descriptions.Item>
      <Descriptions.Item label="Роли">
        {user.roles.join(", ")}
      </Descriptions.Item>
      <Descriptions.Item label="Статус">
        {user.isBlocked ? (
          <Badge status="error" text="Заблокирован" />
        ) : (
          <Badge status="success" text="Активен" />
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Дата регистрации">
        {new Date(user.date).toLocaleDateString("ru-RU")}
      </Descriptions.Item>
    </Descriptions>
  ) : null;

  const editTab = (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Имя пользователя"
        name="username"
        rules={[{ required: true, message: "Введите имя" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Введите email" },
          { type: "email", message: "Некорректный email" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Телефон" name="phoneNumber">
        <Input placeholder="+7..." />
      </Form.Item>

      <Form.Item label="Роли" name="roles">
        <Select mode="multiple" options={ALL_ROLES.map((r) => ({ value: r, label: r }))} />
      </Form.Item>
    </Form>
  );

  const tabs = [
    { key: "info", label: "Информация", children: infoTab },
    { key: "edit", label: "Редактировать", children: editTab },
  ];

  return (
    <Modal
      title={`Пользователь #${user?.id ?? ""}`}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={loading}
      width={520}
      destroyOnClose
    >
      <Tabs items={tabs} defaultActiveKey="info" />
    </Modal>
  );
}

export default UserModal;
