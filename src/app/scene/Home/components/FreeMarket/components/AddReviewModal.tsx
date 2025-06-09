import { useState } from "react";
import { TextField, Button, Rating, Box, Typography, Modal } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import config from "@/config/index.dev";
import { getToken } from "@/http/graphql.client";
import { Review } from "@/app/scene/Home/components/FreeMarket/queries/getProductDetails";

interface AddReviewModalProps {
    productId?: string;
    userId?: number;
    open: boolean;
    handleClose: () => void;
    onAddReview: (review: Review) => void
};

const AddReviewModal = ({ productId, userId, open, handleClose, onAddReview }: AddReviewModalProps) => {
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (productId && userId) {
            if (!description.trim() || !rating) {
                enqueueSnackbar("Please fill out all fields", { variant: "warning", autoHideDuration: 3000 });
                return;
            };

            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("productId", productId.toString());
                formData.append("userId", userId.toString());
                formData.append("description", description.trim());
                formData.append("rating", rating.toString());

                const response = await fetch(`${config.apiUrl}/Product/AddProductReview`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${getToken()}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    onAddReview(data?.product);
                    enqueueSnackbar("Review added successfully", { variant: "success", autoHideDuration: 3000 });
                    setDescription("");
                    setRating(0);
                    handleClose();
                } else {
                    enqueueSnackbar("Failed to add review", { variant: "error", autoHideDuration: 3000 });
                };
            } catch (error) {
                enqueueSnackbar("An error occurred", { variant: "error", autoHideDuration: 3000 });
            } finally {
                setLoading(false);
                handleClose();
            };
        };
    };

    return (open
        ? <Modal open={open} onClose={() => handleClose()}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    minWidth: 300,
                    width: "90%",
                    maxWidth: 500,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Add a Review
                </Typography>
                <Rating
                    name="rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                />
                <TextField
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    disabled={loading}
                    fullWidth
                    className="border-none"
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </Button>
            </Box>
        </Modal>
        : null);
};

export default AddReviewModal;
