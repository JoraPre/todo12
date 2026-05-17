import { Alert } from "antd";

interface ErrorProps {
  message: string;
  title?: string;
  onClose?: () => void;
}

export default function Error({ message, title, onClose }: ErrorProps) {
  return (
    <Alert
      message={title || "Ошибка"}
      description={message}
      type="error"
      showIcon
      closable={!!onClose}
      onClose={onClose}
      style={{ marginBottom: 16 }}
    />
  );
}
