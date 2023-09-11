"use client";

import React, { useState } from "react";

function ArtistForm() {
  const [artistNames, setArtistNames] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Split artist names by commas and remove leading/trailing spaces
      const namesArray = artistNames.split(",").map((name) => name.trim());

      // Send artist names to your API route
      const response = await fetch("/api/artistes", {
        method: "POST",
        body: JSON.stringify({ artistNames: namesArray }),
      });

      // If the response is successful, update the success state
      if (response.ok) {
        setSuccess(true);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Enter Artist Names</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter artist names separated by commas"
          value={artistNames}
          onChange={(e) => setArtistNames(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Generate Palettes
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {success && <p>Data uploaded successfully!</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default ArtistForm;
