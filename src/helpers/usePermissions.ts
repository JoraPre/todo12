import { useAppSelector } from "../store/hooks";
import {
  selectCanModerate,
  selectIsAdmin,
  selectIsModerator,
  selectUserRoles,
} from "../store/auth/selectors";
import { Roles } from "../types/typesUsers";

export function usePermissions() {
  const isAdmin = useAppSelector(selectIsAdmin);
  const isModerator = useAppSelector(selectIsModerator);
  const canModerate = useAppSelector(selectCanModerate);
  const roles = useAppSelector(selectUserRoles);

  return {
    isAdmin,
    isModerator,
    canModerate,

    hasRole: (role: Roles) => roles.includes(role),
  };
}
