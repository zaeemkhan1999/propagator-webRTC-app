import { useState, useRef, useEffect } from "react";
import Lefticon from "../assets/texticon/lefticon";
import Righticon from "../assets/texticon/rigthicon";
import Middleicon from "../assets/texticon/midelicon";
import Boldicon from "../assets/texticon/boldicon";
import Italicicon from "../assets/texticon/italicicon";
import Underlineicon from "../assets/texticon/underlineicon";
import Header from "@/components/Header";
import BootstrapTextField from "@/components/TextFields/TextField";
import SubmitBtn from "@/components/Buttons";
import { useCreateArticleMutation } from "./mutation";
import { isEmpty } from "lodash";
import { randomUuidV4 } from "../../../../utility/misc.helpers";
import FilePreview from "@/components/FileView";
import FileUpload from "@/components/FileUploader";
import Title from "@/components/Typography/Title";
import Heading from "@/components/Typography/Heading";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateGroupMessage } from "@/app/scene/Groups/mutations/createGroupMessage";
import { userStore } from "@/store/user";
import { useSnapshot } from "valtio";
import { UserTypes } from "@/types/user.type";
import Trash from "@/assets/icons/IconTrash";
import IconMovie from "@/assets/icons/Movie";
import { IconButton, Modal } from "@mui/material";
import { IconArrowsDiagonal } from "@tabler/icons-react";

type content = {
  id: string;
  data?: null | string | { url?: string, file?: File | null | string };
  articleItemType: "Text" | "Image" | "Video" | "Citations";
  order: number;
  videoTime: string;
  url?: string;
};

const contentErrorMessages = {
  Text: "Please enter some text",
  Image: "Please upload an image",
  Video: "Please upload a video",
  Citations: "Please enter some citations",
};

