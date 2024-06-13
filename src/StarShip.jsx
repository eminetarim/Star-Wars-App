import { useEffect, useState } from "react";
import axios from "axios";

function StarShip() {
  const [starShips, setStarShips] = useState([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [filteredStarShips, setFilteredStarShips] = useState("");
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedShip, setSelectedShip] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const filtered = starShips.filter((starShip) => {
    return (
      (starShip.name &&
        starShip.name
          .toLowerCase()
          .includes(filteredStarShips.toLowerCase())) ||
      (starShip.model &&
        starShip.model.toLowerCase().includes(filteredStarShips.toLowerCase()))
    );
  });

  const fetchStarShips = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `https://swapi.dev/api/starships/?page=${page}`
      );
      setStarShips((prevStarShips) => [
        ...prevStarShips,
        ...response.data.results,
      ]);
      setIsLastPage(response.data.next);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching starships:", error);
      setLoading(false);
    }
  };

  const searchStarShips = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `https://swapi.dev/api/starships/?search=${searchText}`
      );
      setStarShips(response.data.results);
      setIsLastPage(response.data.next);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching starships:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStarShips();
  }, [page]);

  useEffect(() => {
    searchStarShips();
  }, [searchText]);

  const handleDetailsClick = (ship) => {
    setSelectedShip(ship);
    setIsVisible(false);
  };

  const handleCloseDetails = () => {
    setSelectedShip(null);
    setIsVisible(true);
  };

  const getMoreStarShip = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      <h1>Star Wars Starships</h1>

      {isVisible && (
        <input
          placeholder="Filter by Name & Model..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      )}

      {isVisible && (
        <div className="card-container">
          {filtered.map((starShip, index) => (
            <div key={`${starShip.name + index}`} className="card">
              <img
                src="https://img.redbull.com/images/q_auto,f_auto/redbullcom/2017/09/20/0bba35af-bf8c-4296-8cbd-1e4ccedfcc6a/star-wars-spaceships-millennium-falcon"
                alt={starShip.name}
                className="ship-image"
              />
              <h2>{starShip.name}</h2>
              <p>
                <span>Model:</span> {starShip.model}
              </p>
              <p>
                <span> Hyperdrive Rating:</span> {starShip.hyperdrive_rating}
              </p>
              <button
                className="details"
                onClick={() => handleDetailsClick(starShip)}
              >
                Details
              </button>
            </div>
          ))}
        </div>
      )}
      {isLastPage && (
        <button className="more-btn" onClick={getMoreStarShip}>
          {loading ? <div>Loading...</div> : "More"}
        </button>
      )}

      {selectedShip && (
        <div className="details-overlay">
          <div className="details-card">
            <img
              src="https://img.redbull.com/images/q_auto,f_auto/redbullcom/2017/09/20/0bba35af-bf8c-4296-8cbd-1e4ccedfcc6a/star-wars-spaceships-millennium-falcon"
              alt={selectedShip.name}
              className="ship-image"
            />
            <h2>{selectedShip.name}</h2>
            <p>
              <span>Model:</span> {selectedShip.model}
            </p>
            <p>
              <span>Hyperdrive Rating:</span> {selectedShip.hyperdrive_rating}
            </p>
            <p>
              <span>Manufacturer:</span> {selectedShip.manufacturer}
            </p>
            <p>
              <span>Length:</span> {selectedShip.length}
            </p>
            <p>
              <span>Max Atmosphering Speed:</span>
              {selectedShip.max_atmosphering_speed}
            </p>
            <p>
              <span> Crew:</span> {selectedShip.crew}
            </p>
            <button className="close" onClick={handleCloseDetails}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StarShip;
