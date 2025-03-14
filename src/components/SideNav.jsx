import {first151Pokemon} from "../utils";
import {useState} from "react";
import Header from "./Header.jsx";

export default function SideNav(props) {
    const [pokeFilter, setPokeFilter] = useState('')
    const {selectedPokemon, setSelectedPokemon, handleSelectPokemon, isOpen, toggleNav} = props

    const pokemonToShow = pokeFilter ? first151Pokemon.filter(pokemon => pokemon.name.toLowerCase().includes(pokeFilter.toLowerCase()) || pokemon.number.includes(pokeFilter)) : first151Pokemon;

    return (
        <nav className={`side-nav ${isOpen ? "open" : "closed"}`}>
            <div className={'header'}>
                <button className="open-nav-button" onClick={toggleNav}>
                    <i className={'fa-solid fa-arrow-left'}></i>
                </button>
                <div>
                <h1 className={'nav-head text-gradient'}>PoKéDex</h1>
                </div>
            </div>
            <input
                type="text"
                value={pokeFilter}
                placeholder="Search Pokémon by name or number"
                className={'nav-filter'}
                onChange={e => setPokeFilter(e.target.value)}/>
            {pokemonToShow.map((pokemon, index) => {
                return (
                    <button key={index} className={'nav-card'}
                            onClick={() => {
                                setSelectedPokemon(pokemon.number - 1);
                                if (window.innerWidth <= 768) {
                                    toggleNav(); // Solo cerrar en pantallas pequeñas
                                }
                            }}>
                        <p className={'nav-number'}>N.º{pokemon.number}</p>
                        <p className={'nav-name'}>{pokemon.name}</p>
                    </button>
                )
            })}
        </nav>
    )
}