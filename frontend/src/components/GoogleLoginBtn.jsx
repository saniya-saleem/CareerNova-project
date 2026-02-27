import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleLoginBtn() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/google/",
        {
          access_token: credentialResponse.credential, 
        }
      );

      console.log(res.data);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // redirect only
      navigate("/");

    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Google login failed")}
    />
  );
}

