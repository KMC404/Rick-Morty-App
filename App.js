import React, { useState, useEffect, useCallback } from "react";
const Card = ({ children }) => (
  <div className="border p-4 rounded ">
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, onClick, disabled }) => (
  <button className="bg-blue-500 text-white p-2 rounded" onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    className="border p-2 rounded"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

const Select = ({ value, onChange, children }) => (
  <select className="border p-2 rounded" value={value} onChange={onChange}>
    {children}
  </select>
);

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;


const API_URL = "https://rickandmortyapi.com/api/character";

export default function RickAndMortyApp() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}?page=${page}&name=${search}&status=${status}`
      );
      const data = await response.json();
      if (data.error) {
        setCharacters([]);
      } else {
        setCharacters(data.results);
        setTotalPages(data.info.pages);
      }
    } catch (err) {
      setError("Failed to fetch characters.");
    }
    setLoading(false);
  }, [page, search, status]); // Add dependencies

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]); // Include fetchCharacters

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rick and Morty Characters</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="alive">Alive</SelectItem>
          <SelectItem value="dead">Dead</SelectItem>
          <SelectItem value="unknown">Unknown</SelectItem>
        </Select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
       {/* Character Cards with "View Details" Button */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {characters.map((char) => (
          <Card key={char.id}>
            <img src={char.image} alt={char.name} className="w-full rounded" />
            <CardContent>
              <p className="font-bold">{char.name}</p>
              <p className="text-sm">Status: {char.status}</p>
              {/* Log and update selectedCharacter when clicking the button */}
              <Button
                onClick={() => {
                  console.log("Selected Character:", char); // Debugging log
                  setSelectedCharacter(char);
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <p>Page {page} of {totalPages}</p>
        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
      {selectedCharacter && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold">{selectedCharacter.name}</h2>
          <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-32 h-32" />
          <p><strong>Status:</strong> {selectedCharacter.status}</p>
          <p><strong>Origin:</strong> {selectedCharacter.origin.name}</p>
          <p><strong>Location:</strong> {selectedCharacter.location.name}</p>
          <p><strong>Episodes:</strong> {selectedCharacter.episode.length}</p>
          <Button onClick={() => setSelectedCharacter(null)}>Close</Button>
        </div>
      )}
    </div>
  );
}
