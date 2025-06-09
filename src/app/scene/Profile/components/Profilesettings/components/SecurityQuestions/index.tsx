// @ts-nocheck
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Formik, Form } from "formik";
import { useState } from "react";

const SecurityQuestions = () => {
  const [Question, setQuestion] = useState([
    { value: 1, option: "What is your favorite color?" },
    { value: 2, option: "What was the name of your first pet?" },
    { value: 3, option: "What is your mother’s maiden name?" },
  ]);

  return (
    <Box>
      <h4 className="my-3 ms-3 text-start">Security Questions</h4>
      <Box className="mx-auto flex flex-col items-center">
        <Formik
          initialValues={{
            Answerone: "",
            Answertwo: "",
            Answerthree: "",
            Questionone: "",
            QuestionTwo: "",
            QuestionThree: "",
          }}
        >
          <Form className="w-full">
            <Box className="mb-4">
              <Typography className="mb-2">Question 1:</Typography>
              <Select
                name="Questionone"
                fullWidth
                defaultValue=""
                className="mb-4"
                placeholder="Question 1"
              >
                {Question.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.option}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                name="Answerone"
                placeholder="Enter your answer"
                fullWidth
                variant="outlined"
                className="mb-4"
              />
            </Box>
            <Box className="mb-4">
              <Typography className="mb-2">Question 2:</Typography>
              <Select
                name="QuestionTwo"
                fullWidth
                defaultValue=""
                className="mb-4"
                placeholder="Question 2"
              >
                {Question.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.option}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                name="Answertwo"
                placeholder="Enter your answer"
                fullWidth
                variant="outlined"
                className="mb-4"
              />
            </Box>
            <Box className="mb-4">
              <Typography className="mb-2">Question 3:</Typography>
              <Select
                name="QuestionThree"
                fullWidth
                defaultValue=""
                className="mb-4"
                placeholder="Question 3"
              >
                {Question.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.option}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                name="Answerthree"
                placeholder="Enter your answer"
                fullWidth
                variant="outlined"
                className="mb-4"
              />
            </Box>
            <Box className="flex justify-center">
              <Button
                className="w-[400px] p-6"
                variant="contained"
                color="primary"
                type="submit"
              >
                Activate
              </Button>
            </Box>
          </Form>
        </Formik>
      </Box>
    </Box>
  );
};

export default SecurityQuestions;
