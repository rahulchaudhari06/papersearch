import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [papers, setPapers] = useState([]);
  const [visibleSummary, setVisibleSummary] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("blockchain");
  const [loading, setLoading] = useState(false);

  const topics = [
    { label: "Blockchain", value: "blockchain" },
    { label: "Web3", value: "web3" },
    { label: "Smart Contracts", value: '"smart contracts"' },
    { label: "DeFi", value: '"decentralized finance"' },
    { label: "Cryptocurrency", value: "cryptocurrency" },
    {
      label: "Artificial Intelligence",
      value: '"artificial intelligence" OR AI',
    },
    { label: "Machine Learning", value: '"machine learning" OR ML' },
    { label: "Computer Science", value: '"computer science"' },
    {
      label: "Cybersecurity",
      value: "cybersecurity OR 'information security'",
    },
    { label: "Robotics", value: "robotics OR 'robot systems'" },
    { label: "Chemistry", value: "chemistry" },
    { label: "Biology", value: "biology OR 'life sciences'" },
    { label: "Physics", value: "physics" },
  ];

  const handleToggle = (index) => {
    setVisibleSummary(visibleSummary === index ? null : index);
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const fetchPapers = async (numberOfResults) => {
    setLoading(true); // Start loading
    const apiUrl = `https://export.arxiv.org/api/query?search_query=all:(${selectedTopic})&start=0&max_results=${numberOfResults}&sortBy=lastUpdatedDate&sortOrder=descending`;

    const response = await fetch(apiUrl);
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");

    renderPapers(xmlDoc);
    setLoading(false); // Stop loading
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
    fetchPapers(10);
  }, [selectedTopic]); // Refetch papers when the topic changes

  return (
    <div
      className="  dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] text-white min-h-screen "
      style={{
        WebkitMaskImage:
          "radial-gradient(circle, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)",
        maskImage:
          "radial-gradient(circle, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)",
        WebkitMaskSize: "cover%",
        maskSize: "cover%",
      }}
    >
      <div className="">
        <header className="text-center py-10 font-Aboreto">
          <h1 className="text-6xl sm:text-8xl font-bold">PaperSearch</h1>
          <p className="text-lg lg:text-3xl mt-4 text-gray-300">
            Explore the latest research on the topics you want!
          </p>
          <div className="mt-6">
            <label htmlFor="topic" className="text-gray-400 text-lg mr-4">
              Select Topic:
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={handleTopicChange}
              className="bg-black text-gray-300 border border-gray-600 rounded-lg p-2"
            >
              {topics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>
          <hr className="border-gray-700 mt-8 w-3/4 mx-auto" />
        </header>

        <main className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto ">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <ul className="space-y-6">
              {papers.map((paper, index) => (
                <li
                  key={index}
                  className="rounded-lg py-6 hover:shadow-lg transition-shadow "
                >
                  <div className="flex flex-col">
                    <a
                      href={paper.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg lg:text-2xl font-semibold  text-gray-300 hover:text-blue-300 transition-colors mb-2 flex flex-col font-Orbitron"
                    >
                      {paper.title}
                    </a>
                    <p className="text-sm text-gray-400 mb-4 flex flex-col">
                      Published: {paper.published}
                    </p>

                    <button
                      onClick={() => handleToggle(index)}
                      className=" flex items-center rounded-md border border-slate-600 py-2  text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-black hover:border-slate-800 focus:text-white focus:bg-black focus:border-slate-800 active:border-slate-800 active:text-white active:bg-black disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none max-w-40 pb-2 "
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 ml-1.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {visibleSummary === index
                        ? "Hide Summary"
                        : "Show Summary"}
                    </button>
                    {visibleSummary === index && (
                      <div
                        className="mt-4 text-gray-300  border-t border-gray-700 pt-4 text-lg font-Neighbor"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        {paper.summary}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>

        <footer className="text-center py-8 border-t border-gray-800 mt-12">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Rahul Chaudhari. All rights
            reserved.
          </p>
          <p className="mt-2">
            <a
              href="https://twitter.com/cipherotaku04"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 mx-2"
            >
              Twitter
            </a>
            |
            <a
              href="https://github.com/rahulchaudhari06"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 mx-2"
            >
              GitHub
            </a>
            |
            <a
              href="https://www.linkedin.com/in/rahul-chaudhari-2a45832aa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 mx-2"
            >
              Linkedin
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
