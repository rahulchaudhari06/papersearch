import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [papers, setPapers] = useState([]);
  const [visibleSummary, setVisibleSummary] = useState(null);

  const handleToggle = (index) => {
    setVisibleSummary(visibleSummary === index ? null : index);
  };

  const fetchPapers = async (numberOfResults) => {
    const response = await fetch(
      ` http://export.arxiv.org/api/query?search_query=all:(blockchain OR web3 OR "smart contracts" OR "decentralized finance" OR "cryptocurrency")&start=0&max_results=${numberOfResults}&sortBy=lastUpdatedDate&sortOrder=descending`
    );
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");

    renderPapers(xmlDoc);
  };

  const renderPapers = (xmldoc) => {
    const entries = Array.from(xmldoc.getElementsByTagName("entry"));
    const fetchedPapers = entries.map((entry) => ({
      title: entry.getElementsByTagName("title")[0].textContent,
      published: entry
        .getElementsByTagName("published")[0]
        .textContent.split("T")[0],
      pdfLink:
        entry.getElementsByTagName("id")[0].textContent.replace("abs", "pdf") +
        ".pdf",
      summary: entry.getElementsByTagName("summary")[0].textContent.trim(),
    }));
    setPapers(fetchedPapers);
  };

  useEffect(() => {
    fetchPapers(6);
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1 className="title-text">Discover the Latest Web3 Research</h1>
        <p className="info-text">
          Explore the latest research on Blockchain, Web3, DeFi, Crypto and
          more.
        </p>
        <hr />
      </header>

      <div className="content">
        {papers.map((paper, index) => (
          <div key={index} className="paper-card">
            <a href={paper.pdfLink} target="_blank" rel="noopener noreferrer">
              <h2 className="paper-title">{paper.title}</h2>
            </a>
            <p>Published: {paper.published}</p>
            <button
              className="toggle-button"
              onClick={() => handleToggle(index)}
            >
              {visibleSummary === index ? "Hide Summary" : "Show Summary"}
            </button>

            {visibleSummary === index && (
              <div className="hidden-text">{paper.summary}</div>
            )}
          </div>
        ))}
      </div>
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Rahul Chaudhari. All rights
          reserved.
        </p>
        <p>
          <a
            href="https://twitter.com/cipherotaku04"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{" "}
          |
          <a
            href="https://github.com/rahulchaudhari06"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
