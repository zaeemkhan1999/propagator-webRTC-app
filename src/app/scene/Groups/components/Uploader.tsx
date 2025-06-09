import { useState, useCallback, memo, FC, useRef, ChangeEvent, SyntheticEvent } from 'react';
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Box, IconButton, Typography, Button, Modal, CircularProgress } from '@mui/material';
import {
  IconUpload,
  IconX,
  IconEye,
  IconTrash
} from "@tabler/icons-react";
import useUploadToAws from '@/hooks/useUploadToAws';

interface UploaderProps {
  onFileChange: (fileUrl?: string | null) => void;
  url?: string;
  hintText?: string;
  elementId?: string;
  size?: string;
  isProfile?: boolean
}

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const outputWidth = crop.width * scaleX;
  const outputHeight = crop.height * scaleY;

  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      0.6
    );
  });
}

const Uploader: FC<UploaderProps> = memo(({ onFileChange, hintText, elementId, size, isProfile }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadToAws, isUploading } = useUploadToAws();

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result?.toString() || null);
        setIsModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setSrc(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewImage = () => {
    if (src) {
      window.open(src);
    }
  };

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        isProfile ? 1 : 4 / 3,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const handleCropCancel = () => {
    setIsModalOpen(false);
    if (!selectedFile) {
      handleDelete();
    }
  };

  const handleCropApply = useCallback(async () => {
    if (completedCrop && imgRef.current && src) {
      try {
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
        const croppedFile = new File([croppedImageBlob], selectedFile?.name || 'cropped.jpg', { type: 'image/jpeg' });
        const croppedUrl = URL.createObjectURL(croppedImageBlob);
        setSelectedFile(croppedFile);
        setSrc(croppedUrl);
        uploadToAws(croppedFile).then((url) => {
          onFileChange(url);
        });
      } catch (e) {
        console.error('Error applying crop:', e);
      }
    }
    setIsModalOpen(false);
  }, [completedCrop, src, selectedFile?.name, onFileChange]);

  return (
    <Box
      sx={{
        width: '100%',
        border: '1px dashed rgb(149, 153, 179)',
        padding: '24px',
        borderRadius: '10px',
        textAlign: 'center',
        position: 'relative',
        maxWidth: '100%',
        margin: 'auto',
        height: size === "small" ? "100px" : "165px"
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        id={elementId ?? "file-input"}
        ref={fileInputRef}
      />
      {!selectedFile ? (
        <label htmlFor={elementId ?? "file-input"} style={{ cursor: 'pointer' }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <IconUpload size={size === "small" ? 20 : 48} color="gray" />
            <Typography variant="body2" color="textSecondary" mt={1}>
              {hintText ?? 'Upload Cover Image'}
            </Typography>
          </Box>
        </label>
      ) : (
        <>
          {isUploading &&
            <CircularProgress size={25} className='text-gray-500 absolute left-[3rem] top-[4.3rem] z-50' />}

          <Box
            sx={{
              backgroundColor: '#f9f9f9',
              border: '2px dashed #d1d5db',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: "100%"
            }}
          >
            <img
              src={src || ''}
              alt="Selected file"
              style={{
                marginLeft: "10px",
                height: '50px',
                width: '50px',
                objectFit: 'cover',
                borderRadius: '5px',
                position: "relative"
              }}
            />
            <div>
              <IconButton color="primary" onClick={handleViewImage}>
                <IconEye />
              </IconButton>
              <IconButton color="error" onClick={handleDelete}>
                <IconTrash />
              </IconButton>
            </div>
          </Box>
        </>)}

      <Modal
        open={isModalOpen}
        onClose={handleCropCancel}
        aria-labelledby="crop-modal-title"
        aria-describedby="crop-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <IconButton onClick={handleCropCancel} sx={{ position: 'absolute', top: 10, right: 10 }}>
            <IconX />
          </IconButton>
          <Typography id="crop-modal-title" variant="h6" component="h2" mb={2} textAlign="center">
            Crop Image
          </Typography>
          <ReactCrop
            circularCrop={isProfile}
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={isProfile ? 1 : 4 / 3}
          >
            <img
              ref={imgRef}
              src={src || ''}
              alt="Crop me"
              style={{ maxWidth: '100%', height: 'auto' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={handleCropApply}
              sx={{ width: '100%', backgroundColor: 'red', '&:hover': { backgroundColor: '#c62828' } }}
            >
              Apply Crop
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
});

export default Uploader;
