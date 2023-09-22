import React from "react";
import { useState, useEffect } from "react";
import { Client } from "podcast-api";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import SideBar from "./components/SideBar";
import Playlist from "./components/Playlist";
import Footer from "./components/Footer";
import APILoadingState from "./components/APILoadingState";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import ErrorPage from "./components/ErrorPage";
import "./App.css";
import { auth } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [podcasts, setPodcasts] = useState([]);
  const [walkDuration, setWalkDuration] = useState(""); 
  const [selectedGenre, setSelectedGenre] = useState("");
  const [playlistNameInput, setPlaylistNameInput] = useState("");
  const [landingPage, setLandingPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectLessTime, setSelectLessTime] = useState("");
  const [authUser, setAuthUser] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault();
    setSelectLessTime("");
    setIsLoading(true);
    setErrorMessage("");
    
    const apiKey = import.meta.env.VITE_API_KEY;
    const baseUrl = "https://listen-api.listennotes.com/api/v2";
    const client = Client({ apiKey });
    const newUrl = new URL(baseUrl);
    newUrl.pathname = "/search";

    if (walkDuration > 720) {
      setIsLoading(false);
      setSelectLessTime("Please select less time.");
    }

    client
      .search({
        q: "podcast",
        sort_by_date: 0,
        type: "episode",
        offset: 0,
        len_min: walkDuration - 1,
        len_max: walkDuration,
        genre_ids: selectedGenre,
        published_before: 1580172454000,
        published_after: 0,
        only_in: "title,description",
        language: "English",
        safe_mode: 0,
        unique_podcasts: 0,
        page_size: 10,
      })
      .then((response) => {
        setIsLoading(false);
        if (response.data.results.length === 0) {
          setErrorMessage("Sorry! No podcasts found. Please try again.");
        } else {
          setPodcasts(response.data.results);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setErrorMessage("Error retrieving podcasts. Please try again later.");
      });

    setLandingPage(false);
  };

  useEffect(() => {}, [walkDuration, selectedGenre, handleSubmit]);

  const handleWalkDurationChange = (event) => {
    const newValue = event.target.value;
    if (newValue.startsWith("0")) {
      event.preventDefault();
      console.log("hello");
    } else {
      setWalkDuration(newValue);
    }
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  return (
    <>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header authUser={authUser}setLandingPage={setLandingPage}/>
                <SideBar
                  walkDuration={walkDuration}
                  handleWalkDurationChange={handleWalkDurationChange}
                  selectedGenre={selectedGenre}
                  handleSelectedGenreChange={(e) =>
                    setSelectedGenre(e.target.value)
                  }
                  playlistNameInput={playlistNameInput}
                  handlePlaylistNameInputChange={(e) =>
                    setPlaylistNameInput(e.target.value)
                  }
                  handleSubmit={handleSubmit}
                  errorMessage={errorMessage}
                />
                { landingPage ? (
                  <LandingPage />
                ) : selectLessTime ? (
                  <div className="errorMsg">
                    <i className="fa-solid fa-triangle-exclamation errorIcon"></i>
                    <p>{selectLessTime}</p>
                  </div>
                ) : isLoading ? (
                  <APILoadingState />
                ) : errorMessage ? (
                  <div className="errorMsg">
                    <i className="fa-solid fa-triangle-exclamation errorIcon"></i>
                    <p>{errorMessage}</p>
                  </div>
                ) : (
                  <Playlist
                    authUser={authUser}
                    podcasts={podcasts}
                    playlistNameInput={playlistNameInput}
                  />
                )}
                <Footer />
              </>
            }
          ></Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
