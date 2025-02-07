import axios from "axios";

const API_BASE_URL = "http://172.25.144.1:5000"; // Ensure the correct URL
  
export const fetchBackendMessage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api`, {
      timeout: 10000, // 10 seconds timeout (increase if necessary)
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
