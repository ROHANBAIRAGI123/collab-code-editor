"use client";

import axios from "axios";

const getFile = async (id: string) => {
  const response = await axios.get(`/api/file/get/:id`, { params: { id: id } });
  return response.data;
};

const deleteFile = async (id: string) => {
  const response = await axios.delete(`/api/file/delete/:id`, {
    params: { id: id },
  });
  return response.data;
};

const renameFile = async (id: string, newName: string) => {
  const response = await axios.put(`/api/file/rename/:id`, {
    id: id,
    newName: newName,
  });
  return response.data;
};

const saveFile = async (id: string, FileContent: string) => {
  const response = await axios.put(`/api/file/save/:id`, {
    id: id,
    FileContent: FileContent,
  });
  return response.data;
};

const createFile = async (
  roomId: string,
  label: string,
  fileType: string | undefined,
  parentId: string | undefined
) => {
  try {
    const response = await axios.post(`http://localhost:8001/api/file/create`, {
      id: Date.now().toString(),
      roomId: "123",
      label: label,
      fileType: fileType,
      parentId: parentId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { getFile, deleteFile, renameFile, saveFile, createFile };
