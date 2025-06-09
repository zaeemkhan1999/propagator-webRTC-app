import { memo, useState } from "react";
import Logo from "../../../../../assets/images/logo.png";
import Title from "../../../../../components/Typography/Title";
import BootstrapTextField from "../../../../../components/TextFields/TextField";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import SubmitBtn from "../../../../../components/Buttons";
import BasicSelect from "../../../../../components/Selections/Select";
import { useNavigate } from "react-router-dom";
import EyeIcon from "@/assets/icons/Eye";
import IconEyeOff from "@/assets/icons/EyeOff";

const ForgotPassword = memo(() => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [question1, setQuestion1] = useState<string>("");
  const [question2, setQuestion2] = useState<string>("");

  const handleBack = () => {
    navigate("/auth/signin");
  }

  return (
    <div className="w-full p-5 flex items-center justify-center">
      <div
        style={{ height: "calc(100dvh - 100px)" }}
        className="px-8 py-4 shadow-cardShadow overflow-y-auto rounded-lg bg-white w-full md:w-[450px] min-h-[400px]"
      >
        <div className="flex flex-col justify-center items-center border-b-[1px] pb-3  border-[#F5F5F5]">
          <img height={40} width={70} src={Logo} alt="Logo" />
          <Title className="font-extralight mt-2">Forgot password</Title>
        </div>
        <div className="pt-8 flex flex-col gap-4">
          <FormControl variant="standard" fullWidth>
            <InputLabel required>Username</InputLabel>
            <BootstrapTextField
              type="text"
              placeholder="Enter your Username"
              fullWidth
            />
            <FormHelperText></FormHelperText>
          </FormControl>
          <div>
            <BasicSelect
              label="Question1:"
              options={[]}
              value={question1}
              setValue={setQuestion1}
            />
            <BootstrapTextField
              type="text"
              placeholder="Enter your answer"
              fullWidth
              className="mt-4"
            />
          </div>
          <div>
            <BasicSelect
              label="Question2:"
              options={[]}
              value={question2}
              setValue={setQuestion2}
            />
            <BootstrapTextField
              type="text"
              placeholder="Enter your answer"
              fullWidth
              className="mt-4"
            />
          </div>

          <FormControl variant="standard" fullWidth>
            <InputLabel required>New Password</InputLabel>
            <BootstrapTextField
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              fullWidth
              endAdornment={
                showPassword
                  ? <IconEyeOff
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                  : <EyeIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />}
            />
            <FormHelperText></FormHelperText>
          </FormControl>
          <FormControl variant="standard" fullWidth>
            <InputLabel required>Confirm Password</InputLabel>
            <BootstrapTextField
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter your confirm password"
              fullWidth
              endAdornment={
                showConfirmPassword
                  ? <IconEyeOff
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer"
                  />
                  : <EyeIcon
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer"
                  />
              }
            />
            <FormHelperText></FormHelperText>
          </FormControl>
        </div>
        <SubmitBtn
          fullWidth
          classname="mb-3 mt-6"
          cta="Confirm"
          varient="contained"
          color="primary"
        />
        <SubmitBtn
          fullWidth
          handlclick={handleBack}
          classname="mb-5"
          cta="Back"
          varient="outlined"
          color="primary"
        />
        <div className="text-center cursor-pointer flex flex-col">
          Forgot security questions?
          <span className="text-blue1">Send a request to support</span>
        </div>
      </div>
    </div>
  );
});

export default ForgotPassword;
