import config from "../config/index.dev";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { isVideo, randomUuidV4 } from "../app/utility/misc.helpers";
import { extractFileNameAndFormat } from "@/helper";

export default function useUploadToAws() {
  const { enqueueSnackbar } = useSnackbar();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const chunkSize = 1048576 * 6;
  const uploadToAws = async (file: File | null): Promise<string> => {
    if (file) {
      try {
        setIsUploading(true);
        setProgress(1);
        const fileData = extractFileNameAndFormat(file?.name);
        let name;
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:T.]/g, ''); // YYYYMMDDHHMMSS

        if (fileData?.fileFormat) {
          name = `${timestamp}-${randomUuidV4()}.${fileData?.fileFormat}`;
        } else {
          if (isVideo(file) || file.type === "video/mp4") {
            name = `${timestamp}-${randomUuidV4()}.mp4`;
          } else {
            name = `${timestamp}-${randomUuidV4()}.webp`;
          }
        }

        const _totalCount =
          file.size % chunkSize == 0
            ? file.size / chunkSize
            : Math.floor(file.size / chunkSize) + 1;

        let start = 0;
        const chunksString = [];
        while (start < file.size) {
          chunksString.push(file.slice(start, start + chunkSize));
          start += chunkSize;
        }

        if (chunksString.length > 0) {
          const presignedUrls = await getPresignedUrls(
            name,
            [...Array(chunksString.length)].map((_, index) => index + 1),
          );
          const uploaded: any[] = [];
          if (presignedUrls.length) {
            for (let i = 0; i < chunksString.length; i++) {
              const data = await uploadChunk(
                chunksString[i],
                presignedUrls[i],
                name,
              );
              uploaded.push(data);
              setProgress(Math.round(((i + 1) / _totalCount) * 100));
            }
            const completeUpload = `
    <CompleteMultipartUpload>
      ${uploaded
                .map(
                  (item: any) => `
        <Part>
          <PartNumber>${item?.partNumber}</PartNumber>
          <ETag>${item?.etag}</ETag>
        </Part>
      `,
                )
                .join("")}
    </CompleteMultipartUpload>
  `;
            try {
              const response = await fetch(uploaded?.[0].completeUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/xml",
                },
                body: completeUpload,
              });

              if (!response.ok) {
                const errorText = await response.text();
                console.error("Complete Multipart Upload failed:", errorText);
                throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const result = await response.json();
              console.log("Upload completed successfully:", result);
            } catch (error) {
              console.error("Error:", error);
            }
          }
        }

        async function uploadChunk(chunk: any, presignedUrl: any, _name: any) {
          return new Promise(function (resolve) {
            const formData = new FormData();
            formData.append("file", chunk);

            const splitedUrl = presignedUrl?.split?.("?");
            const urlParams = new URLSearchParams(splitedUrl[1]);
            const uploadId: string = urlParams.get("uploadId") as string;
            const partNumber: string = urlParams.get("partNumber") as string;

            // const configheaders = {
            //   headers: {
            //     "Content-Type": "application/octet-stream",
            //   },
            // };

            fetch(presignedUrl, {
              method: "PUT",
              body: chunk,
              headers: {
                "Content-Type": file?.type!,
              },
            })
              .then(function (response) {
                resolve({
                  etag: response.headers.get("Etag")?.replace(/"/g, ""),
                  uploadId,
                  partNumber,
                  completeUrl: splitedUrl[0] + "?uploadId=" + uploadId,
                });
              })
              .catch(function (error: any) { });
          });
        }

        return config.AWS_BUCKET_URL + name;
      } catch (error: any) {
        enqueueSnackbar(String(error));
        throw new Error(String(error));
      } finally {
        setProgress(null);
        setIsUploading(false);
      }
    } else {
      throw new Error("File is required for upload");
    }
  };

  const getPresignedUrls = async (filename: string, chunks: number[]) => {
    const response = await fetch(config.UPLOAD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Objectkey: filename.replace(/\s+/g, ''),
        ChunkNumbers: chunks,
      }),
    });

    return await response.json();
  };

  return { uploadToAws, isUploading, progress };
}