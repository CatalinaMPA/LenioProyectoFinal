import logo from './logo.svg';
import './App.css';
import { SearchBar } from './components/SearchBar';
import React, { useState } from "react";

/*
 {
  method: 'GET',
  headers: {'Access-Control-Allow-Origin':'localhost:3000'},
  mode: 'no-cors', // <---
  cache: 'default'
}
*/

function App() {
  //Array de heroes. F = set
  const [heroesSearchResults, setHeroesSearchResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  function searchHeroOrComic(heroOrComic) {
      if (heroOrComic === "") {
          return;
      }
      fetch(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=${heroOrComic}&ts=1925&apikey=1cbd647c852c32a1da3f922d7601548b&hash=628d798fa246cb3f5cc406fe721daea9`)
          .then(response => response.json())
          .then(response => {
              console.log(response.data.results);
              //Guarda los datos en heroesSearchResults
              setHeroesSearchResults(response.data.results);
          });
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* Busca los heroes, devuelve array y lo guarda en heroesSearchResult */}
        <SearchBar onSearch={heroOrComic => searchHeroOrComic(heroOrComic)} />

      </header>
      <ul id='root'>
        {
          //Map recorre los elementos de heroesSearchResult, mostrando a los heroes.
          heroesSearchResults.map(item => (
             
            <li key={item.id}>
            <p>{item.name}</p>
            <img 
            src={item.thumbnail.path+'.'+item.thumbnail.extension}
            />
            </li>
          ))
        }
      </ul>
      <button onClick={()=>{setPageNumber(pageNumber + 1); console.log(pageNumber)}}>Siguiente</button>
    </div>
  );
}

export default App;


