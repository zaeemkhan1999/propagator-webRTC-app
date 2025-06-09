import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export default function useUploadInChunk(chunkSize = 5) { // 5 MB 
    const chunkSizeBytes = 1048576 * chunkSize;
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [hasCompleted, setHasCompleted] = useState(false);

    const uploadInChunk = async (
        file: File,
        callback: (chunk: Blob, index: number, totalChunks: number) => Promise<void>
    ) => {
        if (!file) {
            enqueueSnackbar("File is required for upload", { variant: "error", autoHideDuration: 3000 })
            return;
        };

        setIsUploading(true);
        setProgress(0);

        const totalChunks = Math.ceil(file.size / chunkSizeBytes);
        let start = 0;
        let chunkIndex = 0;

        try {
            while (start < file.size) {
                const chunk = file.slice(start, start + chunkSizeBytes);
                await callback(chunk, chunkIndex + 1, totalChunks);
                start += chunkSizeBytes;
                chunkIndex++;
                setProgress(Math.round((chunkIndex / totalChunks) * 100));
            };

            setHasCompleted(true);
            setIsUploading(false);
            setProgress(null);
        } catch (error) {
            enqueueSnackbar('Something went wrong', { variant: "error", autoHideDuration: 3000 });
            setHasCompleted(false);
            setIsUploading(false);
            setProgress(null);
            return Promise.reject(error);
        };
    };

    return { uploadInChunk, isUploading, progress, hasCompleted };
};
