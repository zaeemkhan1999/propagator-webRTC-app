import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import BootstrapTextField from "@/components/TextFields/TextField";
import BasicSelect from "@/components/Selections/Select";
import Searchfields from "./SearchField";
import Uploader from "./Uploader";
import Header from "@/components/Header";
import SubmitBtn from "@/components/Buttons";

interface FormData {
  groupName: string;
  link: string;
  visibility: "Public" | "Private";
  coverImage?: string | null;
};

interface GroupFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  initialData?: FormData;
  isEditing?: boolean;
  isUpdating?: boolean;
}

const GroupForm: React.FC<GroupFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  isUpdating,
}) => {

  const [formData, setFormData] = useState<FormData>({
    groupName: "",
    link: "",
    visibility: "Public",
    coverImage: null,
  });

  const [errors, setErrors] = useState({
    groupName: false,
    link: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    }
  };

  const handleFileChange = (file?: string | null) => {
    setFormData({ ...formData, coverImage: file });
  };

  const handleSelectChange = (value: "Public" | "Private") => {
    setFormData({ ...formData, visibility: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      groupName: !formData.groupName,
      link: formData.visibility === "Public" && !formData.link,
    };

    setErrors(newErrors);

    if (!newErrors.groupName && !newErrors.link) {
      onSubmit(formData);
    }
  };

  return (
    <Box className="mb-5 h-full max-h-screen overflow-y-auto p-4">
      <Header
        text={isEditing ? "Edit Group" : "Create Group"}
        handleBack={onCancel}
        textColor="dark"
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full mt-10"
      >
        <Uploader
          onFileChange={handleFileChange}
          url=""
        />

        <label className="text-black1 text-sm">
          Group Name <span className="text-red-600">*</span>
        </label>
        <BootstrapTextField
          name="groupName"
          placeholder="Group Name"
          value={formData.groupName}
          onChange={handleInputChange}
          required
          className="shadow-sm"
          sx={{ marginBottom: "4px" }}
        />
        {errors.groupName && (
          <Typography color="error" variant="caption">
            This field is mandatory.
          </Typography>
        )}

        <BasicSelect
          label="Visibility"
          value={formData.visibility}
          setValue={handleSelectChange}
          options={[
            { label: "Public", value: "Public" },
            { label: "Private", value: "Private" },
          ]}
        />

        {formData.visibility === "Public" && (
          <>
            <label className="text-black1 text-sm">
              Type your link <span className="text-red-600">*</span>
            </label>
            <BootstrapTextField
              name="link"
              placeholder="Type your link"
              value={formData.link}
              onChange={handleInputChange}
              required
              sx={{ marginBottom: "4px" }}
              className="shadow-sm"
            />
            {errors.link && (
              <Typography color="error" variant="caption">
                This field is mandatory.
              </Typography>
            )}
          </>
        )}

        {!isEditing && (
          <>
            <h2 className="text-lg font-semibold mb-3 mt-2">
              Invite your friend
            </h2>
            <div className="flex justify-center px-3">
              <Searchfields className="w-full" />
            </div>
          </>
        )}

        <div className="mt-6">
          <SubmitBtn
            cta={isEditing ? (isUpdating ? "Updating..." : "Update") : "Create"}
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
        </div>
      </form>
    </Box>
  );
};

export default GroupForm;
