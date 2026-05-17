import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectUsers,
  selectUsersStatus,
  selectDeletingId,
  selectUserError,
  selectUsersMeta,
} from "../../store/users/selectors";
import { fetchUsersThunk } from "../../store/users/thunks/fetchUsersThunk";
import { clearError } from "../../store/users/slices/usersSlice";
import { usePermissions } from "../../helpers/usePermissions";
import Error from "../../components/Error";
import type { UserFilters } from "../../types/typesUsers";
import { Roles } from "../../types/typesUsers";
import { debounce } from "lodash";

import type { TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import type { User } from "../../types/typesUsers";

import UsersFilters from "./components/UsersFilters";
import UsersTable from "./components/UsersTable";
import EditRolesModal from "./components/EditRolesModal";
import { useUsersActions } from "./hooks/useUsersActions";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { isAdmin, canModerate } = usePermissions();

  const users = useAppSelector(selectUsers);
  const status = useAppSelector(selectUsersStatus);
  const deletingId = useAppSelector(selectDeletingId);
  const error = useAppSelector(selectUserError);
  const meta = useAppSelector(selectUsersMeta);
  const isLoading = status === "loading";

  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
    search: "",
  });

  const [editingRoles, setEditingRoles] = useState<{
    id: number;
    roles: Roles[];
  } | null>(null);

  const { handleToggleBlock, handleSaveRoles, getMenuItems } = useUsersActions(
    isAdmin,
    canModerate,
    setEditingRoles,
  );

  useEffect(() => {
    dispatch(fetchUsersThunk(filters));
  }, [filters, dispatch]);

  const handleSearchDebounced = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 500),
    [],
  );

  useEffect(() => {
    return () => handleSearchDebounced.cancel();
  }, [handleSearchDebounced]);

  const handleBlockedFilterChange = (key: string) => {
    setFilters((prev) => {
      const next = { ...prev, page: 1 };
      if (key === "all") {
        const { isBlocked: _, ...rest } = next;
        return rest;
      }
      return { ...next, isBlocked: key === "blocked" };
    });
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    sorter: SorterResult<User>,
  ) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: (sorter?.field as string) ?? prev.sortBy,

      sortOrder: sorter?.order === "ascend" ? "asc" : "desc",
    }));
  };

  if (error) {
    return <Error message={error} onClose={() => dispatch(clearError())} />;
  }

  return (
    <div>
      <h2>Пользователи</h2>

      <UsersFilters
        filters={filters}
        onSearch={handleSearchDebounced}
        onBlockedFilterChange={handleBlockedFilterChange}
      />

      <UsersTable
        users={users}
        filters={filters}
        isLoading={isLoading}
        isAdmin={isAdmin}
        deletingId={deletingId}
        totalAmount={meta?.totalAmount ?? 0}
        onTableChange={handleTableChange}
        onToggleBlock={handleToggleBlock}
        onEditRoles={(user) =>
          setEditingRoles({ id: user.id, roles: [...user.roles] })
        }
        getMenuItems={getMenuItems}
      />

      <EditRolesModal
        editingRoles={editingRoles}
        onClose={() => setEditingRoles(null)}
        onSave={handleSaveRoles}
        onRolesChange={(roles) =>
          setEditingRoles((prev) => (prev ? { ...prev, roles } : null))
        }
      />
    </div>
  );
}
