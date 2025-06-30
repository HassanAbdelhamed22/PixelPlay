import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { fetchUser } from "../app/features/loginSlice";
import CookieService from "../services/CookieService";

const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: loginData, loading } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    const token = CookieService.get("jwt");
    if (token && !loginData && !loading) {
      dispatch(fetchUser());
    }
  }, [dispatch, loginData, loading]);

  return null;
};

export default AuthInitializer;