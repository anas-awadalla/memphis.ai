import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";

function CodeContainer({ code }) {
  return (
    <div
    // className={state.stepper_finish ? "codeOverflowFinish" : "codeOverflow"}
    >
      <SyntaxHighlighter language="python" style={monokaiSublime}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeContainer;
