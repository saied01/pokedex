import './Styles.css'
import Header from "./components/Header.jsx";
import PokeList from "./components/PokeList.jsx";
import PokeCard from "./components/PokeCard.jsx";
import SideNav from "./components/SideNav.jsx";
import TypeCard from "./components/TypeCard.jsx";
import { useState } from "react";

function App() {

    const [selectedPokemon, setSelectedPokemon] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectPokemon = (pokemon) => {
        setSelectedPokemon(pokemon.number - 1);
    }

    const handleToggleSideNav = () => {
        setIsOpen(!isOpen)
    }

  return (
    <>
        {!isOpen && <Header toggleNav={handleToggleSideNav} />} {/* Se muestra solo si SideNav está cerrada */}
        <PokeCard selectedPokemon={selectedPokemon} />
        <SideNav selectedPokemon={selectedPokemon}
                 setSelectedPokemon={setSelectedPokemon}
                 handleSelectPokemon={handleSelectPokemon}
                 isOpen={isOpen}
                 toggleNav={handleToggleSideNav}/>
        <PokeList/>
        <TypeCard/>
    </>
  )
}

export default App