const CreateScrollPage = () => {
  const user = useSnapshot(userStore.store).user;

  const { state } = useLocation();
  const { props: groupOrTopicProps }: any = state || {};

  const navigate = useNavigate();
  const location = useLocation();

  const [options, setOptions] = useState<content[]>([
    {
      id: randomUuidV4(),
      data: null,
      articleItemType: "Text",
      order: 0,
      videoTime: "",
    },
  ]);
  const [alignment, setAlignment] = useState<"justifyLeft" | "justifyCenter" | "justifyRight">("justifyLeft");
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);
  const [underline, setUnderline] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const textAreaRefs = useRef<any>({});
  const [isPreview, setIsPreview] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [nextLocation, setNextLocation] = useState<null | string>(null);
  const [inputValue, setInputValue] = useState<{ title: string, subtitle: string, author: string }>({
    title: "",
    subtitle: "",
    author: "",
  });

  const [groupId, setGroupId] = useState<string>("");
  const [topicId, setTopicId] = useState<null | number>(null);

  const { createArticle, loading } = useCreateArticleMutation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("GroupId");
    const topicId = urlParams.get("TopicId");
    if (id) {
      setGroupId(id);
    }
    if (topicId) {
      setTopicId(Number(topicId));
    }
  }, []);

  const handlePreviewClick = () => {
    let hasErrors = false;
    let newErrors = {};

    options.forEach((option) => {
      if (isEmpty(option.data)) {
        hasErrors = true;
        newErrors = {
          ...newErrors,
          [option.id]: contentErrorMessages[option.articleItemType],
        };
      }
    });

    if (!inputValue.title || !inputValue.subtitle || !inputValue.author) {
      hasErrors = true;
      newErrors = {
        ...newErrors,
        title: !inputValue.title ? "Please enter title" : "",
        subtitle: !inputValue.subtitle ? "Please enter subtitle" : "",
        author: !inputValue.author ? "Please enter author" : "",
      };
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsPreview(true);
  };

  const handleOptionChange = (id: string, value: string, typeValue: string) => {
    setOptions((prev) => {
      return prev.map((option: any) => {
        if (option.id === id) {
          return {
            ...option,
            selected: value,
            articleItemType: value,
            data: typeValue,
          };
        }
        return option;
      });
    });
  };

  const addAnotherOption = () => {
    setOptions((prev) => {
      return [
        ...prev,
        {
          id: randomUuidV4(),
          selected: "Text",
          articleItemType: "Text",
          data: null,
          order: prev.length + 1,
          videoTime: "",
        },
      ];
    });
  };

  const toggleBold = () => {
    setBold(!bold);
    document.execCommand("bold");
  };

  const toggleItalic = () => {
    setItalic(!italic);
    document.execCommand("italic");
  };

  const toggleUnderline = () => {
    setUnderline(!underline);
    document.execCommand("underline");
  };

  const handleAlignmentChange = (align: any) => {
    setAlignment(align);
    document.execCommand(align);
  };

  const handleFileChange = (id: any, file: any, type: any) => {
    if (type === "image") {
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.id === id ? { ...option, data: file } : option
        )
      );
    }
    if (type === "video") {
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.id === id ? { ...option, data: file } : option
        )
      );
    }
    setErrors((prev: any) => ({ ...prev, [id]: null }));
  };

  const handleDeleteOption = (id: any) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleContentChange = (id: any, html: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, data: `${html}` } : option
      )
    );
    setErrors((prev: any) => ({ ...prev, [id]: null }));
  };

  const handleDeleteImage = (id: any) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, data: null } : option
      )
    );
  };

  const handleCitationChange = (id: any, value: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, data: value } : option
      )
    );
    setErrors((prev: any) => ({ ...prev, [id]: null }));
  };

  const { createGroupMessage } = useCreateGroupMessage();

  const handleSubmit = () => {
    const input = {
      isByAdmin: (user?.id === 1 && user?.userTypes === UserTypes.SuperAdmin),
      author: inputValue.author,
      title: inputValue.title,
      subTitle: inputValue.subtitle,
      isCreatedInGroup: !!groupId,
      articleItems: options.map((opt) => ({
        articleItemType: opt.articleItemType?.toUpperCase(),
        data: (opt.data as { file?: string | File | null; url?: string }).file
          ? (opt.data as { file: string | File | null; url?: string }).url
          : opt.data,
        order: opt.order,
        videoTime: opt.videoTime,
      })),
    };

    createArticle({ input }, (articleId: number) => {
      if (!!groupId) {
        createGroupMessage({
          messageInput: {
            conversationId: Number(groupId),
            isShare: false,
            groupTopicId: topicId,
            messageType: "ARTICLE",
            articleId,
            contentAddress: ''
          }
        },
          () => {
            navigate(`/specter/groups/${groupId}${!!topicId ? `/topics/${topicId}?filter=Scrolls` : "?filter=Scrolls"}`, {
              state: {
                props:
                  (!!groupId && !topicId)
                    ? { group: groupOrTopicProps?.group }
                    : (!!groupId && !!topicId)
                      ? { topic: groupOrTopicProps?.topic }
                      : {}
              }
            });
          }
        );
      } else {
        navigate("/specter/home");
      }
    });
  };

  useEffect(() => {
    const unblock = () => {
      window.history.pushState(null, "", location.pathname);
    };

    unblock();

    const handlePopState = (event: PopStateEvent) => {
      setNextLocation("/specter/home");
      setShowConfirmationModal(true);
      if (showConfirmationModal) {
        unblock();
      };
      event.preventDefault();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleNavigation = (event: any) => {
      if (showConfirmationModal) {
        event.preventDefault();
        setNextLocation("/specter/home");
        setShowConfirmationModal(true);
      };
    };

    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [location.pathname, showConfirmationModal]);

  const handleConfirmExit = () => {
    if (nextLocation) {
      navigate(nextLocation);
    };
    setShowConfirmationModal(false);
  };

  const handleBack = () => {
    if (isPreview) {
      setIsPreview(false);
    } else {
      setNextLocation("/specter/home");
      setShowConfirmationModal(true);
    };
  };

  return (
    <div className="bg-gray-50 w-full h-screen px-5">
      <Header
        text={isPreview ? "Preview" : "Create Scroll"}
        textColor='black'
        handleBack={handleBack}
      />

      {!isPreview
        ? <div className="h-full overflow-y-auto p-4 pt-0 pb-32">
          {/* Article Title */}
          <div className={`mt-3 relative`}>
            <label className="block text-gray-700 font-medium text-sm">
              Title <span className="text-red-500">*</span>
            </label>
            <BootstrapTextField
              fullWidth
              value={inputValue.title}
              onChange={(e) => {
                setInputValue({
                  ...inputValue,
                  title: e.target.value,
                });
                setErrors({
                  ...errors,
                  title: "",
                });
              }}
              placeholder="Enter Title"
              className="shadow-sm"
            />
            {errors.title && (
              <p className="text-red-500 text-xs absolute bottom-[-20px]">
                {errors.title}
              </p>
            )}
          </div>

          {/* Subtitle */}
          <div className={`mt-${errors.title ? 7 : 3} text-sm relative`}>
            <label className="block text-gray-700 font-medium mb-1">
              Subtitle <span className="text-red-500">*</span>
            </label>
            <BootstrapTextField
              fullWidth
              value={inputValue.subtitle}
              onChange={(e) => {
                setInputValue({
                  ...inputValue,
                  subtitle: e.target.value,
                });
                setErrors({
                  ...errors,
                  subtitle: "",
                });
              }}
              placeholder="Enter Subtitle"
              className="shadow-sm"
            />
            {errors.subtitle && (
              <p className="text-red-500 text-xs absolute bottom-[-20px]">
                {errors.subtitle}
              </p>
            )}
          </div>

          {/* Author */}
          <div className={`mt-${errors.subtitle ? 7 : 3} text-sm relative`}>
            <label className="block text-gray-700 font-medium mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <BootstrapTextField
              fullWidth
              value={inputValue.author}
              onChange={(e) => {
                setInputValue({
                  ...inputValue,
                  author: e.target.value,
                });
                setErrors({
                  ...errors,
                  author: "",
                });
              }}
              placeholder="Enter Auther Name"
              className="shadow-sm"
            />
            {errors.author && (
              <p className="text-red-500 text-xs mt-1 absolute bottom-[-20px]">
                {errors.author}
              </p>
            )}
          </div>

          {/* Dropdown and Text Editor */}
          {options.map((option, index: number) => {
            return (
              <div key={option.id} className={`mb-6 mt-${errors.author ? 8 : 6}`}>
                <div className="flex items-center justify-between">
                  <select
                    className="w-full p-2 border rounded-lg focus:outline-none"
                    value={option.articleItemType}
                    onChange={(e) =>
                      handleOptionChange(option.id, e.target.value, "")
                    }
                  >
                    <option value="Text">Text</option>
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                    <option value="Citations">Citations</option>
                  </select>

                  {index !== 0 && ( // Hide delete icon for the first element
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteOption(option.id)}
                      aria-label="Delete option"
                    >
                      <Trash style={{ color: "red" }} />
                    </button>
                  )}
                </div>

                {/* Input Field Based on Selected Option */}
                <div className="mt-4 relative">
                  {option.articleItemType === "Text" && (
                    <div className="flex flex-col mb-2">
                      <div className="flex justify-between items-center mb-2 border-b">
                        <div className="space-x-2">
                          <button
                            className={`text-xl ${alignment === "justifyLeft" ? "bg-blue-100" : ""
                              }`}
                            onClick={() =>
                              handleAlignmentChange("justifyLeft")
                            }
                          >
                            <Lefticon />
                          </button>
                          <button
                            className={`text-xl ${alignment === "justifyCenter"
                              ? "bg-blue-100"
                              : ""
                              }`}
                            onClick={() =>
                              handleAlignmentChange("justifyCenter")
                            }
                          >
                            <Middleicon />
                          </button>
                          <button
                            className={`text-xl ${alignment === "justifyRight"
                              ? "bg-blue-100"
                              : ""
                              }`}
                            onClick={() =>
                              handleAlignmentChange("justifyRight")
                            }
                          >
                            <Righticon />
                          </button>
                        </div>

                        <div className="space-x-2">
                          <button
                            className={`text-xl ${bold ? "bg-blue-100" : ""}`}
                            onClick={toggleBold}
                          >
                            <Boldicon />
                          </button>
                          <button
                            className={`text-xl italic ${italic ? "bg-blue-100" : ""
                              }`}
                            onClick={toggleItalic}
                          >
                            <Italicicon />
                          </button>
                          <button
                            className={`text-xl underline ${underline ? "bg-blue-100" : ""
                              }`}
                            onClick={toggleUnderline}
                          >
                            <Underlineicon />
                          </button>
                        </div>
                      </div>

                      <div
                        ref={(el) => (textAreaRefs.current[option.id] = el)}
                        aria-placeholder="Type Something..."
                        contentEditable
                        className={`w-full ${isFullScreen ? "h-screen" : ""} bg-white p-2 border rounded-lg focus:outline-none relative`}
                        style={{ minHeight: "100px" }}
                        onInput={(e) =>
                          handleContentChange(
                            option.id,
                            e.currentTarget.innerHTML
                          )
                        }
                      >
                      </div>
                      <IconButton
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="absolute bottom-0 right-0">
                        <IconArrowsDiagonal />
                      </IconButton>
                    </div>
                  )}

                  {option.articleItemType === "Image" && (
                    <div>
                      {!!option.data
                        ? <FilePreview
                          file={option?.data}
                          onDelete={() => handleDeleteImage(option.id)}
                        />
                        : <FileUpload
                          className="h-[130px]"
                          onFileUpload={(files: any, url: any) =>
                            handleFileChange(
                              option.id,
                              { file: files[0], url },
                              "image"
                            )
                          }
                          label="+ Upload your Image"
                        />}
                    </div>
                  )}

                  {option.articleItemType === "Video" && (
                    !!option.data
                      ? <video
                        controls
                        className="rounded-md w-full h-auto"
                        src={option?.data as string || ''}
                      >
                        Your browser does not support the video tag.
                      </video>
                      : <FileUpload
                        className="h-[130px]"
                        onFileUpload={(files: any, url: any) => {
                          handleFileChange(option.id, url, "video");
                        }}
                        label="+ Upload your Video"
                        icon={<IconMovie className="text-black1" />}
                      />)
                  }

                  {
                    option.articleItemType === "Citations" && (
                      <div>
                        <div className="mt-4 text-sm">
                          <label className="block text-gray-700 font-medium mb-1">
                            Citation <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-lg focus:outline-none"
                            onChange={(e) =>
                              handleCitationChange(option.id, e.target.value)
                            }
                            value={option?.data as string || ""}
                          />
                        </div>
                      </div>
                    )
                  }
                  {
                    errors[option.id] && (
                      <p className="text-red-500 text-xs mt-1 absolute bottom-[-20px]">
                        {errors[option.id]}
                      </p>
                    )
                  }
                </div>
              </div>
            );
          })}

          {/* Add Another Option Button */}
          <div className="mt-6 mb-8">
            <button
              onClick={addAnotherOption}
              className="w-full flex items-center justify-center text-green-600 border-2 border-green-500 py-2 rounded-lg hover:bg-green-50"
            >
              <span className="text-2xl mr-2">+</span> Add another option
            </button>
          </div>

          {/* Preview Button */}
          <div className="mt-6 mb-4">
            <SubmitBtn
              cta="Preview"
              varient="contained"
              color="error"
              size="medium"
              fullWidth
              classname="font-medium transition-colors"
              style={{
                backgroundColor: "#dc2626",
                padding: "0.5rem 0",
                borderRadius: "0.5rem",
                color: "white",
                border: "none",
                outline: "none",
              }}
              hoverColor="rgb(119, 21, 21)"
              handlclick={handlePreviewClick}
            />
          </div>
        </div>
        : <div className="w-full h-full overflow-y-auto pb-32 pt-6">
          <div className="w-full flex items-center justify-between mb-6">
            <Heading>{inputValue.title}</Heading>
            <Heading>By {inputValue.author}</Heading>
          </div>
          <Title className="mb-5">{inputValue.subtitle}</Title>

          <div className="flex flex-col gap-8">
            {options.map((option, i) => {
              const imageUrl =
                typeof option?.data === "object" && option?.data?.url
                  ? option?.data.url
                  : "";
              if (option.articleItemType === "Image") {
                return (
                  <LazyLoadImage
                    key={i}
                    className="w-full h-[400px] object-cover rounded-lg"
                    src={imageUrl}
                    alt=""
                  />
                );
              }

              if (option.articleItemType === "Video") {
                return (
                  <video
                    key={i}
                    controls
                    className="w-full h-auto  rounded-lg"
                    src={option?.data as string || ''}
                  >
                    Your browser does not support the video tag.
                  </video>
                );
              }
              if (option.articleItemType === "Text") {
                return (
                  <div key={i} dangerouslySetInnerHTML={{ __html: option.data as string }} />
                );
              }
              if (option.articleItemType === "Citations") {
                return (
                  <div key={i}>
                    <Heading>Citations:</Heading>
                    <a
                      href={option.data as string}
                      target="_blank"
                      className="text-[#1890ff] underline"
                    >
                      {option.data as string}
                    </a>
                  </div>
                );
              }
            })}
          </div>
          <div className="mt-6 mb-4">
            <SubmitBtn
              cta="Share"
              varient="contained"
              isLoading={loading}
              color="error"
              size="large"
              fullWidth
              classname="font-medium transition-colors"
              style={{
                backgroundColor: "#dc2626",
                padding: "0.5rem 0",
                borderRadius: "0.5rem",
                color: "white",
                border: "none",
                outline: "none",
              }}
              hoverColor="rgb(119, 21, 21)"
              handlclick={handleSubmit}
            />
          </div>
        </div>}

      {showConfirmationModal &&
        <Modal open={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}>
          <div className="bg-white py-5 px-2 grid place-items-center text-center">
            <h2>Your creation of Scroll is in progress, you still want to exit?</h2>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Stay
              </button>
              <button
                onClick={handleConfirmExit}
                className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Exit
              </button>
            </div>
          </div>
        </Modal>}
    </div>
  );
};

export default CreateScrollPage;
