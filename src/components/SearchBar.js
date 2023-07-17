
import { eventWrapper } from "@testing-library/user-event/dist/utils";
import React, { useState } from "react";

export function SearchBar({onSearchChange}) {
    const [hero, setHero] = useState('');
    function search(x) {
        if (x === "") {
            return;
        }
        fetch(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=${x}&ts=1925&apikey=1cbd647c852c32a1da3f922d7601548b&hash=628d798fa246cb3f5cc406fe721daea9`)
            .then(response => response.json())
            .then(response => {
                console.log(response.data.results);
                onSearchChange(response.data.results);
            });
    }
    return(
        <form action="/" method="get" onSubmit={(event) => {
            event.preventDefault();
            search(hero);
          }}>
            <button type="submit">Search</button>
            <span className="visually-hidden"></span>
            <input
                type="text"
                id="header-search"
                placeholder="Buscar"
                name="s"
                onChange={event => setHero(event.target.value)}
            />
            
        </form>
    )
}

