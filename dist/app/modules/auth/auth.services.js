"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authServices = void 0;
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const prismaClient_1 = __importDefault(require("../../../shared/prismaClient"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config/config"));
const emailSender_1 = __importDefault(require("./emailSender"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const HTTPError_1 = require("../../errors/HTTPError");
const http_status_1 = __importDefault(require("http-status"));
// const loginUser = async (payload: { email: string; password: string }) => {
//   console.log(payload);
//   // const userData = await prisma.user.findUniqueOrThrow({
//   //   where: {
//   //     email: payload.email,
//   //     status: UserStatus.ACTIVE,
//   //   },
//   // });
//   const userData = await prisma.user.findUnique({
//     where: {
//       email: payload.email,
//       status:UserStatus.ACTIVE
//     },
//   });
//   if(!userData){
//     throw new HTTPError(httpStatus.BAD_REQUEST,'Email is not valid')
//   }
//   const isCorrectPassword: boolean = await bcrypt.compare(
//     payload.password,
//     userData.password
//   );
//   if (!isCorrectPassword) {
//     throw new Error("Password is incorrect!");
//   }
//   const accessToken = jwtHelpers.generateToken(
//     {
//       userId: userData.id,
//       name: userData.name,
//       email: userData.email,
//       role: userData.role,
//       profilePhoto: userData.profilePhoto,
//     },
//     config.jwt.jwt_secret as Secret,
//     config.jwt.expires_in as string
//   );
//   const refreshToken = jwtHelpers.generateToken(
//     {
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.refresh_token_secret as Secret,
//     config.jwt.refresh_token_expires_in as string
//   );
//   return {
//     accessToken,
//     refreshToken,
//     passwordChangeRequired: userData.passwordChangeRequired,
//   };
// };
// const refreshToken = async (token: string) => {
//   let decodedData;
//   try {
//     decodedData = jwtHelpers.verifyToken(
//       token,
//       config.jwt.refresh_token_secret as Secret
//     );
//   } catch (err) {
//     throw new Error("You are not authorized!");
//   }
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: decodedData.email,
//       status: UserStatus.ACTIVE,
//     },
//   });
//   const accessToken = jwtHelpers.generateToken(
//     {
//       userId: userData.id,
//       name: userData.name,
//       email: userData.email,
//       role: userData.role,
//       profilePhoto: userData.profilePhoto,
//     },
//     config.jwt.jwt_secret as Secret,
//     config.jwt.expires_in as string
//   );
//   return {
//     accessToken,
//   };
// };
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const userData = yield prismaClient_1.default.user.findUnique({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new HTTPError_1.HTTPError(http_status_1.default.BAD_REQUEST, 'Email is not valid');
    }
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Password is incorrect!');
    }
    const accessToken = jwtHelper_1.jwtHelpers.generateToken({
        userId: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        profilePhoto: userData.profilePhoto,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    console.log(accessToken);
    const refreshToken = jwtHelper_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
        passwordChangeRequired: userData.passwordChangeRequired,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new Error('You are not authorized!');
    }
    const userData = yield prismaClient_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
        },
    });
    const accessToken = jwtHelper_1.jwtHelpers.generateToken({
        userId: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        profilePhoto: userData.profilePhoto,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //@ checking if the user exist
    const userData = yield prismaClient_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    //@ checking if the provided old password is correct
    const isCorrectPassword = yield bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Password is incorrect!');
    }
    //@ hashing the new password
    const hashedPassword = yield bcrypt.hash(payload.newPassword, 10);
    //@ updating the password and also changing the passwordChangeRequired to false
    yield prismaClient_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            passwordChangeRequired: false,
        },
    });
    return {
        message: 'Password change successfully',
    };
});
const forgotPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email }) {
    //@ checking if the user exist
    const userData = yield prismaClient_1.default.user.findUniqueOrThrow({
        where: {
            email: email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    //@ creating a short time token
    const resetPasswordToken = jwtHelper_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.reset_password_token_secret, config_1.default.jwt.reset_token_expires_in);
    //@ generating a link to send via email
    let link = `${config_1.default.reset_pass_link}?Id=${userData.id}&token=${resetPasswordToken}`;
    //@ read HTML template file
    const htmlFilePath = path_1.default.join(process.cwd(), '/src/templates/reset_pass_template.html');
    const htmlTemplate = fs_1.default.readFileSync(htmlFilePath, 'utf8');
    const htmlContent = htmlTemplate.replace('{{resetPasswordLink}}', link);
    yield (0, emailSender_1.default)(userData.email, htmlContent);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prismaClient_1.default.user.findUnique({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!isUserExist) {
        throw new HTTPError_1.HTTPError(http_status_1.default.BAD_REQUEST, 'User not found!');
    }
    const isVarified = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_password_token_secret);
    if (!isVarified) {
        throw new HTTPError_1.HTTPError(http_status_1.default.UNAUTHORIZED, 'Something went wrong!');
    }
    const password = yield bcrypt.hash(payload.newPassword, Number(config_1.default.bycrypt_salt_rounds));
    yield prismaClient_1.default.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password,
        },
    });
});
exports.authServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
