import { useState } from "react";
import api from "../contexts/api";
import axios from "axios";

export default function useFileUpload() {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [fileTags, setFileTags] = useState({});
  const [updateProgress, setUpdateProgress] = useState({});
  const [selectedFileIndices, setSelectedFileIndices] = useState([]);

  const updateUploadProgress = (index, percent) => {
    setUpdateProgress((prev) => ({
      ...prev,
      [index]: percent,
    }));
  };

  const getPresignedUrl = async (filename) => {
    try {
      const response = await api.post(
        `/files/presigned-upload?filename=${encodeURIComponent(filename)}`,
        {},
        {}
      );

      return response.data.data.presignedUrl;
    } catch (error) {
      console.error("Error fetching presigned URL:", error);
      return null;
    }
  };

  const uploadFileToS3 = async (file, presignedUrl, index) => {
    try {
      const response = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          updateUploadProgress(index, percent);
        },
        withCredentials: true,
      });

      return response.status === 200;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      return false;
    }
  };

  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
    });
  };

  const completeUpload = async (fileMeta) => {
    try {
      const response = await api.post("/files/upload-complete", fileMeta, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error completing upload:", error);
      return null;
    }
  };

  // 파일 선택 시 처리
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const updatedPreviewUrls = [];
    const updatedTags = {};

    // 파일을 서버에 업로드하고 URL을 수신
    for (const [index, file] of selectedFiles.entries()) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const presignedUrl = await getPresignedUrl(file.name);
        if (!presignedUrl) {
          console.error("Failed to get presigned URL");
          continue;
        }
        const uploadSuccess = await uploadFileToS3(file, presignedUrl, index);
        if (!uploadSuccess) {
          console.error("Failed to upload file to S3");
          continue;
        }

        const { width, height } = await getImageDimensions(file);

        const fileMeta = {
          originalFilename: file.name,
          presignedUrl: presignedUrl.split("?")[0],
          width,
          height,
          size: file.size,
        };
        const uploadResponse = await completeUpload(fileMeta);
        if (!uploadResponse) {
          console.error("Failed to complete file upload");
          continue;
        }

        const fileUrl = `${process.env.REACT_APP_FILE_BASEURL}${uploadResponse.fileUrl}`;
        updatedPreviewUrls.push(fileUrl);

        // 초기 태그 설정
        updatedTags[index] = [];
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }

    setPreviewUrls(updatedPreviewUrls);
    setFileTags(updatedTags);
  };

  const removeImage = (removeIndex) => {
    const updatedFiles = files.filter((_, index) => index !== removeIndex);
    const updatedPreviewUrls = previewUrls.filter(
      (_, index) => index !== removeIndex
    );

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviewUrls);

    const updatedTags = { ...fileTags };
    delete updatedTags[removeIndex];
    setFileTags(updatedTags);

    setSelectedFileIndices((prevIndices) =>
      prevIndices.filter((i) => i !== removeIndex)
    );
  };

  return {
    files,
    previewUrls,
    fileTags,
    updateProgress,
    handleFileChange,
    removeImage,
    setFileTags,
    selectedFileIndices,
    setSelectedFileIndices,
  };
}
