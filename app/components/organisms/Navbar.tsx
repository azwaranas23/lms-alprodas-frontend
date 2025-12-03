import { useEffect, useState } from "react";
import { authService } from "~/services/auth.service";
import { GuestNavbar } from "./GuestNavbar";
import { UserNavbar } from "./UserNavbar";

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return isAuthenticated ? <UserNavbar /> : <GuestNavbar />;
}
