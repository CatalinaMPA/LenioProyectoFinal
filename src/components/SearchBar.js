
import { eventWrapper } from "@testing-library/user-event/dist/utils";
import React, { useState } from "react";

export function SearchBar({onSearch}) {
    const [heroOrComic, setHeroOrComic] = useState('');
    return(
        <form action="/" method="get" onSubmit={(event) => {
            event.preventDefault();
            onSearch(heroOrComic);
          }}>
            <button type="submit">Search</button>
            <span className="visually-hidden"></span>
            <input
                type="text"
                id="header-search"
                placeholder="Buscar"
                name="s"
                onChange={event => setHeroOrComic(event.target.value)}
            />
            
        </form>
    )
}

