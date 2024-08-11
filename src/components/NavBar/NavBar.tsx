import React, {useState} from 'react'
import Settings from './Settings';

const NavBar:React.FC = () => {
    const [showSettings, setShowSettings] = useState(false);

    return(
        <nav>
            <ul className="v-full h-10 static bg-orange-400 flex justify-around items-center">
                <li>Jukugo 熟語</li>
                <li>About</li>
                <li>
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="">
                        Settings

                    </button>
                    <div className="relative">
                        <Settings 
                            showSettings={showSettings}/>
                    </div>
                </li>
                <li></li>
            </ul>

        </nav>
    )
}

export default NavBar
