import { IconPhotoUp } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection, Accept } from "react-dropzone";
import Title from "../Typography/Title";
import useUploadToAws from "../../hooks/useUploadToAws";

interface FileUploadProps {
  accept?: Accept;
  onFileUpload: (files: File[], url: string | any) => void;
  label?: string;
  className?: string;
  customUI?: any;
  icon?: any;
  setProgress?: any;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  onFileUpload,
  label,
  className,
  customUI,
  icon,
  setProgress
}) => {
  const { progress, uploadToAws } = useUploadToAws();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        console.warn("Some files were rejected:", fileRejections);
        return;
      }

      if (acceptedFiles.length > 0) {
        try {
          setUploadError(null);
          const url = await uploadToAws(acceptedFiles[0]);
          onFileUpload(acceptedFiles, url);
        } catch (error) {
          setUploadError("File upload failed");
          console.error("Upload error:", error);
        }
      }
    },
    [onFileUpload, uploadToAws]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept });

  useEffect(() => {
    if (progress && setProgress) {
      setProgress(progress)
    }
    if (progress === null) {
      setProgress?.(0)
    }
  }, [progress, setProgress])

  return (
    <div
      {...getRootProps()}
      className={`${!!customUI ? "border-none h-auto" : "border-[1px] h-[165px]"
        } border-dashed border-blue2 rounded-lg py-2 flex items-center justify-center ${className}`}
    >
      <input disabled={!!progress && progress < 100} {...getInputProps()} />

      {!!customUI
        ? customUI
        : <div className="flex flex-col items-center justify-center text-center">
          {isDragActive
            ? <Title className="text-base md:text-base">
              Drop the files here...
            </Title>
            : (!isDragActive && !progress)
              ? <>{icon ? icon : <IconPhotoUp />}
                <Title className="text-base md:text-base">
                  {label ?? "Drag 'n' drop some files here, or click to select files"}
                </Title></>
              : null}

          {/* Show Upload Progress */}
          {progress && (
            <div className="w-full mt-4">
              <div className="relative pt-1 w-full">
                <div className="overflow-hidden h-2 mb-2 w-[150px] text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col transition-all duration-200 ease-in-out text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {progress}% uploaded
                </span>
              </div>
            </div>)}

          {/* Show Error */}
          {uploadError && (<div className="text-red-600 mt-2">{uploadError}</div>)}
        </div >}
    </div >
  );
};

export default FileUpload;
