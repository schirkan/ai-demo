import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { B as BackgroundPattern } from "./router-DRB5njeR.js";
import "@tanstack/react-router-devtools";
import "@tanstack/react-devtools";
import "react";
import "react-icons/bs";
import "ai";
import "@ai-sdk/react";
import "react-markdown";
import "remark-gfm";
import "react-speech-recognition";
import "siriwave";
import "react-dom";
import "react-icons/lu";
import "react-text-to-speech";
import "react-icons/hi2";
import "@ai-sdk/azure";
import "socket.io";
import "uuid";
import "zod";
import "fs";
import "https";
import "querystring";
import "http";
function Home() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BackgroundPattern, { styleName: "grid-fade-sides" }),
    /* @__PURE__ */ jsxs("div", { style: {
      width: "fit-content",
      margin: "10rem auto 0"
    }, children: [
      /* @__PURE__ */ jsx("h1", { style: {
        textAlign: "center",
        margin: "1rem"
      }, children: "AI Demo" }),
      /* @__PURE__ */ jsxs("ol", { style: {
        listStyle: "decimal",
        paddingLeft: "revert"
      }, children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/chat-basic", children: "AI Chat (Basic)" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/chat-ui-sample", children: "Chat UI Sample" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/chat-tts", children: "AI Chat (Voice)" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/image", children: "Image Generation" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/chat-custom-gpt", children: "AI Chat (Custom GPTs)" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/chat-persistence", children: "AI Chat (Persistence)" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/quizshow", children: "Quizshow" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/buzzer", children: "Buzzer (Multiplayer Demo)" }) })
      ] })
    ] })
  ] });
}
export {
  Home as component
};
