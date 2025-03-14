import {useEffect, useState} from "react";
import {getFullPokedexNumber, getPokedexNumber} from "../utils/index.js";
import TypeCard from "./TypeCard.jsx";
import Modal from "./Modal.jsx";

export default function PokeCard(props) {
    const {selectedPokemon} = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skill, setSkill] = useState(null);
    const [loadingSkill, setLoadingSkill] = useState(false);

    const {name, height, abilities, stats, types, moves, sprites} = data || {}

    const imgList = Object.keys(sprites || {}).filter(sprite => {
        if (!sprites[sprite]) {return false}
        if (['versions', 'other'].includes(sprite)) {return false}

        return true;
    })


    async function fetchMoveData(move, moveUrl)  {
        if (loadingSkill || !localStorage || !moveUrl) {return}

        // checkear el cache a ver si esta el move:
        let cache = {}
        if (localStorage.getItem('pokemon-moves')) {
            cache = JSON.parse(localStorage.getItem('pokemon-moves'));
        }

        if (move in cache) {
            setSkill(cache[move]);
            console.log('found move in cache');
            return;
        }

        try {
            setLoadingSkill(true);
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('fetched move API:', moveData)
            const description = moveData?.flavor_text_entries.filter(
                value => {
                    return value.version_group.name = 'firered-leafgreen'
                })[0]?.flavor_text

            const skillData = {
                name:move,
                description
            }
            setSkill(skillData);
            cache[move] = skillData;
            localStorage.setItem('pokemon-moves', JSON.stringify(cache));
        } catch(error) {
            console.error(error.message);
        } finally {
            setLoadingSkill(false);
        }
    }

    useEffect((key, value) => {
        // si esta cargando, salir de logica
        if (loading || !localStorage) { return }

        // checkear si la info de selectedPokemon esta en el caché
        // 1. definir el cache:
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'));
        }

        // 2. checkear si esta en el cache, sino -> fetch de la API:
        if (selectedPokemon in cache) {
            // leemos del cache
            setData(cache[selectedPokemon]);
            console.log('found pokemon in cache');
            return;
        }

        // tenemos que fetchear la info de la API
        async function fetchPokemonData() {
            setLoading(true);
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/';
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon);
                const finalUrl = baseUrl + suffix;
                const response = await fetch(finalUrl);
                const pokemonData = await response.json();
                setData(pokemonData);

                console.log(pokemonData);
                cache[selectedPokemon] = pokemonData;
                localStorage.setItem('pokedex', JSON.stringify(cache));
            } catch(err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPokemonData()

    }, [selectedPokemon]); // si fetcheamos de la API, guardar la info en el cache para la proxima

    if (loading || !data) {
        return(
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return(
        <div className="poke-card">
            {skill && (<Modal handleCloseModal={() => {
                setSkill(null)
            }}>
                <div>
                    <h6>Name</h6>
                    <h2 className="skill-name">{skill.name.replaceAll('-', ' ')}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p className="skill-description">{skill.description}</p>
                </div>
            </Modal>)}
            <div className={'pokemon-title'}>
                <h3>{getFullPokedexNumber(selectedPokemon)}</h3>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObject, typeIndex) => {
                    return(
                        // type?.name -> (optional chaining = "x?.y") si la propiedad no existe, no accede a la siguiente
                        <TypeCard key={typeIndex} type={typeObject?.type?.name} />
                    )
                })}
            </div>
            <img className="default-image" src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${selectedPokemon}`+'-img'} />
            <div className="img-containter">
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl];
                    return(
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-${spriteUrl}`}/>
                    )
                })}
            </div>
            <h3>Stats:</h3>
            <div className="stats-card">
                {stats.map((statObj, statIndex) => {
                    const {stat, base_stat} = statObj;
                    return(
                        <div key={statIndex} className="stat-item">
                            <p>{stat?.name.replaceAll('_', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>
            <h3>Moves:</h3>
            <div className="pokemon-moves-grid">
                {moves.map((moveObj, moveIndex) => {
                    return(
                        <button key={moveIndex} className="move-button pokemon-move"
                                onClick={() => {fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)}}>
                            <p>{moveObj?.move?.name.replaceAll('_', ' ')}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}