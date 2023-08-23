import './styling/NavbarElement.css'

const NavbarElement = ({name}) => {
    
    return (
        <div className="navbar-element-s">
            <p className='navbar-element-text'>{name}</p>
        </div>
    );
}
 
export default NavbarElement;