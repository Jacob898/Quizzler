import { Card } from "antd";
import React, { useState } from "react";
// import { quiz_info } from "../types/types";

interface CustomCardProps {
    title: string;
    description?: string;
    image: string;
}

const CustomCard = ({ title, description, image }: CustomCardProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div>
            <Card
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                hoverable
                cover={<img alt={title} src={image} />}
                style={{
                    // transition: "0.3s",
                    position: "relative",
                    // filter: hovered ? "brightness(70%)" : "brightness(100%)",
                }}
            >
                {title}
                {/* {hovered && description && ( */}
                <div
                    style={{
                        position: "absolute",
                        top: "-1px",
                        left: "-1px",
                        width: "calc(100% + 2px)",
                        height: "calc(100% + 2px)",
                        borderRadius: "8px",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "#fff",
                        display: hovered ? "flex" : "none",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "0.3s",
                        fontSize: "20px",
                    }}
                >
                    {description}
                </div>
                {/* )} */}
            </Card>
        </div>
    );
};

export default CustomCard;
