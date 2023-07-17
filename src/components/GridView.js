import React, { useState } from "react";


function GridView() {
    return (
        <div id="root">
            {
                // if(heroesSearchResult != ''){}
                //Map recorre los elementos de heroesSearchResult, mostrando a los heroes.
                heroesSearchResult.map(item => (
                    <p key={item.id}>{item.name}</p>
                ))
            }

        </div>
    )
}
