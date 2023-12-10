"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./src/models/User"));
const crypto_1 = __importDefault(require("crypto"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
mongoose_1.default.connect("mongodb+srv://mahendra_gohil:King%40123@cluster0.b4x2uh5.mongodb.net/")
    .then(() => {
    console.log("connected mongo db");
})
    .catch(() => {
    console.log("error with connecttion");
});
app.listen(port, () => {
    console.log("server is running on", port);
});
const generateSecrateKey = () => {
    const secretKey = crypto_1.default.randomBytes(32).toString("hex");
    return secretKey;
};
const secretKey = generateSecrateKey();
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            });
        }
        if (user.password != password) {
            return res.status(404).json({
                message: "invalid credentials"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, secretKey);
        return res.status(200).json({ token });
    }
    catch (err) {
        return res.status(500).json({
            message: "Error" + JSON.stringify(err)
        });
    }
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_name, fullname, email, password } = req.body;
        const isUserExist = yield User_1.default.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({
                message: "Email already Exist!"
            });
        }
        const newUser = new User_1.default({
            user_name,
            fullname,
            email,
            password
        });
        newUser.token = crypto_1.default.randomBytes(20).toString("hex");
        yield newUser.save();
        sendVerificationEmail(newUser.email, newUser.token);
        res.status(200).json({
            message: "success !! please check your email for verification"
        });
    }
    catch (err) {
        res.status(500).json({
            message: JSON.stringify(err)
        });
    }
}));
const sendVerificationEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "mpgohilse@gmail.com",
            pass: "uned lvtc ziif brhd"
        }
    });
    const mailOptions = {
        from: "Threds app",
        to: email,
        subject: "email verificaiton",
        text: `here is the link please verify the email  http://localhost:8000/verify/${token}`
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (err) {
        console.log(JSON.stringify(err));
    }
});
app.get("/verify/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const user = yield User_1.default.findOne({ token });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist!"
            });
        }
        user.verified = true;
        user.token = undefined;
        yield user.save();
        return res.status(200).json({
            message: "User verified!"
        });
    }
    catch (err) {
        console.log(JSON.stringify(err));
        res.status(500).json({
            message: "Email verification failed"
        });
    }
}));
