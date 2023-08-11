import './styling/NavbarElement.css'

const NavbarElement = ({name}) => {
    
    return (
        <div className="navbar-element">
            <p className='navbar-element-text'>{name}</p>
        </div>
    );
}
 
export default NavbarElement;