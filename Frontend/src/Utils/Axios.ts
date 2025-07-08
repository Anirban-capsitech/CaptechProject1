import axios from "axios";
const BACKEND_URL = "https://localhost:7185";
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const refreshAccessToken = async () => {
  try {
    const refreshToken = sessionStorage.getItem("RToken");
    const aToken = sessionStorage.getItem("AToken");
    const response = await axios.post(
      `${BACKEND_URL}/RefreshToken?accessToken=${aToken}&refreshToken=${refreshToken}`
    );
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    sessionStorage.setItem("AToken", accessToken);
    sessionStorage.setItem("RToken", newRefreshToken);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    sessionStorage.removeItem("AToken");
    sessionStorage.removeItem("RToken");
    window.location.href = "/login";
    return null;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("AToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;