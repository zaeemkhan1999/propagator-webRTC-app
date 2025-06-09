import { useState, useRef, useEffect } from 'react';
import { RenderStory } from './StoryViewer';
import { MyStory } from '../queries/getMyStories';
import { useLocation, useNavigate } from 'react-router';
import { Avatar, IconButton, Dialog, Menu, MenuItem, CircularProgress } from '@mui/material';
import { DaysAgo } from '@/app/utility/misc.helpers';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSnapshot } from 'valtio';
import { userStore } from '@/store/user';
import { StoryTypes, useCreateMyStory } from '../mutation/createMyStory';
import { useUpdateStory } from '../mutation/editStory';
import Draggable from "react-draggable";
import Done from '@/assets/icons/done';
import ArrowLeft from '@/assets/icons/ArrowLeft';
import Trash from '@/assets/icons/IconTrash';
import ArrowsMoveIcon from '@/assets/icons/ArrowsMove';
import CircleCheckIcon from '@/assets/icons/CircleCheck';
import LetterCaseIcon from '@/assets/icons/LetterCase';
import PaletteIcon from '@/assets/icons/Pallet';

export interface StoryEditorProps<T extends boolean = false> {
    story: T extends true
    ? {
        contentAddress: File,
        storyType: StoryTypes.IMAGE | StoryTypes.VIDEO,
        textPositionX?: string,
        textPositionY?: string,
        textStyle?: string,
    }
    : MyStory;
    isNew?: T;
};

const textColorPalleteOptions = [
    {
        key: "white-text-on-black",
        label: "White Text on Black"
    },
    {
        key: "black-text-on-white",
        label: "Black Text on White"
    },
];

