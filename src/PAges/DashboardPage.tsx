import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Col,
  Row,
  Statistic,
  Button,
  Radio,
  Spin,
  Alert,
  Progress,
} from "antd";

type User = {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: string[];
};

type Period = "day" | "week" | "month";

function DashboardPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("day");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://easydev.club/api/v1/admin/users?limit=1000&page=1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(res.data.data);
      setError("");
    } catch {
      setError("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Статистика
  const totalUsers = users.length;

  const blockedUsers = users.filter((u) => u.isBlocked).length;

  const activeUsers = totalUsers - blockedUsers;

  // Роли
  const roleCounts: Record<string, number> = {};

  users.forEach((u) =>
    u.roles.forEach((role) => {
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    }),
  );

  // График регистраций
  const registrations = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();

    if (period === "day") {
      date.setDate(date.getDate() - (9 - i));

      return {
        label: date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
        }),

        count: users.filter((u) => {
          const d = new Date(u.date);

          return d.toDateString() === date.toDateString();
        }).length,
      };
    }

    if (period === "week") {
      date.setDate(date.getDate() - (9 - i) * 7);

      const start = new Date(date);

      start.setDate(date.getDate() - date.getDay() + 1);

      const end = new Date(start);

      end.setDate(start.getDate() + 6);

      return {
        label: start.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
        }),

        count: users.filter((u) => {
          const d = new Date(u.date);

          return d >= start && d <= end;
        }).length,
      };
    }

    date.setMonth(date.getMonth() - (9 - i));

    return {
      label: date.toLocaleDateString("ru-RU", {
        month: "short",
      }),

      count: users.filter((u) => {
        const d = new Date(u.date);

        return (
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
        );
      }).length,
    };
  });

  const maxCount = Math.max(...registrations.map((r) => r.count), 1);

  if (loading) {
    return <Spin fullscreen tip="Загрузка..." />;
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Шапка */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Дашборд</h1>

        <div>
          <Button onClick={loadUsers} style={{ marginRight: 8 }}>
            Обновить
          </Button>

          <Button danger onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </Row>

      {/* Ошибка */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{
            marginBottom: 24,
          }}
        />
      )}

      {/* Карточки */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {[
          {
            title: "Всего пользователей",
            value: totalUsers,
            color: "#1890ff",
          },

          {
            title: "Активные",
            value: activeUsers,
            color: "#52c41a",
          },

          {
            title: "Заблокированные",
            value: blockedUsers,
            color: "#ff4d4f",
          },
        ].map((item) => (
          <Col span={8} key={item.title}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{
                  color: item.color,
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Статус */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Статус пользователей">
            <Progress
              type="circle"
              percent={Math.round((activeUsers / (totalUsers || 1)) * 100)}
              strokeColor="#52c41a"
            />

            <div
              style={{
                marginTop: 16,
              }}
            >
              <p>Активные: {activeUsers}</p>

              <p>Заблокированные: {blockedUsers}</p>
            </div>
          </Card>
        </Col>

        {/* Роли */}
        <Col span={12}>
          <Card title="Роли пользователей">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div
                key={role}
                style={{
                  marginBottom: 16,
                }}
              >
                <b>{role}</b>

                <Progress percent={Math.round((count / totalUsers) * 100)} />

                <span>{count} чел.</span>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Регистрации */}
      <Card
        title="Регистрации пользователей"
        extra={
          <Radio.Group
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <Radio.Button value="day">День</Radio.Button>

            <Radio.Button value="week">Неделя</Radio.Button>

            <Radio.Button value="month">Месяц</Radio.Button>
          </Radio.Group>
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            height: 250,
          }}
        >
          {registrations.map((r) => (
            <div
              key={r.label}
              style={{
                flex: 1,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  background: "#1890ff",
                  height: `${(r.count / maxCount) * 200}px`,
                  borderRadius: "6px 6px 0 0",
                }}
              />

              <div
                style={{
                  marginTop: 8,
                }}
              >
                {r.count}
              </div>

              <small>{r.label}</small>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;
