import { Badge, Button, Dropdown, Empty, List, Typography } from "antd";
import { BellOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  markAsRead,
  markAllAsRead,
  clearAll,
} from "../store/notifications/slices/notificationsSlice";
import type { RootState } from "../store";
import type { Notification } from "../store/notifications/slices/notificationsSlice";
const { Text } = Typography;

const TYPE_COLORS: Record<string, string> = {
  success: "#52c41a",
  error: "#ff4d4f",
  warning: "#faad14",
  info: "#1890ff",
};

function NotificationsDropdown() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state: RootState) => state.notifications);
  const unreadCount = items.filter((n: Notification) => !n.read).length;

  const overlay = (
    <div
      style={{
        width: 340,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong>Уведомления {unreadCount > 0 && `(${unreadCount})`}</Text>
        <div style={{ display: "flex", gap: 8 }}>
          {unreadCount > 0 && (
            <Button
              size="small"
              type="link"
              onClick={() => dispatch(markAllAsRead())}
            >
              Прочитать все
            </Button>
          )}
          {items.length > 0 && (
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => dispatch(clearAll())}
            />
          )}
        </div>
      </div>

      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {items.length === 0 ? (
          <Empty
            description="Нет уведомлений"
            style={{ padding: "24px 0" }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={items}
            renderItem={(item: Notification) => (
              <List.Item
                style={{
                  padding: "10px 16px",
                  background: item.read ? "#fff" : "#f6ffed",
                  cursor: "pointer",
                  borderLeft: `3px solid ${TYPE_COLORS[item.type] ?? "#1890ff"}`,
                }}
                onClick={() => dispatch(markAsRead(item.id))}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text strong={!item.read} style={{ fontSize: 13 }}>
                      {item.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {new Date(item.createdAt).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </div>
                  {item.description && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.description}
                    </Text>
                  )}
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => overlay}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Badge count={unreadCount} size="small">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
          style={{ display: "flex", alignItems: "center" }}
        />
      </Badge>
    </Dropdown>
  );
}

export default NotificationsDropdown;
