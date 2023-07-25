import './App.css';
import { SearchBar } from './components/SearchBar';
import React, { useState, useEffect } from "react";
import logo from './img/logo.png';

/*
Consultas
*/


function App() {
  //Array de heroes. F = set
  const [heroesSearchResults, setHeroesSearchResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [lastHeroOrComicSearch, setLastHeroOrComicSearch] = useState('');
  const key = 'ts=1925&apikey=1cbd647c852c32a1da3f922d7601548b&hash=628d798fa246cb3f5cc406fe721daea9';
  const [comicURLResult, setComicURLResult] = useState([]);
  const [heroesComicList, setHeroesComicList] = useState([]);
  const [heroeComicOne, setHeroeComicOne] = useState('');

  const [responseDataHeroe, setResponseDataHeroe] = useState([]);
  const [responseDataComic, setResponseDataComic] = useState([]);

  useEffect(() => {
    // mostrar 8 heroes random
    let offset = Math.floor(Math.random() * 1000);
    fetch(`https://gateway.marvel.com:443/v1/public/characters?${key}&limit=8&offset=${offset}`)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setHeroesSearchResults(heroesSearchResults.concat(response.data.results));
      })
  }, [])

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
      fetch(`http://gateway.marvel.com/v1/public/comics/${comicId}?&${key}`)
        .then(response => response.json())
        .then(response => {
          console.log(comicId);
          console.log(response.data.results);
          setComicURLResult(response.data.results);
          setHeroesSearchResults([]);
        });
      document.getElementById('button-next-id').style.display = "none";
      return;
    }

    let results;
    function fetchHeroes() {
    }
    function fetchComics() {
    }
    //--HEROES
    // buscamos los heroes
    fetch(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=${heroOrComic}&offset=${offset * 4}&limit=4&${key}`)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        console.log(response.data.results);
        results = response.data.results;
        // guardamos los resultados de la busqueda de heroes en la variable nueva results
        setResponseDataHeroe(response.data);
        //--COMICS
        // buscamos los comics
        fetch(`http://gateway.marvel.com/v1/public/comics?titleStartsWith=${heroOrComic}&offset=${offset * 4}&limit=4&${key}`)
          .then(response => response.json())
          .then(response => {
            console.log(response);
            console.log(response.data.results);
            // combinamos los resultados de la busqueda de comics con los de los herores en la variable results
            results = results.concat(response.data.results)
            setResponseDataComic(response.data);
            if (offset == 0) {
              // si el offset es 0 muestra los primeros 5 resultados de comics y heroes
              setHeroesSearchResults(results);
            }
            else {
              //Guarda los datos en heroesSearchResults y los concatena
              //con los resultados de la busqueda
              setHeroesSearchResults(heroesSearchResults.concat(results));
            }
            document.getElementById('button-next-id').style.display = response.data.total ? "block" : "none";
          });
      });
  }

  function fetchHeroesComicsList(comicId) {
    fetch(`https://gateway.marvel.com:443/v1/public/characters/${comicId}/comics?&${key}&limit=1`)
      .then(response => response.json())
      .then(response => {
        console.log(response.data.results);
        setHeroesComicList(response.data.results);
      });
  }

  // Fecha de Comic
  let comicDate;
  if (comicURLResult.length > 0) {
    comicDate = comicURLResult[0].dates[0].date;
    comicDate = new Date(Date.parse(comicDate)).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" });
  }

  // Descripcion de Comic
  let comicDescription;
  if (comicURLResult.length > 0) {
    comicDescription = comicURLResult[0].description;
    if (comicDescription == null) {
      comicDescription = 'Este comic no tiene descripcion disponible.';
    }
  }

  return (
    <div className="App" onLoad={() => {

    }}>
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

      <div id='background-comic-list'>
        <div className='comic-list'>
          <div>
            <p>{heroeComicOne}</p>
            <button
              onClick={() => {
                document.getElementById('background-comic-list').style.display = "none";
              }}>
              X
            </button>
          </div>
          <ul>
            {
              heroesComicList.map(comic => (
                <li key={comic.id} className='list-comic'>
                  {/* <p className='main-cardkasu-comic-description'>{comicDescription}</p> */}
                  <img className='list-card-hero-img'
                    src={comic.thumbnail.path + '.' + comic.thumbnail.extension}
                  />
                  <p className='list-card-comic-name'>{comic.title}</p>
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      <ul className='main-cards' id='root'>
        {
          //Map recorre los elementos de heroesSearchResult, mostrando a los heroes.
          heroesSearchResults.map(item => (

            <li key={item.id}>
              <button
                onClick={() => {
                  if (item.digitalId != undefined) {
                    return;
                  }
                  document.getElementById('background-comic-list').style.display = "block";
                  fetchHeroesComicsList(item.id);
                  setHeroeComicOne(item.name);
                }}>
                <p className='main-card-hero-name'>{item.name ? item.name : item.title}</p>
                <img className='main-card-hero-img'
                  src={item.thumbnail.path + '.' + item.thumbnail.extension}
                />
              </button>
            </li>
          ))
        }
      </ul>

      {/* boton de siguiente */}
      {/* habria que cambiarlo que no se un boton y que pase cuando scrolleas */}
      {/* o esconderlo cuando solo se muestra un comic */}
      <button className='button-next' id='button-next-id'
        onClick={() => {
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
              <p className='main-cardkasu-comic-description'>{comicDescription}</p>
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



