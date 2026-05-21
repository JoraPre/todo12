import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Avatar,
  Row,
  Col,
  Tag,
  Divider,
  Skeleton,
  message,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateMeThunk } from "../store/auth/slices/authSlice";
import type { User } from "../types.ts/types";

const { Title, Text } = Typography;

function ProfilePage() {
  const dispatch = useAppDispatch();
  const { currentUser, profileLoading } = useAppSelector((state) => state.auth);

  const [editing, setEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue({
      username: currentUser?.username,
      email: currentUser?.email,
      phoneNumber: currentUser?.phoneNumber ?? "",
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaveLoading(true);
    const result = await dispatch(updateMeThunk(values));
    setSaveLoading(false);
    if (updateMeThunk.fulfilled.match(result)) {
      message.success("Профиль обновлён");
      setEditing(false);
    } else {
      message.error("Ошибка при сохранении");
    }
  };

  if (profileLoading || !currentUser) {
    return (
      <Card>
        <Skeleton avatar active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  return (
    <Row gutter={24}>
      <Col xs={24} md={8}>
        <Card style={{ textAlign: "center" }}>
          <Avatar
            size={96}
            icon={<UserOutlined />}
            style={{ background: "#1890ff", marginBottom: 16 }}
          />
          <Title level={4} style={{ marginBottom: 4 }}>
            {currentUser.username}
          </Title>
          <Text type="secondary">{currentUser.email}</Text>
          <Divider />
          <div>
            {currentUser.roles.map((role) => (
              <Tag color="blue" key={role} style={{ marginBottom: 4 }}>
                {role}
              </Tag>
            ))}
          </div>
          <Divider />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Зарегистрирован:{" "}
            {new Date(currentUser.date).toLocaleDateString("ru-RU")}
          </Text>
        </Card>
      </Col>

      <Col xs={24} md={16}>
        <Card
          title="Личные данные"
          extra={
            !editing ? (
              <Button icon={<EditOutlined />} onClick={handleEdit}>
                Редактировать
              </Button>
            ) : (
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Отмена
              </Button>
            )
          }
        >
          {!editing ? (
            <Row gutter={[16, 16]}>
              {(
                [
                  { label: "ID", value: currentUser.id },
                  { label: "Имя пользователя", value: currentUser.username },
                  { label: "Email", value: currentUser.email },
                  {
                    label: "Телефон",
                    value: currentUser.phoneNumber ?? (
                      <Text type="secondary">Не указан</Text>
                    ),
                  },
                  {
                    label: "Статус",
                    value: currentUser.isBlocked ? (
                      <Tag color="error">Заблокирован</Tag>
                    ) : (
                      <Tag color="success">Активен</Tag>
                    ),
                  },
                ] as { label: string; value: React.ReactNode }[]
              ).map(({ label, value }) => (
                <Col span={12} key={label}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {label}
                  </Text>
                  <div>
                    <Text strong>{value}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
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

              <Form.Item>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={saveLoading}
                  onClick={handleSave}
                >
                  Сохранить
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default ProfilePage;
