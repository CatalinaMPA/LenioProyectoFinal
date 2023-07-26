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

  const [responseDataHeroe, setResponseDataHeroe] = useState();
  const [responseDataComic, setResponseDataComic] = useState();

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

    document.getElementById('button-next-id').style.display = "none";

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
      return;
    }

    let results = [];

    fetchHeroes();

    function fetchHeroes() {
      //--HEROES
      // buscamos los heroes
      if (responseDataHeroe == undefined || responseDataHeroe.offset + responseDataHeroe.count < responseDataHeroe.total) {
        fetch(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=${heroOrComic}&offset=${offset * 4}&limit=4&${key}`)
          .then(response => response.json())
          .then(response => {
            console.log(response);
            console.log(response.data.results);
            results = response.data.results;
            // guardamos los resultados de la busqueda de heroes en la variable nueva results
            setResponseDataHeroe(response.data);
            fetchComics();
            document.getElementById('button-next-id').style.display =
              (response.data.offset + response.data.count < response.data.total) ? "block" : "none";
          });
      }
      else {
        fetchComics();
      }
    }

    function fetchComics() {
      if (responseDataComic == undefined || responseDataComic.offset + responseDataComic.count < responseDataComic.total) {
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
            document.getElementById('button-next-id').style.display =
              (response.data.offset + response.data.count < response.data.total) ? "block" : "none";
          });
      }
    }
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
        <div className='list-comic-heros'>
          <div className='list-comic-heros-i'>
            <p className='list-comic-heros-i-paragraph'>{heroeComicOne}</p>
            <button className='list-comic-heros-i-button'
              onClick={() => {
                document.getElementById('background-comic-list').style.display = "none";
              }}>
              X
            </button>
          </div>
          <ul>
            {
              heroesComicList.map(comic => (
                <li key={comic.id} className='list-card-hero-float'>
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

      <ul className='main-cards' id='root1'>
        {
          //Map recorre los elementos de heroesSearchResult, mostrando a los heroes.
          heroesSearchResults.map(item => (

            <li key={item.id + Math.random()}>
              <button className='main-card-hero-button'
                onClick={() => {
                  if (item.digitalId != undefined) {
                    return;
                  }
                  document.getElementById('background-comic-list').style.display = "block";
                  fetchHeroesComicsList(item.id);
                  setHeroeComicOne(item.name);
                }}>
                <p className='main-card-hero-name'>{item.name ? item.name : item.title}</p>
                <div className='main-card-hero-gradient'></div>
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
            <li key={comic.id} className='main-comic'>
              <img className='main-comic-hero-img'
                src={comic.thumbnail.path + '.' + comic.thumbnail.extension}
              />
              <div className='main-comic-i'>
                <p className='main-comic-title'>{comic.title}</p>
                <p className='main-comic-date'>{comicDate}</p>
                {
                  comic.creators.items.map(creator => (
                    <p key={creator.role + Math.random()} className='main-comic-creators'>{creator.role}: {creator.name}</p>
                  ))
                }
                <p className='main-comic-description'>{comicDescription}</p>
              </div>

            </li>
          ))
        }
      </ul>

    </div>
  );
}

export default App;



