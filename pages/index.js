import { useState } from "react";
import MusicList from "../components/MusicList";
import CreatePlaylist from "../components/CreatePlaylist";
import PeriodSelector from "../components/PeriodSelector";
import UserInputField from "../components/UserInputField";
import Head from "next/head";
import Header from "../components/Header";
import Intro from "../components/Intro";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_SPOTIFY_API_KEY;

  const [formInput, setFormInput] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("overall");
  const [flex, setFlex] = useState(false);
  const [error, setError] = useState(true);

  function handleChange(e) {
    const userInput = e.target.value;
    setFormInput(userInput);
  }

  function handlePeriod(e) {
    const period = e.target.value;
    setSelectedPeriod(period);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${formInput}&limit=20&period=${selectedPeriod}&api_key=${apiKey}&format=json`
    );
    const musicItems = await res.json();
    console.log(musicItems);
    setError(false);
    setSearchResult(musicItems);
    setFlex(true);

    // If user not found, throw error and don't display an empty list
    if (musicItems.error) {
      setFlex(false);
      setError("User not found");
    }
  };

  const songTitle = searchResult.toptracks?.track.map((item) => item.name);
  const artist = searchResult.toptracks?.track.map((item) => item.artist.name);

  return (
    <div className="bg-neutral-100 w-full text-slate-900 min-h-[100vh] pb-5 ">
      <Head>
        <title>Last.Playlist</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Cult.FM"
        />
        <meta name="keywords" content="Last.fm, Spotify, Playlist" />
      </Head>

      <Header
        pageHeading="Cult.FM"
        pageSubHeading="...."
      />

      <Intro />

      <main
        className={`justify-center items-center py-5 ${
          flex ? "flex-col" : "flex"
        }`}
      >
        <section className="flex-col justify-center">
          <UserInputField
            handleChange={handleChange}
            handlePeriod={handlePeriod}
            onSubmit={onSubmit}
            formInput={formInput}
            error={error}
          />

          <PeriodSelector handlePeriod={handlePeriod} />
        </section>

        <MusicList musicItems={searchResult} />

        {!error && (
          <CreatePlaylist
            songTitle={songTitle}
            artist={artist}
            selectedPeriod={selectedPeriod}
            userName={formInput}
          />
        )}
      </main>
    </div>
  );
}
