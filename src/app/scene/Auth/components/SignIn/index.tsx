import { memo, useState } from "react";
import Logo from "../../../../../assets/images/logo.png";
import Title from "../../../../../components/Typography/Title";
import BootstrapTextField from "../../../../../components/TextFields/TextField";
import { FormControl, FormHelperText } from "@mui/material";
import { Link } from "react-router-dom";
import SubmitBtn from "../../../../../components/Buttons";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUser_LoginMutation } from "./mutations/login";
import { InputMaybe, LoginInput } from "../../../../../types/general";
import EyeIcon from "@/assets/icons/Eye";
import IconEyeOff from "@/assets/icons/EyeOff";

const validationSchema = yup.object().shape({
  username: yup.string().required("Username field is required"),
  password: yup.string().required("Password field is required"),
});

const SignIn = memo(() => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, login } = useUser_LoginMutation();

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: InputMaybe<LoginInput>) => {
    login({ input: data });
  };

  return (
    <div className="px-5 w-full md:flex items-center justify-center">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="px-8 py-6 shadow-cardShadow rounded-lg bg-white md:w-[450px] min-h-[400px]"
        >
          <div className="flex flex-col justify-center items-center border-b-[1px] pb-3  border-[#F5F5F5]">
            <img height={40} width={70} src={Logo} alt="Logo" />
            <Title className="font-extralight mt-2 text-center">
              Welcome to Specter
            </Title>
          </div>
          <div className="flex flex-col gap-5">
            <FormControl variant="standard" fullWidth>
              <BootstrapTextField
                type="text"
                id="username"
                placeholder="Enter your Username"
                fullWidth
                {...methods.register("username")}
              />
              <FormHelperText error={!!methods.formState.errors.username?.message}>
                {methods.formState.errors.username?.message}
              </FormHelperText>
            </FormControl>
            <FormControl variant="standard" fullWidth>
              <BootstrapTextField
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                fullWidth
                {...methods.register("password")}
                endAdornment={
                  showPassword
                    ? <IconEyeOff
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                    />
                    : <EyeIcon
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                    />
                }
              />
              <FormHelperText error={!!methods.formState.errors.password?.message}>
                {methods.formState.errors.password?.message}
              </FormHelperText>
            </FormControl>
          </div>
          <div className="text-right mt-1">
            <Link
              style={{
                color: "rgb(149, 153, 179)",
              }}
              to={"/auth/forgot-password"}
            >
              Forgot password?
            </Link>
          </div>
          <SubmitBtn
            fullWidth
            classname="mt-6 mb-4"
            cta="Sign In"
            varient="contained"
            color="primary"
            isLoading={loading}
          />
          <div className="text-center cursor-pointer">
            <Link to={"/auth/signup"}>
              You don’t have an account?{" "}
              <span className="text-blue1">Sign up</span>
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
});

export default SignIn;
