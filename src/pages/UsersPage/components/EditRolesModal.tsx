import { Modal, Select } from "antd";
import { Roles } from "../../../types/typesUsers";

interface EditRolesModalProps {
  editingRoles: { id: number; roles: Roles[] } | null;
  onClose: () => void;
  onSave: (id: number, roles: Roles[]) => void;
  onRolesChange: (roles: Roles[]) => void;
}

export default function EditRolesModal({
  editingRoles,
  onClose,
  onSave,
  onRolesChange,
}: EditRolesModalProps) {
  return (
    <Modal
      title="Изменить роли для пользователя"
      open={!!editingRoles}
      okText="Сохранить"
      cancelText="Отмена"
      onCancel={onClose}
      onOk={() => {
        if (editingRoles) {
          onSave(editingRoles.id, editingRoles.roles);
        }
      }}
    >
      {}
      <Select
        mode="multiple"
        value={editingRoles?.roles ?? []}
        onChange={(roles) => onRolesChange(roles as Roles[])}
        style={{ width: "100%" }}
        options={Object.values(Roles).map((role) => ({
          label: role,
          value: role,
        }))}
      />
    </Modal>
  );
}