const StoryEditor = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { props }: { props: StoryEditorProps } = state || {};

    const goback = () => navigate('/specter/inbox');

    useEffect(() => {
        if (!state || !props) goback();
        else setTimeout(() => setIsMounted(true), 300);
    }, []);

    const user = useSnapshot(userStore.store).user;

    const textRef = useRef<HTMLDivElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const [text, setText] = useState(props?.story?.text || '');
    const [textPosition, setTextPosition] = useState({
        x: props?.story?.textPositionX ? Number(props?.story?.textPositionX) : 0,
        y: props?.story?.textPositionY ? Number(props?.story?.textPositionY) : 0,
    });
    const [isEditing, setIsEditing] = useState(Boolean(props?.story?.text));
    const [textStyle, setTextStyle] = useState(props?.story?.textStyle ?? 'black-text-on-white');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dragging, setDragging] = useState(false);
    const [intersecting, setIntersecting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const element = document?.querySelector('#caption-text');
        if (isMounted && props?.story?.text && element) {
            element.innerHTML = props?.story?.text;
        };
    }, [isMounted]);

    const handleTextClick = (e: React.MouseEvent) => {
        const isDeleteIcon = (e.target as HTMLElement).closest('#delete-icon');
        if ((textRef?.current?.contains(e.target as Node)) || isDeleteIcon) return;

        const viewportHeight = window.innerHeight;
        const centerX = 15;
        const centerY = viewportHeight / 2;
        setTextPosition({ x: centerX, y: centerY });
        textRef.current?.focus();
        setIsEditing(true);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const changeTextStyle = (style: string) => {
        setTextStyle(style);
        handleMenuClose();
    };

    const handleTextChange = (e: React.FormEvent | null, newText: string = '') => {
        if (e) {
            const target = e.target as HTMLElement;
            if (textRef.current) {
                setText(target.innerText);
            };
        } else {
            setText(newText);
        }
    };

    const handleDrag = (e: any, data: any) => {
        setTextPosition({ x: data.x, y: data.y });
        const deleteBin = document.getElementById("delete-bin");
        if (deleteBin) {
            const deleteBinRect = deleteBin.getBoundingClientRect();
            const textRect = {
                x: data.x,
                y: data.y,
                width: 100,
                height: 30,
            };
            const isIntersecting =
                textRect.x + textRect.width > deleteBinRect.left &&
                textRect.x < deleteBinRect.right &&
                textRect.y + textRect.height > deleteBinRect.top &&
                textRect.y < deleteBinRect.bottom;
            setIntersecting(isIntersecting);
        }
    };

    const handleDragStart = () => {
        setDragging(true);
    };

    const handleDragStop = (e: any) => {
        setDragging(false);
        if (intersecting) {
            handleDelete(e);
        };
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(false);
        setText('');
        setTextPosition({ x: 0, y: 0 });
    };

    const { createMyStory, loading: creating } = useCreateMyStory();
    const { updateStory, loading: updating } = useUpdateStory();

    const handleApply = () => {
        if (props?.isNew) {
            !creating &&
                createMyStory(
                    {
                        text,
                        textPositionX: textPosition.x.toString(),
                        textPositionY: textPosition.y.toString(),
                        textStyle,
                    },
                    [props?.story?.contentAddress as any],
                    goback
                );
        } else {
            text && !updating && updateStory({
                id: props?.story?.id,
                text,
                textPositionX: textPosition.x.toString(),
                textPositionY: textPosition.y.toString(),
                textStyle,
                storyType: props?.story?.storyType,
                contentAddress: props?.story?.contentAddress
            },
                goback
            );
        }
    };

    return (
        <Dialog fullScreen open onClose={goback}>
            <div ref={dialogRef} className="relative overflow-hidden w-full h-full flex bg-black">
                <div className='flex items-center justify-between w-full absolute top-0 left-0 z-50'>
                    <div className='flex items-center gap-2 py-2'>
                        <IconButton color="inherit" onClick={goback}>
                            <ArrowLeft className="text-white z-50" />
                        </IconButton>
                        <div className='flex items-center gap-2'>
                            <Avatar aria-label="recipe" className={`border ${!user?.imageAddress && "bg-gray-200 text-black text-sm"}`}>
                                {user?.imageAddress
                                    ? <LazyLoadImage src={user?.imageAddress} />
                                    : <p className='uppercase'>{user?.username?.slice(0, 1)}</p>}
                            </Avatar>
                            <div className='text-white'>
                                <p className='mt-2' style={{ lineHeight: "0.6" }}>{user?.username}</p>
                                <small>{DaysAgo(props?.story?.createdDate)}</small>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center pe-2'>
                        <IconButton onClick={isEditing
                            ? handleDelete
                            : handleTextClick}
                        >
                            <LetterCaseIcon className="text-white" />
                        </IconButton>

                        {isEditing && <IconButton onClick={handleMenuClick}>
                            <PaletteIcon color="white" className="!text-white" />
                        </IconButton>}

                        {((props?.isNew) || (!props?.isNew && text)) &&
                            <IconButton className='!text-white cursor-pointer' title={(props?.isNew ? 'Share' : 'Update') + ' Story'} onClick={handleApply}>
                                {(creating || updating)
                                    ? <CircularProgress size={20} className='animate-spin' />
                                    : <CircleCheckIcon />}
                            </IconButton>}
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-full flex justify-between">
                    <div className="w-full h-full snap-center overflow-hidden flex justify-center items-center">
                        <RenderStory story={props?.story} isNew={props?.isNew} />
                    </div>

                    {isEditing && (
                        <Draggable
                            defaultPosition={{ x: textPosition.x, y: textPosition.y }}
                            onDrag={(e, data) => handleDrag(e, data)}
                            handle="#move"
                            onStop={handleDragStop}
                            onStart={handleDragStart}
                        >
                            <div
                                className="absolute"
                                style={{
                                    color: textStyle === "black-text-on-white" ? "black" : "white",
                                    backgroundColor: textStyle === "black-text-on-white" ? "white" : "black",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    fontSize: "15px",
                                    width: "fit-content",
                                    opacity: 0.85,
                                    overflowWrap: "break-word",
                                }}
                            >
                                <p
                                    id='caption-text'
                                    ref={textRef}
                                    className="relative"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onClick={(e) => e.stopPropagation()}
                                    onInput={handleTextChange}
                                    style={{
                                        border: "none",
                                        outline: "none",
                                        background: "transparent",
                                        color: "inherit",
                                        fontSize: "16px",
                                        resize: "none",
                                        minWidth: "100px",
                                        whiteSpace: "normal",
                                        maxWidth: "80vw",
                                        overflowWrap: "break-word",
                                        height: "auto",
                                        width: "auto",
                                        textAlign: "center"
                                    }}
                                />

                                <IconButton
                                    id="move"
                                    className="text-white z-[9999] h-6 w-6 flex items-center p-0 justify-center bg-gray-700 cursor-pointer absolute -top-3 -left-3"
                                    title="Move"
                                >
                                    <ArrowsMoveIcon className="text-white" size={15} />
                                </IconButton>
                            </div>
                        </Draggable>
                    )}
                </div>
                <div
                    id="delete-bin"
                    className={`absolute left-1/2 transform -translate-x-1/2 ${intersecting ? "w-14 h-14" : "w-10 h-10"}  bg-gray-800 flex items-center justify-center rounded-full`}
                    style={{
                        borderRadius: "50%",
                        bottom: dragging ? 10 : "-100%",
                        transition: "all 0.5s ease-in-out",
                    }}
                >
                    <Trash size={intersecting ? 40 : 30} className="text-white" />
                </div>
            </div>

            {Boolean(anchorEl) &&
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}

                >
                    {textColorPalleteOptions.map((option) => (
                        <MenuItem
                            key={option.key}
                            onClick={() => changeTextStyle(option.key)}
                        >
                            <div className="flex items-center justify-between w-full gap-2">
                                <div className={`${option.key === "white-text-on-black" ? "text-white bg-black" : "text-black bg-white "} shadow-lg p-2 rounded-xl`}>
                                    <LetterCaseIcon className="text-white" size={22} />
                                </div>
                                <span>
                                    {option.key === textStyle ? (
                                        <Done className='text-green-500' size={20} />
                                    ) : null}
                                </span>
                            </div>
                        </MenuItem>
                    ))}
                </Menu>}
        </Dialog>
    );
};

export default StoryEditor;
