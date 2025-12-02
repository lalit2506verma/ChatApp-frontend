import { MyAxios } from "../config/AxiosHelper";

export const createRoomService = async (roomData) => {
  console.log(roomData);

  const response = await MyAxios.post(`/api/v1/rooms/`, roomData, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
};

export const joinRoomService = async (roomId) => {
  console.log(roomId);

  const response = await MyAxios.get(`/api/v1/rooms/${roomId}`);
 
  return response.data;
};

export const getMessages = async (roomId, size = 50, page = 0) => {
  const response = await MyAxios.get(
    `/api/v1/rooms/${roomId}/messages?page=${page}&size=${size}`
  );
  return response.data;
};
