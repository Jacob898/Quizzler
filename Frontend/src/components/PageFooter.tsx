import { Layout, Divider } from "antd";
import {
  InstagramFilled,
  RedditCircleFilled,
  FacebookFilled,
} from "@ant-design/icons";
import { colors } from "../constants/colors.ts";

const { Footer } = Layout;

const PageFooter = () => {
  return (
    <Footer
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: colors.primary,
      }}
    >
      <div style={{ display: "flex", flex: 1, alignSelf: "center" }}>
        <a href="https://spinning-cat.vercel.app/">Regulamin</a>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        &copy; 2025 Quizzler
      </div>

      <div
        style={{
          fontSize: 30,
          padding: 1,
          flex: 1,
          display: "flex",
          justifyContent: "end",
          alignSelf: "center",
        }}
      >
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramFilled />
        </a>

        <Divider type="vertical" style={{ height: 30 }} />

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookFilled />
        </a>

        <Divider type="vertical" style={{ height: 30 }} />

        <a href="https://reddit.com" target="_blank" rel="noopener noreferrer">
          <RedditCircleFilled />
        </a>
      </div>
    </Footer>
  );
};

export default PageFooter;
