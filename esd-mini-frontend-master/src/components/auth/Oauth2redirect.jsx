import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Redirect() {
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate, token]);

  return <p>Redirecting...</p>;
}
