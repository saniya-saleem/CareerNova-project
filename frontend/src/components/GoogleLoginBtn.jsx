import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleLoginBtn() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/google/",
        {
          access_token: credentialResponse.credential, 
        },
        { withCredentials: true }
      );

      console.log(res.data);
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

