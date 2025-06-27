import React from 'react'
import {Link,useLocation,useNavigate} from 'react-router-dom'
import {logo,sun} from '../assets'
import {navlinks} from '../constants'

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isActive,setIsActive] = React.useState('dashboard');
    const [toggle,setToggle] = React.useState(false);

    React.useEffect(() => {
        // Set active based on current path
        const found = navlinks.find(link => link.link === location.pathname);
        if (found) setIsActive(found.name);
    }, [location.pathname]);

    return (
        <nav className="flex flex-col items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-10 h-full" aria-label="Sidebar navigation">
            <Link to="/" tabIndex={0} aria-label="Home" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                <img src={logo} alt="logo" className="w-[40px] h-[40px] object-contain mb-8" />
            </Link>
            <div className="flex-1 flex flex-col gap-4 w-full items-center">
                {navlinks.map((link) => (
                    <button
                        key={link.name}
                        onClick={() => {
                            navigate(link.link);
                        }}
                        aria-label={link.name.charAt(0).toUpperCase() + link.name.slice(1)}
                        title={link.name.charAt(0).toUpperCase() + link.name.slice(1)}
                        className={`w-[48px] h-[48px] flex items-center justify-center rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isActive === link.name ? 'bg-[#2c2f32]' : ''
                        } hover:bg-[#2c2f32] cursor-pointer`}
                        tabIndex={0}
                    >
                        <img src={link.imgUrl} alt={link.name} className="w-1/2 h-1/2 object-contain" />
                    </button>
                ))}
            </div>
            <div className="mt-8">
                <img src={sun} alt="theme" className="w-[32px] h-[32px] object-contain" aria-label="Theme icon" />
            </div>
        </nav>
    )
}

export default Sidebar