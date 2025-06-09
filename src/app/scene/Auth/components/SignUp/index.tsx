import { useEffect, useState } from "react";
import Logo from "@/assets/images/logo.png";
import Title from "@/components/Typography/Title";
import BootstrapTextField from "@/components/TextFields/TextField";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";
import SubmitBtn from "@/components/Buttons";
import BasicSelect from "@/components/Selections/Select";
import { createCaptcha, getCaptchaValue } from "../../../../utility/misc.helpers";
import { useUser_SignUpMutation } from "./mutations";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import EyeIcon from "@/assets/icons/Eye";
import IconEyeOff from "@/assets/icons/EyeOff";
import { IconRefresh } from "@tabler/icons-react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState("gender");

  const { signUp, loading } = useUser_SignUpMutation();

  useEffect(() => {
    createCaptcha("captcha");
  }, []);

  const validationSchema = yup.object().shape({
    // legalName: yup.string().required("Legal name field is required"),
    displayName: yup.string().required("Display name field is required"),
    // email: yup.string().email("Invalid email format"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password field is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])/,
        "Password must contain at least one capital letter, one special character, and one number"
      ),
    // confirmPassword: yup
    //   .string()
    //   .required("Confirm password field is required")
    //   .oneOf([yup.ref("password")], "Passwords must match"),
    gender: yup.string().required("Gender field is required"),
    captcha: yup
      .string()
      .required("Captcha field is required")
      .test("captcha-match", "Captcha is incorrect", (value) => {
        const generatedCaptcha = getCaptchaValue("captcha");
        return generatedCaptcha === value;
      }),
    // dateOfBirth: yup.string().required("Date of birth field is required"),
    username: yup.string().required("Username field is required"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const errors = methods.formState.errors;

  interface submitData {
    // email?: string | undefined;
    // legalName: string;
    displayName: string;
    password: string;
    // confirmPassword: string;
    gender: string;
    captcha: string;
    // dateOfBirth: string;
    username: string;
  };

  const onSubmit = (data: submitData) => {
    let payload = { ...data, gender: gender.toUpperCase() };
    // const { captcha, confirmPassword, ...restData } = payload;
    const { captcha, ...restData } = payload;
    signUp({ input: restData });
  };

  return (
    <div className="px-5 w-full flex items-center justify-center">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}
          style={{ height: "calc(100dvh - 100px)" }}
          className="px-8 py-6 shadow-cardShadow overflow-y-auto rounded-lg bg-white md:w-[450px] min-h-[400px]"
        >
          <div className="flex flex-col justify-center items-center border-b-[1px] pb-3  border-[#F5F5F5]">
            <img height={40} width={70} src={Logo} alt="Logo" />
            <Title className="font-extralight mt-2 text-center">Welcome to Specter</Title>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            {/* <FormControl variant="filled" fullWidth>
              <InputLabel required htmlFor="legalName" id="legalName">
                Legal name
              </InputLabel>
              <BootstrapTextField
                type="text"
                placeholder="Enter your Legal name"
                fullWidth
                id="legalName"
                {...methods.register("legalName")}
              />
              <FormHelperText error={Boolean(errors.legalName)}>
                {errors.legalName?.message}
              </FormHelperText>
            </FormControl> */}

            <FormControl variant="filled" fullWidth>
              <InputLabel required htmlFor="displayName" id="displayName">
                Display Name
              </InputLabel>
              <BootstrapTextField
                type="text"
                placeholder="Enter your display name"
                fullWidth
                id="displayName"
                {...methods.register("displayName")}
              />
              <FormHelperText error={Boolean(errors.displayName)}>
                {errors.displayName?.message}
              </FormHelperText>
            </FormControl>

            {/* <FormControl variant="filled" fullWidth>
              <InputLabel htmlFor="email" id="email">
                Email
              </InputLabel>
              <BootstrapTextField
                type="text"
                placeholder="Enter your email"
                fullWidth
                id="email"
                {...methods.register("email")}
              />
              <FormHelperText error={Boolean(errors.email)}>
                {errors.email?.message}
              </FormHelperText>
            </FormControl> */}

            <FormControl variant="filled" fullWidth>
              <InputLabel required>Username</InputLabel>
              <BootstrapTextField
                type="text"
                placeholder="Enter your Username"
                fullWidth
                id="username"
                {...methods.register("username")}
              />
              <FormHelperText error={Boolean(errors.username)}>
                {errors.username?.message}
              </FormHelperText>
            </FormControl>

            <FormControl variant="filled" fullWidth>
              <InputLabel required>Password</InputLabel>
              <BootstrapTextField
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                fullWidth
                id="password"
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
              <FormHelperText error={Boolean(errors.password)}>
                {errors.password?.message}
              </FormHelperText>
            </FormControl>

            {/* <FormControl variant="standard" fullWidth>
              <InputLabel required>Confirm Password</InputLabel>
              <BootstrapTextField
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter your Confirm password"
                fullWidth
                id="confirmPassword"
                {...methods.register("confirmPassword")}
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
              <FormHelperText error={Boolean(errors.confirmPassword)}>
                {errors.confirmPassword?.message}
              </FormHelperText>
            </FormControl> */}

            <div className="flex items-center gap-3 mt-2">
              <div className="w-[40%]">
                <BasicSelect
                  value={gender}
                  setValue={(value: string) => {
                    methods.setValue("gender", value)
                    setGender(value)
                  }}
                  options={[
                    {
                      label: "Gender",
                      value: "gender",
                    },
                    {
                      label: "Male",
                      value: "male",
                    },
                    {
                      label: "Female",
                      value: "female",
                    },
                  ]}
                />
              </div>
              {/* <div className="w-[60%]">
                <FormControl variant="filled" fullWidth>
                  <BootstrapTextField type="date" fullWidth {...methods.register("dateOfBirth")} id="dateOfBirth" />
                  <FormHelperText></FormHelperText>
                </FormControl>
              </div> */}
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-1">
                <div id="captcha"></div>
                <IconRefresh className="cursor-pointer ml-3" onClick={() => createCaptcha("captcha")} />
              </div>
              <FormControl variant="filled" fullWidth>
                <BootstrapTextField
                  type="text"
                  placeholder="Enter captcha"
                  fullWidth
                  id="captcha"
                  {...methods.register("captcha")}
                />
                <FormHelperText error={!!errors?.captcha?.message}>
                  {errors?.captcha?.message}
                </FormHelperText>
              </FormControl>
            </div>
          </div>
          <div className="my-6 text-[13px] font-light text-center">
            By creating an account, you agree to our
            <span className="text-blue1">Terms of Services</span> and
            <span className="text-blue1">Privacy Policy</span>
          </div>
          <SubmitBtn
            fullWidth
            classname="my-4"
            cta="Sign Up"
            varient="contained"
            color="primary"
            isLoading={loading}
          />

          <div className="text-center cursor-pointer">
            <Link to={"/auth/signin"}>
              Have an account? <span className="text-blue1">Sign In</span>
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SignUp;
