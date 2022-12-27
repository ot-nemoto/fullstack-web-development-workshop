/*
【執筆メモStart】
http://localhost:3000/hello_without_jsx で表示します。
【執筆メモEnd】
*/
import React from "react";
export default function Page() {
  return React.createElement('h1', null, `Hello, Next.js!`);
}
