import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, notification } from "antd";
import { useAppDispatch } from "../../../store/hooks";
import { deleteUserThunk } from "../../../store/users/thunks/deleteUserThunk";
import {
  blockUserThunk,
  unblockUserThunk,
} from "../../../store/users/thunks/isBlockedUserThunk";
import { updateUserRightsThunk } from "../../../store/users/thunks/updateUserRightsThunk";
import { getErrorMessage } from "../../../helpers/errorMessage";
import type { User } from "../../../types/typesUsers";
import { Roles } from "../../../types/typesUsers";

export function useUsersActions(
  isAdmin: boolean,
  canModerate: boolean,
  setEditingRoles: React.Dispatch<
    React.SetStateAction<{ id: number; roles: Roles[] } | null>
  >,
) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpenProfile = useCallback(
    (userId: number) => navigate(`/users/${userId}`),
    [navigate],
  );

  const handleDelete = useCallback(
    (user: User) => {
      Modal.confirm({
        title: "Удалить профиль",
        content: `Удалить пользователя ${user.username}?`,
        okText: "Да",
        cancelText: "Нет",
        okType: "danger",
        onOk: async () => {
          try {
            await dispatch(deleteUserThunk(user.id)).unwrap();
            notification.success({ message: "Пользователь удалён" });
          } catch (err) {
            notification.error({
              message: "Ошибка",
              description:
                getErrorMessage(err) || "Ошибка при удалении пользователя",
            });
          }
        },
      });
    },
    [dispatch],
  );

  const handleToggleBlock = useCallback(
    (user: User) => {
      Modal.confirm({
        title: user.isBlocked ? "Разблокировать?" : "Заблокировать?",
        content: user.username,
        onOk: async () => {
          try {
            if (user.isBlocked) {
              await dispatch(unblockUserThunk({ id: user.id })).unwrap();
            } else {
              await dispatch(blockUserThunk({ id: user.id })).unwrap();
            }
            notification.success({ message: "Успешно" });
          } catch (err) {
            notification.error({
              message: "Ошибка",
              description:
                getErrorMessage(err) || "Ошибка при смене статуса блокировки",
            });
          }
        },
      });
    },
    [dispatch],
  );

  const handleSaveRoles = useCallback(
    async (id: number, roles: Roles[]) => {
      try {
        await dispatch(updateUserRightsThunk({ id, data: { roles } })).unwrap();
        notification.success({ message: "Роли обновлены" });
        setEditingRoles(null);
      } catch (err) {
        notification.error({
          message: "Ошибка",
          description: getErrorMessage(err) || "Ошибка при смене ролей",
        });
      }
    },
    [dispatch, setEditingRoles],
  );

  const getMenuItems = useCallback(
    (user: User) => [
      ...(canModerate
        ? [
            {
              key: "profile",
              label: "Перейти к профилю",
              onClick: () => handleOpenProfile(user.id),
            },
          ]
        : []),

      ...(isAdmin
        ? [
            {
              key: "delete",
              label: "Удалить профиль",
              danger: true,
              onClick: () => handleDelete(user),
            },
          ]
        : []),
    ],
    [canModerate, isAdmin, handleOpenProfile, handleDelete],
  );

  return {
    handleOpenProfile,
    handleDelete,
    handleToggleBlock,
    handleSaveRoles,
    getMenuItems,
  };
}
