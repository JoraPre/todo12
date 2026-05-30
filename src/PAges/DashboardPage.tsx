import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchDashboardThunk } from "../store/dashboard/slices/dashboardSlice";

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
  Typography,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { PeriodType } from "../types.ts/types";

const { Title } = Typography;

function DashboardPage() {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.dashboard);

  const [period, setPeriod] = useState<PeriodType>("day");

  useEffect(() => {
    dispatch(fetchDashboardThunk(period));
  }, [period, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardThunk(period));
  };

  if (loading && !stats) {
    return <Spin fullscreen tip="Загрузка..." />;
  }

  const totalUsers = stats?.totalUsers ?? 0;
  const activeUsers = stats?.activeUsers ?? 0;
  const blockedUsers = stats?.blockedUsers ?? 0;
  const roleStats = stats?.roleStats ?? [];
  const registrationData = stats?.registrationData ?? [];
  const maxCount = Math.max(...registrationData.map((r) => r.count), 1);

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          Дашборд
        </Title>

        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loading}
        >
          Обновить
        </Button>
      </Row>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={16} style={{ marginBottom: 24 }}>
        {[
          { title: "Всего пользователей", value: totalUsers, color: "#1890ff" },
          { title: "Активные", value: activeUsers, color: "#52c41a" },
          { title: "Заблокированные", value: blockedUsers, color: "#ff4d4f" },
        ].map((item) => (
          <Col span={8} key={item.title}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{ color: item.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Статус пользователей">
            <Progress
              type="circle"
              percent={Math.round((activeUsers / (totalUsers || 1)) * 100)}
              strokeColor="#52c41a"
            />
            <div style={{ marginTop: 16 }}>
              <p>Активные: {activeUsers}</p>
              <p>Заблокированные: {blockedUsers}</p>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Роли пользователей">
            {roleStats.map(({ role, count }) => (
              <div key={role} style={{ marginBottom: 16 }}>
                <b>{role}</b>
                <Progress percent={Math.round((count / totalUsers) * 100)} />
                <span>{count} чел.</span>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

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
          {registrationData.map((r) => (
            <div key={r.label} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  background: "#1890ff",
                  height: `${(r.count / maxCount) * 200}px`,
                  borderRadius: "6px 6px 0 0",
                }}
              />
              <div style={{ marginTop: 8 }}>{r.count}</div>
              <small>{r.label}</small>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export default DashboardPage;
