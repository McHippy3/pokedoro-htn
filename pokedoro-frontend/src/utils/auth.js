import axios from "axios";
import cookie from "react-cookies";

export const currentUser = () => {
  return cookie.load("userId");
}

export const isloggedIn = () => {
  const userId = cookie.load("userId");
  if (userId === undefined || userId === "") {
    return false;
  } else {
    return true;
  }
};

export const login = async (cred) => {
    const res = await axios.post(
      "http://167.71.101.168:8000/log_in",
      cred
    );
    console.log(res.data)
    if (res.data.status === "succeeded"){
      cookie.save("userId", res.data.user_id, { path: window.location.origin });
      return { status: true, data: res.cred };
    } else {
      return {status: false, data: null};
    }
};

export const logout = async () => {
  cookie.remove("userId");

}