import React from "react";
import Logo from "../../../../../assets/images/logo.png";
import Heading from "../../../../../components/Typography/Heading";
import Paragraph from "../../../../../components/Typography/Paragraph";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import BootstrapTextField from "../../../../../components/TextFields/TextField";
import SubmitBtn from "../../../../../components/Buttons";
import FileUpload from "../../../../../components/FileUploader";
import FilePreview from "../../../../../components/FileView";
import { useNavigate } from "react-router-dom";
import { useVerificationRequest_CreateVerificationRequestMutation } from "./mutations";
import { VerificationRequestAcceptStatus } from "../../../../../constants/storage/constant";
import { userStore } from "../../../../../store/user";

const Support = React.memo(() => {
  const navigate = useNavigate();
  const [govtId, setGovtId] = React.useState<{ file: File | null, url: string }>({ file: null, url: "" });
  const [address, setAddress] = React.useState<{ file: File | null, url: string }>({ file: null, url: "" });
  const [proffAddress, setProffAddress] = React.useState<string>("");

  const { createVerificationRequest, loading } =
    useVerificationRequest_CreateVerificationRequestMutation();

  const handleSkip = () => {
    const isLoggedIn = userStore.store.authentication.status === "loggedIn";
    if (isLoggedIn) {
      navigate("/specter/home");
    } else {
      navigate("/auth/signin");
    }
  };

  const handleVerify = async () => {
    await createVerificationRequest({
      input: {
        verificationRequestAcceptStatus:
          VerificationRequestAcceptStatus.Pending,
        proofOfAddress: proffAddress,
        governmentIssuePhotoId: govtId?.url,
        otheFiles: [address?.url],
      },
    });
  };

  return (
    <div className="py-6 px-5 w-full md:flex items-center justify-center">
      <div className="p-8 shadow-cardShadow rounded-lg bg-white w-full md:w-[450px] min-h-[400px]">
        <div className="flex items-center justify-center flex-col gap-3">
          <img height={96} width={96} src={Logo} alt="Specter" />
          <Heading className="md:text-[20px] font-bold text-[20px]">
            Contact support
          </Heading>
        </div>
        <Paragraph className="opacity-60 text-center text-sm mt-3">
          In order to reset your password, please send us a valid ID card and
          your email.
        </Paragraph>

        {!!govtId?.file
          ? <FilePreview
            file={govtId}
            onDelete={() => { setGovtId({ file: null, url: "" }); }}
            onShowFile={() => { }}
            className="my-5"
          />
          : <FileUpload
            className="my-5"
            label="Upload government issued photo ID"
            onFileUpload={(files: File[], url: string) => {
              setGovtId({ file: files[0], url });
            }}
          />}

        {!!address?.file
          ? <FilePreview
            file={address}
            onDelete={() => {
              setAddress({ file: null, url: "" });
            }}
            onShowFile={() => { }}
            className="my-5"
          />
          : <FileUpload
            className="my-5"
            label=" Upload proof address"
            onFileUpload={(files: File[], url: string) => {
              setAddress({ file: files[0], url });
            }}
          />}

        <FormControl variant="filled" fullWidth>
          <InputLabel required htmlFor="proff_address" id="proff_address">
            Proof of address
          </InputLabel>
          <BootstrapTextField
            type="text"
            placeholder="Enter your proff address"
            fullWidth
            id="proff_address"
            value={proffAddress}
            onChange={(e) => setProffAddress(e.target.value)}
          />
          <FormHelperText></FormHelperText>
        </FormControl>

        <div className="flex items-center justify-between mt-5 gap-5">
          <SubmitBtn
            fullWidth
            cta="Submit"
            color="primary"
            varient="contained"
            isLoading={loading}
            handlclick={handleVerify}
          />
          <SubmitBtn
            handlclick={handleSkip}
            fullWidth
            cta="Skip"
            color="info"
            varient="outlined"
          />
        </div>
      </div>
    </div>
  );
});

export default Support;
