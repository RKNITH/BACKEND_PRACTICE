import app from "./app.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv"

dotenv.config()

const port = process.env.PORT || 3000;
cloudinary.v2.config({
    cloud_name: process.env.CLOUDIANRY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.envCLOUDINARY_API_SECRET,
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
