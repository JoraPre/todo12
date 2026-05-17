import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD
import type { RootState, AppDispatch } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
=======
import type { RootState, AppDispatch } from "./authStore";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
>>>>>>> origin/develop
