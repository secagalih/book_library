import { useNavigate } from "react-router";
import { AuthApi } from "~/api/api";
import { useAuth } from "~/contexts/auth";

export const useLogout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  const logout = async () => {
    try {
      await AuthApi.logout();
     
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }
  
  return { logout };
}