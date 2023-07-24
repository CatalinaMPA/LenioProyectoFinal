import './App.css';
import { SearchBar } from './components/SearchBar';
import React, { useState } from "react";
import logo from './img/logo.png';

/*
Consultas:
Problemas con la API
1: La descripcion del comic siempre figura null... Que hacemos con eso?

*/


function App() {
  //Array de heroes. F = set
  const [heroesSearchResults, setHeroesSearchResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [lastHeroOrComicSearch, setLastHeroOrComicSearch] = useState('');
  const key = '&ts=1925&apikey=1cbd647c852c32a1da3f922d7601548b&hash=628d798fa246cb3f5cc406fe721daea9';
  const [comicURLResult, setComicURLResult] = useState([]);

  function searchHeroOrComic(heroOrComic, offset) {
    if (heroOrComic === "") {
      return;
    }
    // fijarte analizar heroOrComic para ver si es un url de comic
    const comicsDefault = 'https://www.marvel.com/comics/issue/';
    if (heroOrComic.startsWith(comicsDefault)) {
      const comicsDefaultLength = comicsDefault.length;
      let endIndex = heroOrComic.indexOf('/', comicsDefaultLength);
      let comicId = heroOrComic.substring(comicsDefaultLength, endIndex);
      // extraer el comic id del comicURL
      fetch(`http://gateway.marvel.com/v1/public/comics/${comicId}?${key}`)
        .then(response => response.json())
        .then(response => {
          console.log(comicId);
          console.log(response.data.results);
          setComicURLResult(response.data.results);
          setHeroesSearchResults([]);
        });
      return;
    }

    //--HEROES
    // buscamos los heroes
    fetch(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=${heroOrComic}&offset=${offset * 4}&limit=4${key}`)
      .then(response => response.json())
      .then(response => {
        console.log(response.data.results);
        // guardamos los resultados de la busqueda de heroes en la variable nueva results
        let results = response.data.results;
        //--COMICS
        // buscamos los comics
        fetch(`http://gateway.marvel.com/v1/public/comics?titleStartsWith=${heroOrComic}&offset=${offset * 4}&limit=4${key}`)
          .then(response => response.json())
          .then(response => {
            console.log(response.data.results);
            // combinamos los resultados de la busqueda de comics con los de los herores en la variable results
            results = results.concat(response.data.results)
            console.log(results);
            if (offset == 0) {
              // si el offset es 0 muestra los primeros 5 resultados de comics y heroes
              setHeroesSearchResults(results);
            }
            else {
              //Guarda los datos en heroesSearchResults y los concatena
              //con los resultados de la busqueda
              setHeroesSearchResults(heroesSearchResults.concat(results));
            }
          });
      });
  }

  let comicDate;
  if (comicURLResult.length > 0) {
    comicDate = comicURLResult[0].dates[0].date;
    comicDate = new Date(Date.parse(comicDate)).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"});
  }
  else {
    comicDate = '';
  }

  return (
    <div className="App">
      <header className="App-header">
        <img className='img-logo'
          src={logo}
        />
        {/* Busca los heroes, devuelve array y lo guarda en heroesSearchResult */}
        {/* NO ME DEJA AGREGAR EL DIV! */}
        <SearchBar onSearch={heroOrComic => {
          setPageNumber(0);
          setComicURLResult([]);
          searchHeroOrComic(heroOrComic, 0);
          setLastHeroOrComicSearch(heroOrComic);
        }} />
      </header>

      <ul className='main-cards' id='root'>
        {
          //Map recorre los elementos de heroesSearchResult, mostrando a los heroes.
          heroesSearchResults.map(item => (

            <li key={item.id}>
              <p className='main-card-hero-name'>{item.name ? item.name : item.title}</p>
              <img className='main-card-hero-img'
                src={item.thumbnail.path + '.' + item.thumbnail.extension}
              />
            </li>
          ))
        }
      </ul>

      {/* boton de siguiente */}
      {/* habria que cambiarlo que no se un boton y que pase cuando scrolleas */}
      {/* o esconderlo cuando solo se muestra un comic */}
      <button onClick={() => {
        setPageNumber(pageNumber + 1);
        searchHeroOrComic(lastHeroOrComicSearch, pageNumber + 1)
      }}>Siguiente</button>

      <ul>
        {
          comicURLResult.map(comic => (
            <li key={comic.id}>
              <p className='main-card-comic-name'>{comic.title}</p>
              <p className='main-card-comic-name'>{comicDate}</p>
              {
                comic.creators.items.map(creator => (
                  <p key={creator.role + Math.random()} className='main-card-comic-creators'>{creator.role}: {creator.name}</p>
                ))
              }
              <p className='main-cardkasu-comic-description'>{comic.description}</p>
              <img className='main-card-hero-img'
                src={comic.thumbnail.path + '.' + comic.thumbnail.extension}
              />
            </li>
          ))
        }
      </ul>

    </div>
  );
}

export default App;



