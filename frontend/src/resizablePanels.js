import React from "react";
import SplitPane from "react-split-pane";
import { Layout } from "antd";

const MainSplitPanelsTwoSides = ({ left, right, minWidth, maxWidth, defaultWidth }) => {
    return (
        <SplitPane
            split="vertical"
            minSize={minWidth}
            defaultSize={defaultWidth}
            maxSize={maxWidth} // Allows panels to be resized up to a maximum width from the right
            style={{ position: "relative" }} // Ensure SplitPane occupies full height
            resizerStyle={{
                background: "#aaa",
                cursor: "col-resize",
                width: "4px",
                marginLeft: '3px',
                marginRight: '3px',
                border: '1px solid gray',
                borderRadius: '2px'
            }} // Custom resizer style
        >
            {left}
            {right}
        </SplitPane>
    );
};

export default MainSplitPanelsTwoSides;
