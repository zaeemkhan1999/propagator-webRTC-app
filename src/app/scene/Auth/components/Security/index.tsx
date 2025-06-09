import { memo, useEffect, useState } from "react";
import Logo from "../../../../../assets/images/logo.png";
import Title from "../../../../../components/Typography/Title";
import BootstrapTextField from "../../../../../components/TextFields/TextField";
import { Button, FormControl, FormHelperText } from "@mui/material";
import SubmitBtn from "../../../../../components/Buttons";
import BasicSelect from "../../../../../components/Selections/Select";
import { useSecurityQuestion_GetSecurityQuestionsQuery } from "./query";
import { useUser_RegisterUserSecurityAnswerMutation } from "./mutations";
import { useLocation } from "react-router-dom";

const Security = memo(() => {
  const location = useLocation();
  const { state } = location;

  const [question1, setQuestion1] = useState<string>("");
  const [question2, setQuestion2] = useState<string>("");
  const [question3, setQuestion3] = useState<string>("");
  const [answer1, setAnswer1] = useState<{ id: number, answer: string }>({ id: 1, answer: '' });
  const [answer2, setAnswer2] = useState<{ id: number, answer: string }>({ id: 2, answer: '' });
  const [answer3, setAnswer3] = useState<{ id: number, answer: string }>({ id: 3, answer: '' });
  const [options, setOptions] = useState<any>([]);

  const { fetchSecurityQuestions, data } = useSecurityQuestion_GetSecurityQuestionsQuery();
  const { registerUserSecurityAnswer, loading } = useUser_RegisterUserSecurityAnswerMutation();

  useEffect(() => {
    fetchSecurityQuestions()
  }, []);

  useEffect(() => {
    if (data) {
      setOptions(data?.securityQuestion_getSecurityQuestions?.result?.items);
    }
  }, [data]);

  const handleSubmit = async () => {
    const username = location.search.split("=")[1];
    const payload = [
      {
        questionId: answer1.id,
        answer: answer1.answer
      },
      {
        questionId: answer2.id,
        answer: answer2.answer
      },
      {
        questionId: answer3.id,
        answer: answer3.answer
      }
    ];

    if (state?.tokens?.access_Token) {
      await registerUserSecurityAnswer({
        input: payload,
        username,
      }, state?.tokens);

    }
  }

  return (
    <div className="w-full p-5 flex items-center justify-center">
      <div
        className="px-8 py-4 shadow-cardShadow overflow-y-auto rounded-lg bg-white w-full md:w-[450px] min-h-[400px]"
      >
        <div className="flex flex-col justify-center items-center border-b-[1px] pb-3  border-[#F5F5F5]">
          <img height={40} width={70} src={Logo} alt="Logo" />
          <Title className="font-extralight mt-2">Answer this question</Title>
        </div>
        <div className="pt-8 flex flex-col gap-4">
          <FormControl variant="standard" fullWidth>
            <BasicSelect
              label="Question1:"
              options={options}
              value={question1}
              setValue={setQuestion1}
            />
            <BootstrapTextField
              type="text"
              placeholder="Enter your answer"
              fullWidth
              className="mt-4"
              value={answer1.answer}
              onChange={(e) => setAnswer1({ id: 1, answer: e.target.value })}
            />
            <FormHelperText></FormHelperText>
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <BasicSelect
              label="Question2:"
              options={options}
              value={question2}
              setValue={setQuestion2}
            />
            <BootstrapTextField
              type="text"
              placeholder="Enter your answer"
              fullWidth
              className="mt-4"
              value={answer2.answer}
              onChange={(e) => setAnswer2({ id: 2, answer: e.target.value })}
            />
            <FormHelperText></FormHelperText>
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <BasicSelect
              label="Question3:"
              options={options}
              value={question3}
              setValue={setQuestion3}
            />
            <BootstrapTextField
              type="text"
              placeholder="Enter your answer"
              fullWidth
              className="mt-4"
              value={answer3.answer}
              onChange={(e) => setAnswer3({ id: 3, answer: e.target.value })}
            />
            <FormHelperText></FormHelperText>
          </FormControl>

        </div>
        <div className="flex items-center justify-center gap-2 mt-6">
          <SubmitBtn
            fullWidth
            handlclick={handleSubmit}
            classname=""
            cta="Submit"
            varient="contained"
            color="primary"
            isLoading={loading}
          />

          <Button variant="outlined" onClick={handleSubmit}>
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Security;
