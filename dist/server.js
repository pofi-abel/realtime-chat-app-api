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
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = __importDefault(require("./db/connect"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const uesr_route_1 = __importDefault(require("./routes/uesr.route"));
const not_found_middleware_1 = __importDefault(require("./middlewares/not-found.middleware"));
const error_handler_middleware_1 = __importDefault(require("./middlewares/error-handler.middleware"));
const socket_1 = require("./socket/socket");
const path_1 = __importDefault(require("path"));
const port = process.env.PORT || 4000;
const dirname = path_1.default.resolve();
dotenv_1.default.config();
socket_1.app.use(express_1.default.json());
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use("/api/auth", auth_route_1.default);
socket_1.app.use("/api/messages", message_route_1.default);
socket_1.app.use("/api/users", uesr_route_1.default);
socket_1.app.use(express_1.default.static(path_1.default.join(dirname, "/frontend/dist")));
socket_1.app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(dirname, "frontend", "dist", "index.html"));
});
socket_1.app.use(not_found_middleware_1.default);
socket_1.app.use(error_handler_middleware_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.default)();
        console.log("[DB]: Connected to MongoDB...");
        socket_1.server.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process on failure
    }
}))();
