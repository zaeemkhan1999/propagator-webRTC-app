import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  bgcolor: "#f9f9f9",
  borderRadius: 2,
};

type Props = {
  open: boolean;
  setOpen?: Function;
  onClose?: Function;
  children: React.ReactNode;
  isStatic?: boolean;
};

export default function BasicModal({
  open,
  setOpen,
  onClose,
  children,
  isStatic,
}: Props) {

  const handleClose = () => {
    onClose?.();
    setOpen?.(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slotProps={
          {
            backdrop: {
              onClick: isStatic
                ? (e) => e.stopPropagation()
                : undefined
            }
          } // Prevent closing the modal by clicking outside
        }
        disableEscapeKeyDown={isStatic}
      >
        <Box sx={style}>{children}</Box>
      </Modal>
    </div>
  );
}
