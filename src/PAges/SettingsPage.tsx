import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Switch,
  Select,
  Divider,
  Button,
  message,
  List,
} from "antd";
import {
  BellOutlined,
  GlobalOutlined,
  SecurityScanOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../hooks";
import { clearAll } from "../store/notifications/slices/notificationsSlice";

const { Title, Text } = Typography;

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <List.Item>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div>
          <Text strong>{label}</Text>
          {description && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {description}
              </Text>
            </div>
          )}
        </div>
        <div>{children}</div>
      </div>
    </List.Item>
  );
}

function SettingsPage() {
  const dispatch = useAppDispatch();

  const [notifyOnBlock, setNotifyOnBlock] = useState(true);
  const [notifyOnDelete, setNotifyOnDelete] = useState(true);
  const [notifyOnUpdate, setNotifyOnUpdate] = useState(false);
  const [language, setLanguage] = useState("ru");
  const [pageSize, setPageSize] = useState("15");
  const [dateFormat, setDateFormat] = useState("dd.mm.yyyy");

  const handleSave = () => {
    message.success("Настройки сохранены");
  };

  const handleClearNotifications = () => {
    dispatch(clearAll());
    message.success("История уведомлений очищена");
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <Card
          title={
            <span>
              <BellOutlined style={{ marginRight: 8 }} />
              Уведомления
            </span>
          }
          style={{ marginBottom: 24 }}
        >
          <List split={false}>
            <SettingRow
              label="Блокировка пользователя"
              description="Уведомлять при блокировке или разблокировке"
            >
              <Switch
                checked={notifyOnBlock}
                onChange={setNotifyOnBlock}
              />
            </SettingRow>

            <SettingRow
              label="Удаление пользователя"
              description="Уведомлять при удалении пользователя"
            >
              <Switch
                checked={notifyOnDelete}
                onChange={setNotifyOnDelete}
              />
            </SettingRow>

            <SettingRow
              label="Редактирование пользователя"
              description="Уведомлять при изменении данных пользователя"
            >
              <Switch
                checked={notifyOnUpdate}
                onChange={setNotifyOnUpdate}
              />
            </SettingRow>
          </List>

          <Divider />

          <Button danger onClick={handleClearNotifications}>
            Очистить историю уведомлений
          </Button>
        </Card>

        <Card
          title={
            <span>
              <GlobalOutlined style={{ marginRight: 8 }} />
              Интерфейс
            </span>
          }
        >
          <List split={false}>
            <SettingRow label="Язык интерфейса">
              <Select
                value={language}
                onChange={setLanguage}
                style={{ width: 160 }}
                options={[
                  { value: "ru", label: "Русский" },
                  { value: "en", label: "English" },
                ]}
              />
            </SettingRow>

            <SettingRow
              label="Записей на странице"
              description="Количество строк в таблице пользователей"
            >
              <Select
                value={pageSize}
                onChange={setPageSize}
                style={{ width: 100 }}
                options={[
                  { value: "10", label: "10" },
                  { value: "15", label: "15" },
                  { value: "25", label: "25" },
                  { value: "50", label: "50" },
                ]}
              />
            </SettingRow>

            <SettingRow label="Формат даты">
              <Select
                value={dateFormat}
                onChange={setDateFormat}
                style={{ width: 160 }}
                options={[
                  { value: "dd.mm.yyyy", label: "ДД.ММ.ГГГГ" },
                  { value: "mm/dd/yyyy", label: "ММ/ДД/ГГГГ" },
                  { value: "yyyy-mm-dd", label: "ГГГГ-ММ-ДД" },
                ]}
              />
            </SettingRow>
          </List>
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card
          title={
            <span>
              <SecurityScanOutlined style={{ marginRight: 8 }} />
              Безопасность
            </span>
          }
        >
          <List split={false}>
            <SettingRow
              label="Автовыход"
              description="Выйти при закрытии вкладки"
            >
              <Switch defaultChecked={false} />
            </SettingRow>

            <SettingRow
              label="Двойная аутентификация"
              description="Требовать подтверждение при входе"
            >
              <Switch defaultChecked={false} disabled />
            </SettingRow>
          </List>

          <Divider />

          <Text type="secondary" style={{ fontSize: 12 }}>
            Некоторые настройки безопасности требуют обращения к администратору.
          </Text>
        </Card>
      </Col>

      <Col xs={24}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          onClick={handleSave}
        >
          Сохранить настройки
        </Button>
      </Col>
    </Row>
  );
}

export default SettingsPage;
