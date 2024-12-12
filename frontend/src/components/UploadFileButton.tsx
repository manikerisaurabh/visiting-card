import React, { useState } from "react";
import axios from "axios";

const UploadFileButton: React.FC = () => {
    const preset_key = "visiting-card";
    const cloud_name = "dump4bxcm";
    const [image, setImage] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.log("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset_key);

        axios
            .post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData)
            .then((res) => {
                console.log(res.data);
                setImage(res.data.secure_url); // Save uploaded image URL
            })
            .catch((err) => console.error("Upload error: ", err));
    };

    return (
        <div>
            <label htmlFor="file-upload" className="file-upload-label">
                Upload Image
            </label>
            <input
                id="file-upload"
                type="file"
                name="image"
                onChange={handleFile}
                style={{ display: "none" }}
            />
            {image && <img src={image} alt="Uploaded Preview" style={{ marginTop: "20px", width: "200px" }} />}
        </div>
    );
};

export default UploadFileButton;
