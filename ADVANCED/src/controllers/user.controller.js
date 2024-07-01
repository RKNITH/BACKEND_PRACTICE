import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "something went wrong while generating and  accessing token")

    }
}




const registerUser = asyncHandler(async (req, res) => {
    // STEPS:
    // GET USER DETAILS FROM FRONTEND:

    const { fullName, email, username, password } = req.body;


    //VALIDATION:

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required")
    }

    // CHAECK IF USER ALREADY EXISTS:

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email orusername already exists")
    }

    // CHAECK FOR IMAGES , CHECK FOR AVATAR:

    const avatartLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.file?.coverImage[0]?.path;

    if (!avatartLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // UPLOAD THEM TO CLOUDINARY:

    const avatar = await uploadOnCloudinary(avatartLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // CREAATE USER OBJECT--CREATE ENTRY IN DB:

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()
    })

    // REMOVE PASSWORD AND AND REFRESH TOKEN FIELD:
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // CHECK FOR USER CREATION:

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // RETURN RES:

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )






















})

const loginUser = asyncHandler(async (req, res) => {
    // steps:
    // DATA ACCESS:
    const { email, username, password } = req.body;

    // USERNAME OR EMAIL:
    if (!username || !email) {
        throw new ApiError(400, "username or password is required")
    }

    // FIND THE USER:
    const user = await User.findOne({
        $or: [{ username, email }]
    })
    if (!user) {
        throw new ApiError(404, "user is not available")
    }

    //PASSWORD CHECK:
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "password is not correct")
    }

    //ACCESS AND REFRESH TOKEN:
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    //SEND COOKIE:
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )



})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).
        clearCookie("refreshToken", options).
        json(new ApiResponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingTefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingTefreshToken) {
        throw new ApiError(401, "unauthorized access")
    }
    const decodedToken = jwt.verify(incomingTefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)
    if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }
    if (incomingTefreshToken != user?.refreshToken) {
        throw new ApiError(401, "refresh token is expired or used")
    }

    const options = {
        httpOnly: true,
        secure: true
    }
    const { accessToken, newrefreshToken } = generateAccessAndRefreshTokens(user._id)
    return res.status(200).cookie('accessToken', accessToken).
        cookie("refreshToken", newrefreshToken).json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newrefreshToken },
                "Access token refreshed"
            )
        )


})

export { registerUser, loginUser, logoutUser, refreshAccessToken }