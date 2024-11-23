import { useState, useEffect } from "react";
import "./index.css";
import topics from "./topics";

function App() {
  const [papers, setPapers] = useState([]);
  const [visibleSummary, setVisibleSummary] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("web3");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = (index) => {
    setVisibleSummary(visibleSummary === index ? null : index);
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const fetchPapers = async (numberOfResults) => {
    setLoading(true);
    const query = searchQuery ? searchQuery : selectedTopic; // Prioritize searchQuery over selectedTopic
    const apiUrl = `https://export.arxiv.org/api/query?search_query=all:(${query})&start=0&max_results=${numberOfResults}&sortBy=lastUpdatedDate&sortOrder=descending`;

    const response = await fetch(apiUrl);
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");

    renderPapers(xmlDoc);
    setLoading(false);
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
  }, [selectedTopic, searchQuery]);

  return (
    <div className="bg-black bg-grid-small-white/[0.25] text-white min-h-screen">
      <div className="container mx-auto px-4">
        <header className="text-center py-6 md:py-10 font-Aboreto">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight">
            PaperSearch
          </h1>
          <p className="text-base md:text-lg lg:text-3xl mt-2 md:mt-4 text-gray-300">
            Explore the latest research on the topics you want!
          </p>

          {/* Responsive search controls */}
          <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-4 mt-6 px-4">
            <div className="w-full md:w-auto">
              <label
                htmlFor="searchQuery"
                className="text-gray-400 text-sm md:text-lg block md:inline mb-2 md:mb-0 md:mr-4"
              >
                Search Papers:
              </label>
              <input
                id="searchQuery"
                type="text"
                placeholder="Enter keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-auto bg-black text-gray-300 border border-gray-600 rounded-lg p-2"
              />
            </div>

            <div className="w-full md:w-auto">
              <label
                htmlFor="topic"
                className="text-gray-400 text-sm md:text-lg block md:inline mb-2 md:mb-0 md:mr-4"
              >
                Select Topic:
              </label>
              <select
                id="topic"
                value={selectedTopic}
                onChange={handleTopicChange}
                className="w-full md:w-auto bg-black text-gray-300 border border-gray-600 rounded-lg p-2"
              >
                {topics.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-gray-700 mt-6 md:mt-8 w-11/12 md:w-3/4 mx-auto" />
        </header>

        <main className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <ul className="space-y-4 md:space-y-6">
              {papers.map((paper, index) => (
                <li
                  key={index}
                  className="rounded-lg py-4 md:py-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col">
                    <a
                      href={paper.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base md:text-lg lg:text-2xl font-semibold text-gray-300 hover:text-blue-300 transition-colors mb-2 font-Orbitron line-clamp-2 md:line-clamp-none"
                    >
                      {paper.title}
                    </a>
                    <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-4">
                      Published: {paper.published}
                    </p>

                    <button
                      onClick={() => handleToggle(index)}
                      className="w-32 md:w-40 pl-2 flex items-center justify-center rounded-md border border-slate-600 py-2 text-xs md:text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-black hover:border-slate-800 focus:text-white focus:bg-black focus:border-slate-800"
                      type="button"
                    >
                      {visibleSummary === index
                        ? "Hide Summary"
                        : "Show Summary"}
                    </button>

                    {visibleSummary === index && (
                      <div
                        className="mt-3 md:mt-4 text-gray-300 border-t border-gray-700 pt-3 md:pt-4 text-sm md:text-lg font-Neighbor"
                        style={{ maxHeight: "150px", overflowY: "auto" }}
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

        <footer className="text-center py-6 md:py-8 border-t border-gray-800 mt-8 md:mt-12">
          <p className="text-gray-500 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Rahul Chaudhari. All rights
            reserved.
          </p>
          <p className="mt-2 text-sm md:text-base">
            <a
              href="https://twitter.com/cipherotaku04"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group text-slate-400 hover:text-blue-500 mx-2"
            >
              <i className="fab fa-twitter text-2xl"></i>
              <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-500">
                X
              </span>
            </a>
            |
            <a
              href="https://github.com/rahulchaudhari06"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group text-slate-400 hover:text-blue-500 mx-2"
            >
              <i className="fab fa-github text-2xl"></i>
              <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-500">
                GitHub
              </span>
            </a>
            |
            <a
              href="https://www.linkedin.com/in/rahul-chaudhari-2a45832aa"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group text-slate-400 hover:text-blue-500 mx-2"
            >
              <i className="fab fa-linkedin text-2xl"></i>
              <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-500">
                LinkedIn
              </span>
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
