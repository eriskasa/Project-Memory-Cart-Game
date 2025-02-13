import React,{ useState, useEffect } from "react";
import axios from "axios";
import pokemonData from "./pokemonData/pokemonData";

export default function CartsDisplay() {
  const [ countClick, setCountClick ] = useState(0);
  const [ clickedImage, setClickedImage ] = useState([]);
  const [ shuffledPokemon, setShuffledPokemon] = useState([]);
  const [ pokemonData, setPokemonData ] = useState([]);
  const [ bestScore, setBestScore ] = useState(0);

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async () => {
    try {
      const pokemonNumbers =  new Set; 

      while (pokemonNumbers.size < 12) {
        pokemonNumbers.add(Math.floor(Math.random() * 898) + 1);
      }

      const pokemonPromises = [...pokemonNumbers].map(async (number) => {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${number}`);
        return response.data;
      });
      const pokemonDataArray = await Promise.all(pokemonPromises);
      setPokemonData(pokemonDataArray)
      setShuffledPokemon(pokemonDataArray);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };


  useEffect(() => {
    if (countClick >= bestScore) {
      setBestScore(countClick)
    }
  },[countClick]);
  
  const handleCountClick = (imageUrl) => {
    if (clickedImage.includes(imageUrl)) {
      resetGame();
    } else {
      setCountClick(countClick + 1);
      setClickedImage([...clickedImage, imageUrl]);
    }
    shufflePokemons();
  }

  const shufflePokemons = () => {
    const shuffled = [...shuffledPokemon];
    for (let i = shuffled.length -1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i] , shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledPokemon(shuffled);
  }

  const resetGame = () => {
    setCountClick(0);
    setClickedImage([]);
    setShuffledPokemon(pokemonData);
  }

  const newGame = () => {
    resetGame();
    setBestScore(0)
    fetchPokemonData();
  }

  return (
    <>
    <div className="header">
      <div className="left-div-container">
        <h1>Memory Cart Game!!</h1>
        <p>Win points by click different image each time.</p>
      </div>
      <div className="right-div-continer">
        <h3>Score: {countClick} </h3>
        <h3>Best Score: {bestScore} </h3>
      </div>
    </div>
    <div className="cart-container">
      {shuffledPokemon.map((pokemon) => (
        <Cart pokemon={pokemon} handleCountClick={handleCountClick} setCountClick={setCountClick} key={pokemon.id}/>
      ))}
    </div>
    <div className="button-container">
    <button onClick={resetGame}>Reset</button>
    <button onClick={newGame}>new game</button>
    </div>
    </>
  )
}

function Cart({handleCountClick, pokemon }) {

  return (
    <>
    <div className="image-div" onClick={() => handleCountClick(pokemon.id)}>
      <img src={pokemon.sprites.front_default} alt={pokemon.name}></img>
      <span>
        <strong>{pokemon.name}</strong>
      </span>
    </div>
    </>
  )
}