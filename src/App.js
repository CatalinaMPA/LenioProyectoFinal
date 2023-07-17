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
  const [heroesSearchResult, setHeroesSearchResult] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        {/* Busca los heroes, devuelve array */}
        <SearchBar onSearchChange={results => setHeroesSearchResult(results)} />

      </header>
      <ul id='root'>
        {
          //Map recorre los elementos de heroesSearchResult, mostrando a los heroes.
          heroesSearchResult.map(item => (
             
            <li key={item.id}>
            <p>{item.name}</p>
            <img 
            src={item.thumbnail.path+'.'+item.thumbnail.extension}
            />
            </li>
          ))
        }
      </ul>
      <button>Siguiente</button>
    </div>
  );
}

export default App;


