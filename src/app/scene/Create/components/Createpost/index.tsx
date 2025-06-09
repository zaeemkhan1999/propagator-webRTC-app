import { lazy, memo, useCallback, useEffect, useState } from "react";
import Cameraicon from "../assets/cameraicon";
import Locationicon from "../assets/locationicon";
import Imageicon from "../assets/imageicon";
import Header from "@/components/Header";
import BootstrapTextField from "@/components/TextFields/TextField";
import SubmitBtn from "@/components/Buttons";
import useCreatePost from "./mutation/createPost";
import { CircularProgressWithLabel } from "@/components/Progress";
import Paragraph from "@/components/Typography/Paragraph";
import ImageSwiper from "@/components/Carasoule";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "@/components/Typography/Title";
import { Box, CircularProgress, FormControl, InputAdornment, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { usePlaceGetPlaces } from "@/app/services/mutations/searchLocation.mutation";
import { debounce } from "lodash";
import FileUpload from "@/components/FileUploader";
import { extractHashtags, extractLinks, isValidURL, isVideo } from "@/app/utility/misc.helpers";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import useUploadToAws from "@/hooks/useUploadToAws";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import { useCreateGroupMessage } from "@/app/scene/Groups/mutations/createGroupMessage";
import { UserTypes } from "@/types/user.type";
import Uploader from "@/app/scene/Groups/components/Uploader";
import Trash from "@/assets/icons/IconTrash";
import MapPinIcon from "@/assets/icons/MapPin";
import XIcon from "@/assets/icons/Cross";
import SearchIcon from "@/assets/sidebar/search";
import { isImage } from "@/helper";
import { MentionedUser } from "@/components/Feed/Comments";

const UserSuggestions = lazy(() => import("@/components/Feed/UserSuggestions"));
const BasicModal = lazy(() => import("@/components/Modals/BasicModal"));

interface Props {
  isCreatingAd?: boolean;
  handleCreatePost?: Function;
};

const layouts = [
  { label: "Original", value: "ORIGINAL" },
  { label: "9:16", value: "9_16" },
  { label: "1:1", value: "1_1" },
  { label: "4:5", value: "4_5" },
  { label: "16:9", value: "16_9" },
  { label: "3:4", value: "3_4" },
];

const CreatePostPage = memo(({ isCreatingAd, handleCreatePost }: Props) => {
  const user = useSnapshot(userStore.store);
  const { uploadToAws, isUploading } = useUploadToAws();
  const urlParams = new URLSearchParams(window.location.search);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { props: groupOrTopicProps }: any = state || {};

  const location = useLocation();

  const [selectedCity, setSelectedCity] = useState("");
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState<any>([]);
  const [links, setLinks] = useState<any>([]);
  const [layout, setLayout] = useState("ORIGINAL");
  const [content, setContent] = useState<any[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isdownload, setdownload] = useState(false);
  const [isPromote, setIsPromote] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [openThumbNailModal, setOpenThumbNailModal] = useState(false);
  const [selectThumbNail, setSelectThumbNail] = useState<any>(null);
  const [groupId, setGroupId] = useState("");
  const [topicId, setTopicId] = useState<null | number>(null);
  const [color, setColor] = useState("#000000");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [nextLocation, setNextLocation] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [mentionedUser, setMentionedUser] = useState<null | MentionedUser>(null);

  const { createPost, loading } = useCreatePost();
  const { fetchPlaces, loading: loadingPlaces, data } = usePlaceGetPlaces();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    setPostContent(value);

    if (showUserSuggestions) {
      const val = value.split('@');
      setSearchTerm(val[1] || '');
    };

    const lastChar = value.charAt(value.length - 1);

    if (lastChar.includes('@') && !showUserSuggestions) {
      setShowUserSuggestions(true);
    } else if (!value.includes('@') && showUserSuggestions) {
      setShowUserSuggestions(false);
    };

    error && setError("");
    setTags(extractHashtags(value))
    setLinks(extractLinks(value))
  };

  const toggledownload = () => {
    setdownload(!isdownload);
  };

  const togglePromote = () => {
    setIsPromote(!isPromote);
  };

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    setOpenLocationModal(false);
  };

  const generateThumbnails = async (file: File) => {
    const thumbs = await generateVideoThumbnails(file, 7, "");
    if (thumbs.length) {
      setSelectThumbNail(thumbs[0]);
      setThumbnails(thumbs);
    }
    setOpenThumbNailModal(true);
  };

  const handleFileUpload = (file: File[], url: string) => {
    setContent((prev) => [...prev, url]);
    if (isVideo(url)) {
      generateThumbnails(file[0]);
    } else if (isImage(url)) {
      setSelectThumbNail(url);
    };
  };

  const handleDeleteImage = (index: number) => {
    setContent((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteCity = () => {
    setSelectedCity("");
  };

  const handlePreview = (event: any) => {
    event.preventDefault();

    if (isUploading || completed !== 0) return;

    if (!postContent) {
      setError("Please enter something in 'What’s on your mind.'");
      return;
    } else if (content.length && !(isValidURL(selectThumbNail) || isImage(selectThumbNail))) {
      setOpenThumbNailModal(true);
      return;
    }
    setError("");
    setIsPreviewVisible(true);
    !content.length && setLayout("1_1");
  };

  const { createGroupMessage } = useCreateGroupMessage();

  useEffect(() => {
    const id = urlParams.get("GroupId");
    const topicId = urlParams.get("TopicId");
    if (id) {
      setGroupId(id);
    }
    if (topicId) {
      setTopicId(Number(topicId));
    }
  }, []);

  const generatePayload = () => {
    const postItems = content.map((el: any, idx: number) => {
      return {
        content: el,
        height: 0,
        width: 0,
        postItemType: isVideo(el) ? "VIDEO" : "IMAGE",
        order: idx,
        thumNail: selectThumbNail ?? '',
      };
    });

    const linkInputs = links.map((link: any, index: number) => ({
      id: index,
      url: link,
      text: "",
      linkType: "POST"
    }));

    return {
      allowDownload: isdownload,
      isByAdmin: (user?.user?.id === 1 && user?.user?.userTypes === UserTypes.SuperAdmin),
      aspectRatio: layout,
      iconLayoutType: "VERTICAL",
      bg: color,
      isCreatedInGroup: !!groupId,
      location: selectedCity,
      posterId: user?.user?.id,
      postItems,
      tags,
      linkInputs,
      yourMind: postContent,
    };
  };

  const handleShare = () => {
    const input = generatePayload();
    createPost({ input }, (postId: number) => {
      if (!isPromote) {
        if (!!groupId) {
          createGroupMessage({
            messageInput: {
              conversationId: Number(groupId),
              isShare: false,
              groupTopicId: topicId,
              messageType: "POST",
              postId,
              contentAddress: ''
            }
          }, () => {
            navigate(`/specter/groups/${groupId}${!!topicId ? `/topics/${topicId}` : ""}`, {
              state: {
                props:
                  (!!groupId && !topicId)
                    ? { group: groupOrTopicProps?.group }
                    : (!!groupId && !!topicId)
                      ? { topic: groupOrTopicProps?.topic }
                      : {}
              }
            });
          });
        } else {
          navigate("/specter/home");
          setPostContent("");
          setContent([]);
          setSelectedCity("");
          setIsPreviewVisible(false);
        }
      } else {
        navigate(`/specter/promotions`, { state: { props: { postId, isPromote } } });
      }
    });
  };

  // Handling Creation of Ad Post
  useEffect(() => {
    if (isCreatingAd && handleCreatePost) {
      const payload = generatePayload();
      handleCreatePost(payload);
    };
  }, [isdownload, layout, selectedCity, postContent, content, selectThumbNail, links, tags]);

  const triggerCameraInput = () => {
    document.getElementById("cameraInput")?.click();
  };

  const debouncePlacesSearch = useCallback(
    debounce((value) => {
      fetchPlaces({
        where: { location: { contains: value } },
        skip: 0,
        take: 10,
      });
    }, 500),
    []
  );

  useEffect(() => {
    openLocationModal && debouncePlacesSearch("");
  }, [openLocationModal]);

  const handlePlaceSearch = (e: any) => {
    setSearchText(e.target.value);
    debouncePlacesSearch(e.target.value);
  };

  const handleOpenLocationModal = () => {
    setOpenLocationModal(true);
  };

  const handleClearLocationSearch = () => {
    debouncePlacesSearch("");
    setSearchText("");
  };

  const dataURLtoFile = (dataurl: any = selectThumbNail, filename: string = "thumbnail.webp") => {
    if (dataurl && filename) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      const file = new File([u8arr], filename, { type: mime });

      if (file) {
        uploadToAws(file).then((url) => {
          setSelectThumbNail(url);
          setOpenThumbNailModal(false);
        });
      }
    }
  };

  useEffect(() => {
    !openThumbNailModal && !isValidURL(selectThumbNail) && dataURLtoFile();
  }, [openThumbNailModal, selectThumbNail]);

  const handleLayoutChange = (event: any) => {
    setLayout(event.target.value);
  };

  const handleColorChange = (event: any) => {
    setColor(event.target.value);
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
    if (isPreviewVisible) {
      setIsPreviewVisible(false);
    } else {
      setNextLocation("/specter/home");
      setShowConfirmationModal(true);
    };
  };

  const onCloseSuggestionsModal = () => {
    setSearchTerm('');
    setShowUserSuggestions(false);
  };

  const onSuggestionClick = (u: MentionedUser) => {
    setMentionedUser(u);
    const updatedText = postContent.split('@')[0] + `@${u.username} `;
    setPostContent(updatedText);
    document.getElementById("yourMind")?.focus();
  };

  return (
    <div className="bg-white px-5 h-full w-full flex flex-col">
      {!isCreatingAd &&
        <Header
          text={isPreviewVisible ? "Post Preview" : "Create post"}
          textColor="black"
          handleBack={handleBack}
        />}

      <div className={`flex-grow overflow-y-auto h-screen ${!isCreatingAd && 'pt-3'} pb-20`}>
        {isPreviewVisible
          ? <div className="w-full pt-3">
            <div className="w-full">
              <Paragraph>{postContent}</Paragraph>
              <div className="w-full h-[400px] overflow-hidden rounded-lg my-3 ">
                <ImageSwiper images={content} />
              </div>
              <div className="flex items-center gap-4">
                <FormControl fullWidth className="my-3">
                  <InputLabel>Aspect Ratio</InputLabel>
                  <Select
                    value={layout}
                    onChange={handleLayoutChange}
                    label="Aspect Ratio"
                  >
                    {layouts.map((layout) => {
                      return <MenuItem key={layout.value} value={layout.value}>{layout.label}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <InputLabel>Post background</InputLabel>
                  <TextField
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    sx={{
                      padding: 0,
                      width: "40px",
                      height: "40px",
                      "& input": {
                        padding: 0,
                        border: "none",
                        height: "40px",
                        cursor: "pointer",
                      },
                      "& fieldset": {
                        border: "none",
                      },
                    }}
                  />
                </Box>
              </div>
              {!isCreatingAd && <SubmitBtn
                handlclick={handleShare}
                disable={isUploading || loading}
                cta="Share"
                color="primary"
                varient="contained"
                fullWidth
                classname="bg-red1 mt-3"
                style={{ height: "54px", borderRadius: "12px" }}
                hoverColor="rgb(119, 21, 21)"
                isLoading={loading}
              />}
            </div>
          </div>
          : <form>
            <div className="">
              <label className="block text-gray-700 font-medium m-2 text-lg">
                What’s on your mind?
              </label>
              <div>
                <BootstrapTextField
                  id="yourMind"
                  onInput={handleInputChange}
                  fullWidth
                  multiline
                  rows={5}
                  placeholder="@Eli we are going to #Canada"
                  value={postContent}
                  className={`w-full shadow-sm ${error ? "border-red-500" : ""}`}
                  sx={{
                    borderRadius: "12px !important",
                    "& textarea": { height: "auto" }
                  }}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </div>

            <div className="flex justify-between bg-white h-12 items-center mt-4 border-gray-200 border rounded-xl focus:outline-none focus:ring p-5 focus:border-0">
              <p className="text-gray-500">Add to your post</p>
              <div className="flex space-x-4 items-center">
                {completed > 0 && (
                  <CircularProgressWithLabel value={completed || 0} />
                )}

                <button type="button" onClick={handleOpenLocationModal}>
                  <span role="img" aria-label="location" className="text-xl">
                    <Locationicon />
                  </span>
                </button>

                <button type="button" onClick={triggerCameraInput}>
                  <span role="img" aria-label="camera" className="text-xl">
                    <Cameraicon />
                  </span>
                </button>

                <FileUpload
                  onFileUpload={handleFileUpload}
                  customUI={<Imageicon />}
                  setProgress={setCompleted}
                  className="mb-1"
                />
              </div>
            </div>

            {selectedCity
              && (<div className="flex justify-between items-center mt-2 text-gray-700">
                <div className="flex items-center gap-1">
                  <Locationicon />
                  <strong>{selectedCity}</strong>
                </div>
                <button
                  className="right-1 bg-white p-1 rounded-full hover:bg-gray-200"
                  onClick={handleDeleteCity}
                >
                  <Trash style={{ color: "red" }} />
                </button>
              </div>)}

            <div className="flex justify-between items-center mt-4 border-t border-b border-gray-200 pt-4 pb-4 ps-2">
              <p className="text-gray-700">Allow download this post</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div
                  className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                  onClick={toggledownload}
                ></div>
              </label>
            </div>

            {!isCreatingAd && !groupId &&
              <div className="flex justify-between items-center mt-4 border-t border-b border-gray-200 pt-4 pb-4 ps-2">
                <p className="text-gray-700">Promote Post</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div
                    className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                    onClick={togglePromote}
                  ></div>
                </label>
              </div>}

            <div className="mt-4 flex items-center gap-4 flex-wrap">
              {content.map((el, index) => {
                return (
                  <div key={index} className="relative">
                    {isVideo(el) ? (
                      <video
                        src={el}
                        autoPlay
                        muted
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        src={el}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <button
                      className="absolute top-1 right-1 bg-white p-1 rounded-full hover:bg-gray-200"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <Trash style={{ color: "red" }} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 mb-4">
              <SubmitBtn
                cta="Preview"
                isLoading={isUploading || completed !== 0}
                disable={isUploading || completed !== 0}
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
                handlclick={handlePreview}
                hoverColor="rgb(119, 21, 21)"
              />
            </div>
          </form>}

        {openLocationModal &&
          <BasicModal open={openLocationModal} setOpen={setOpenLocationModal}>
            <div className="p-4 px-8">
              <Title className="w-full text-center md:text-lg mt-5">
                Select Location
              </Title>
              <BootstrapTextField
                type="text"
                className="shadow-md my-3"
                fullWidth
                placeholder="Search Location"
                onChange={handlePlaceSearch}
                value={searchText}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon size={18} />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment className="cursor-pointer" position="end">
                    <XIcon onClick={handleClearLocationSearch} size={18} />
                  </InputAdornment>
                }
              />

              <div className="mt-4 flex flex-col gap-[6px] h-[260px] overflow-y-auto w-full fade">
                {loadingPlaces
                  ? <div className="flex items-center justify-center w-full h-full">
                    <CircularProgress />
                  </div>
                  : data?.place_getPlaces?.result?.items?.length
                    ? data?.place_getPlaces?.result?.items
                      ?.filter((el) => el?.location !== null)
                      ?.map((el, idx) => {
                        return (
                          <div
                            onClick={() => handleCitySelect(el?.location)}
                            key={idx}
                            className="capitalize cursor-pointer flex items-center gap-1"
                          >
                            <MapPinIcon size={16} className="text-black1" />
                            <Title className="md:text-base">{el?.location}</Title>
                          </div>
                        );
                      })
                    : <div className="flex items-center gap-1">
                      <MapPinIcon size={16} className="text-black1" />
                      <Title>No Location Found</Title>
                    </div>}
              </div>

              <SubmitBtn
                handlclick={() => handleCitySelect(searchText)}
                cta="Add Location"
                color="primary"
                varient="contained"
                fullWidth
                classname="bg-red1 mt-3"
                style={{ height: "46px", borderRadius: "12px" }}
                hoverColor="rgb(119, 21, 21)"
                isLoading={loading}
              />
            </div>
          </BasicModal>}

        {/* Edit Cover */}
        {openThumbNailModal &&
          <BasicModal
            open={openThumbNailModal}
            onClose={() => isValidURL(selectThumbNail) && isImage(selectThumbNail) && setOpenThumbNailModal(false)}
          >
            <div className="p-4 relative">
              <XIcon
                className="absolute top-2 right-2 text-black font-bold"
                onClick={() => isValidURL(selectThumbNail) && isImage(selectThumbNail) && setOpenThumbNailModal(false)} />
              <Title className="w-full text-center font-semibold md:text-lg mb-2">
                Edit cover
              </Title>

              <div className=" max-w-[86dvw]">
                <img
                  className="w-[400px] h-[300px] rounded-xl"
                  src={selectThumbNail ?? thumbnails[0]}
                  alt="Selected Thumbnail"
                />
                <div className="overflow-x-auto flex justify-start items-center gap-2 my-5">
                  <div className="min-w-[150px] h-[165px]">
                    <Uploader
                      onFileChange={(url) => setSelectThumbNail(url)}
                      hintText="Upload Thumbnail"
                      size="medium"
                    />
                  </div>
                  {thumbnails.map((el, idx) => (
                    <div key={idx}>
                      <img
                        className={`${el === selectThumbNail ? "border border-red1" : ""
                          } min-w-[165px] w-[165px] h-[165px] cursor-pointer rounded-xl object-cover`}
                        src={el}
                        alt=""
                        onClick={() => setSelectThumbNail(el)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <SubmitBtn
                handlclick={() => !isValidURL(selectThumbNail)
                  ? dataURLtoFile(selectThumbNail, "thumbnail.webp")
                  : setOpenThumbNailModal(false)}
                cta="Select"
                color="primary"
                varient="contained"
                fullWidth
                classname="bg-red1 mt-3"
                style={{ height: "46px", borderRadius: "12px" }}
                hoverColor="rgb(119, 21, 21)"
                isLoading={isUploading}
              />
            </div>
          </BasicModal>}
      </div>

      {showConfirmationModal &&
        <Modal open={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}>
          <div className="bg-white py-5 px-2 grid place-items-center text-center">
            <h2>Your creation of Post is in progress, you still want to exit?</h2>

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

      {showUserSuggestions &&
        <UserSuggestions
          show={showUserSuggestions}
          onClose={onCloseSuggestionsModal}
          excludeId={user?.user?.id!}
          searchTerm={searchTerm}
          onClick={onSuggestionClick}
        />}
    </div>
  );
});

export default CreatePostPage;
