import React from "react";
import SplitPane from "react-split-pane";
import { Layout } from "antd";

const MainSplitPanelsTwoSides = ({ left, right, minWidth, maxWidth }) => {
    return (
        <Layout>
            <SplitPane
                split="vertical"
                minSize={minWidth}
                defaultSize={maxWidth}
                maxSize={maxWidth} // Allows panels to be resized up to a maximum width from the right
                style={{ position: "relative" }} // Ensure SplitPane occupies full height
                resizerStyle={{
                    background: "#000",
                    cursor: "col-resize",
                    width: "3px",
                    marginLeft: '3px',
                    marginRight: '3px',
                    border: '1px solid gray',
                    borderRadius: '2px'
                }} // Custom resizer style
            >
                {left}
                {right}
            </SplitPane>
        </Layout>
    );
};

export default MainSplitPanelsTwoSides;
