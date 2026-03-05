import React from "react";
import { useFile } from "../store/FileContext";
import { sampleMarkdown } from "../features/MarkdownReader/data/sampleMarkdown";
import Layout from "../layouts/Layout";
import MarkdownReader from "../features/MarkdownReader/components/MarkdownReader";

const HomePage: React.FC = () => {
  const { currentFile } = useFile();
  const content = currentFile ? currentFile.content : sampleMarkdown;

  return (
    <Layout>
      <MarkdownReader content={content} />
    </Layout>
  );
};

export default HomePage;
