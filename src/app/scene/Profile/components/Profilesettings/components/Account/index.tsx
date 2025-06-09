import {
  Box,
  Typography,
  Switch,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import {
  IconPhoto as IconImage,
  IconMessageCircle2 as IconMessageSquareText,
  IconPlus
} from "@tabler/icons-react";
import SubmitBtn from "../../../../../../../components/Buttons";
import Lottie from "lottie-react";
import NoData from '../NoData.json'
import { useSwitchToProfessional } from "./mutations/switchAccountToProfessional";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import { useGetCurrentUser } from "@/app/services/query/user.query";
import { enqueueSnackbar } from "notistack";

const Account = () => {
  const user = useSnapshot(userStore.store).user;

  const [Private, setPrivate] = useState(false);
  const [Professional, setProfessional] = useState(user?.professionalAccount || false);

  // State for dialogs
  const [openPrivateDialog, setOpenPrivateDialog] = useState(false);
  const [openProfessionalDialog, setOpenProfessionalDialog] = useState(false);

  const handleChange = (type: string) => {
    switch (type) {
      case "Private":
        setPrivate(!Private);
        setOpenPrivateDialog(true);
        break;
      case "Professional":
        if (!Professional) {
          setOpenProfessionalDialog(true);
        } else {
          enqueueSnackbar("You Cannot Go Back to Normal Account", { autoHideDuration: 3000, variant: "warning" });
        }
        break;
      default:
        break;
    }
  };

  const handleClosePrivateDialog = () => {
    setOpenPrivateDialog(false);
  };

  const handleCloseProfessionalDialog = () => {
    setOpenProfessionalDialog(false);
  };

  const { switchToProfessional, loading: switchingToProfessional } = useSwitchToProfessional();
  const { fetchCurrentUser } = useGetCurrentUser();

  const handleSwitchProfessional = () => {
    !switchingToProfessional && switchToProfessional(() => {
      fetchCurrentUser();
      setProfessional(true);
    });
  }

  return (
    <Box className="w-full">
      <h4 className="my-3 ms-4">Notifications</h4>
      <Box className="flex justify-between items-center py-2">
        <Typography>Private account</Typography>
        <Switch
          color="success"
          checked={Private}
          onChange={() => handleChange("Private")}
        />
      </Box>

      <Box className="flex justify-between items-center py-2">
        <Typography>Professional account</Typography>
        <Switch
          color="success"
          checked={Professional}
          onChange={() => handleChange("Professional")}
        />
      </Box>

      {/* Dialog for Private account */}
      <Dialog
        open={openPrivateDialog}
        onClose={handleClosePrivateDialog}
        classes={{ paper: "w-[500px] p-5 text-center rounded-lg pb-14" }}
      >
        <IconButton
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          onClick={handleClosePrivateDialog}
        >
          <IconPlus className="rotate-45" />
        </IconButton>
        <DialogTitle className="text-lg font-bold text-gray-800 mt-5">
          Switch to private account?
        </DialogTitle>
        <DialogContent>
          {/* Icon and text aligned in a row */}
          <div className="flex items-center justify-center mt-4">
            <IconImage className="mr-2 text-black h-12 w-12" />
            <DialogContentText className="text-black">
              Only your followers will be able to see your photos and videos.
            </DialogContentText>
          </div>

          {/* Icon and text aligned in a row */}
          <div className="flex items-center justify-center mt-6 text-gray-600">
            <IconMessageSquareText className="mr-2 text-black h-12 w-12" />
            <DialogContentText className="text-black">
              This won’t change who can tag, @mention or message you.
            </DialogContentText>
          </div>
        </DialogContent>
        <DialogActions className="flex justify-center mt-6">
          <SubmitBtn
            cta={"Switch to Private"}
            varient="contained"
            color="error"
            size="large"
            fullWidth
            classname="font-medium transition-colors"
            style={{
              backgroundColor: "rgb(158, 28, 28)",
              padding: "0.5rem 0",
              borderRadius: "0.5rem",
              color: "white",
              border: "none",
              outline: "none",
              height: 46,
            }}
            hoverColor="rgb(119, 21, 21)"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={openProfessionalDialog}
        onClose={handleCloseProfessionalDialog}
        classes={{
          paper: "w-[400px] h-[650px]p-5 text-center rounded-lg py-12",
        }}
      >
        <IconButton
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          onClick={handleCloseProfessionalDialog}
        >
          <IconPlus className="rotate-45" />
        </IconButton>
        <Lottie
          loop={false}
          animationData={NoData}
          style={{ width: "200px", height: "200px", margin: "0 auto" }}
        />
        <DialogTitle className="text-lg font-bold text-gray-800 mt-12">
          You Can Promote Your Posts
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="mt-4 text-black">
            Are you sure you want to switch on professional account?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="flex flex-col justify-center mt-6">
          <div className="flex flex-col items-center gap-3 w-[85%]">
            <SubmitBtn
              cta={"Switch on"}
              handlclick={handleSwitchProfessional}
              varient="contained"
              color="error"
              size="large"
              fullWidth
              classname="font-medium transition-colors  "
              style={{
                backgroundColor: "rgb(158, 28, 28)",
                padding: "0.5rem 0",
                borderRadius: "1rem",
                color: "white",
                border: "none",
                outline: "none",
                height: 46,
              }}
              // onClick={handleCloseProfessionalDialog}
              hoverColor="rgb(119, 21, 21)"
            />

            <SubmitBtn
              cta="Cancel"
              color="primary"
              varient="outlined"
              needBorder
              size="large"
              fullWidth
              classname="p-5 text-red-700 bg-white "
              handlclick={handleCloseProfessionalDialog}
              hoverColor="white"
              style={{
                borderRadius: "1rem",
                borderColor: "red",
                height: 46,
                padding: "0.5rem 0",
                color: "red",
              }}
            />
          </div>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Account;
