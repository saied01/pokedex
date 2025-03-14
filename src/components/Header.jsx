export default function Header({toggleNav}) {

    return(
        <header>
            <button className="open-nav-button" onClick={toggleNav}>
                <i className="fa-solid fa-bars"></i>
            </button>
            <div className={'header'}>
                <h1 className={'nav-head text-gradient'}>PoKéDex</h1>
            </div>
        </header>
    )
}