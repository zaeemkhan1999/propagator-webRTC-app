import { useEffect, useRef, useState } from "react";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, ImageList, ImageListItem, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { IconCamera, IconTrash } from "@tabler/icons-react";
import useCreateProduct from "./mutation/CreateProduct";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import { Image, ProdDetail } from "@/app/scene/Home/components/FreeMarket/queries/getProductDetails";
import useUpdateProduct from "./mutation/updateProduct";

interface Product {
    id: null | number;
    name: string;
    description: string;
    images: Image[];
    stock: string;
    price: string;
    currency: string;
};

const currencies = [{ value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "GBP", label: "GBP" }, { value: "CAD", label: "CAD" }, { value: "INR", label: "INR" }];

interface Props {
    editProductData?: ProdDetail;
    setEditProductData?: Function;
    onEditProduct?: Function;
};

const CreateProductPage = ({ editProductData, setEditProductData, onEditProduct }: Props) => {
    const navigate = useNavigate();
    const userId = useSnapshot(userStore.store).user?.id;

    const goBack = () => !editProductData ? navigate('/specter/home') : setEditProductData?.(null);

    const imageRef = useRef<HTMLInputElement | null>(null);

    const [product, setProduct] = useState<Product>({
        id: null,
        name: "",
        description: "",
        images: [],
        stock: "",
        price: "",
        currency: "USD",
    });
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImages, setDeletedImages] = useState<number[]>([]);

    useEffect(() => {
        if (editProductData) {
            const { id, name, description, images, stock, price, currency } = editProductData;
            setProduct({ id, name, description, images, stock: String(stock), price: String(price), currency });
        };
    }, [editProductData]);

    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files?.length) {
            const imagesArray = Array.from(files);
            if ([...product.images, ...imagesArray].length < 3 || imagesArray.length > 10) {
                setErrors({ images: "Please upload between 3 to 10 images." });
            } else {
                setNewImages([...newImages, ...imagesArray]);

                const imgs: Image[] = [];
                imagesArray.forEach(img => {
                    const url = URL.createObjectURL(img);
                    imgs.push({ id: 0, url });
                });

                setProduct(prev => ({ ...prev, images: [...prev.images, ...imgs] }));
                setErrors({ images: "" });
            };
        };

        if (imageRef.current) {
            imageRef.current.value = "";
        };
    };

    const handleDeleteImage = (index: number) => {
        const updatedImages = [...product.images];
        const deletedImage = updatedImages.splice(index, 1);
        setProduct({ ...product, images: updatedImages });

        if (editProductData && deletedImage[0]?.id !== 0) {
            setDeletedImages(prev => [...prev, deletedImage[0]?.id]);
        };
    };

    const validateProduct = (): boolean => {
        let validationErrors: any = {};

        if (!product.name) validationErrors.name = "Name is required.";

        if (!product.description) validationErrors.description = "Description is required.";

        if (product.images.length < 3 || product.images.length > 10)
            validationErrors.images = "Please upload between 3 to 10 images.";

        if (!product.stock || isNaN(Number(product.stock)))
            validationErrors.stock = "Enter a valid stock.";

        if (!product.price || isNaN(Number(product.price)))
            validationErrors.price = "Enter a valid price.";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return false;
        };

        setErrors({});
        return true;
    };

    const generatePayload = () => {
        const fd = new FormData();

        fd.append('sellerId', String(userId!));
        fd.append('name', product.name);
        fd.append('description', product.description);
        fd.append('stock', product.stock);
        fd.append('price', product.price);
        fd.append('currency', product.currency);

        if (editProductData) {
            fd.append('id', String(product?.id));

            newImages.length && newImages.forEach((file) => {
                fd.append(`images`, file);
            });
            deletedImages.length && deletedImages.forEach((imgId) => {
                fd.append(`productImageIds`, String(imgId));
            });
        } else {
            newImages.forEach((file) => {
                fd.append(`images`, file);
            });
        };

        return fd;
    };

    const { createProduct, loading: creatingProduct } = useCreateProduct();
    const { updateProduct, loading: updatingProduct } = useUpdateProduct();

    const handleSubmit = () => {
        if (validateProduct()) {
            const payload = generatePayload();

            if (editProductData) {
                !updatingProduct && updateProduct(payload, onEditProduct);
            } else {
                !creatingProduct && createProduct(payload, () => {
                    navigate('/specter/profile?Tab=Market');
                });
            };
        };
    };

    return (
        <div className="max-w-xl bg-white h-dvh pb-20 overflow-y-auto shadow-md rounded-lg">
            <Header
                text={`${editProductData ? 'Edit' : 'Create'} Product`}
                handleBack={goBack}
                textColor="text-gray-700"
            />

            <div className="p-4 space-y-4">
                <TextField
                    label="Name"
                    name="name"
                    required
                    fullWidth
                    value={product.name}
                    onChange={(e) => handleChange(e as any)}
                    error={!!errors.name}
                    helperText={errors.name}

                />
                <div>
                    <TextField
                        label="Description"
                        required
                        onInput={(e) => handleChange(e as any)}
                        name="description"
                        fullWidth
                        multiline
                        error={!!errors.description}
                        rows={5}
                        placeholder="Enter product description"
                        value={product.description}
                        helperText={errors.description}
                    />
                </div>

                <div className="text-center">
                    <input
                        accept="image/*"
                        id="image-upload"
                        multiple
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                        ref={imageRef}
                    />

                    <Button variant="contained" component="span" color="primary" startIcon={<IconCamera />} onClick={() => imageRef.current?.click()} >
                        Select Images
                    </Button>

                    {errors.images && <Typography color="error">{errors.images}</Typography>}

                    {product.images.length > 0 && (
                        <ImageList cols={3} rowHeight={120} sx={{ mt: 2 }}>
                            {product.images.map((img, index) => (
                                <ImageListItem key={index}>
                                    <img src={img?.url} alt={`Selected ${index}`} loading="lazy" style={{ borderRadius: "8px", height: "120px", width: "120px" }} />
                                    <IconButton
                                        sx={{ position: "absolute", top: 5, right: 5, color: "white", backgroundColor: "rgba(0,0,0,0.5)" }}
                                        onClick={() => handleDeleteImage(index)}
                                    >
                                        <IconTrash />
                                    </IconButton>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )}
                </div>

                <TextField
                    label="Stock"
                    name="stock"
                    fullWidth
                    error={!!errors.stock}
                    value={product.stock}
                    onChange={(e) => handleChange(e as any)}
                    helperText={errors.stock}
                    className="mb-3"
                />

                <TextField
                    label="Price"
                    name="price"
                    fullWidth
                    value={product.price}
                    onChange={(e) => handleChange(e as any)}
                    error={!!errors.price}
                    helperText={errors.price}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {product.currency === "USD" && "$"}
                                {product.currency === "EUR" && "€"}
                                {product.currency === "GBP" && "£"}
                                {product.currency === "CAD" && "CA$"}
                                {product.currency === "INR" && "₹"}
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl fullWidth className="my-3">
                    <InputLabel>Currency</InputLabel>
                    <Select
                        name="currency"
                        value={product.currency}
                        onChange={(e) => handleChange(e as any)}
                        label="Currency"
                    >
                        {currencies.map(c => (
                            <MenuItem key={c.value} value={c.value}>
                                {c.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button disabled={creatingProduct || updatingProduct} variant="contained" className="bg-red-700 !border-none !rounded-xl !h-[56px]" fullWidth onClick={handleSubmit}>
                    {(creatingProduct || updatingProduct) ? <CircularProgress className="text-white" size={25} /> : `${editProductData ? 'Edit' : 'Create'} Product`}
                </Button>
            </div>
        </div>
    );
};

export default CreateProductPage;
