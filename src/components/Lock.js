import { useEffect, useRef, useState } from 'react';
import './styling/Lock.css'
import LOGO from '../images/logo.png'

const Lock = ({ lockPass, lockValue, setLockValue }) => {

    const [showIncorrectText, setShowIncorrectText] = useState(false)

    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current.focus()
    }, [])


    function handleLockChange(event) {
        setLockValue(event.target.value)

        if (lockValue.length >= 5 && lockValue !== lockPass.slice(0, lockPass.length - 1)) {
            setLockValue('')
            setShowIncorrectText(true)
        } else if (lockValue.length >= 0) {
            setShowIncorrectText(false)
        }
    }

    function handleValue(event) {
        event.preventDefault()
    }

    return (
        <div className='lock'>

            <div className='lock-container-up'>
                <img className='lock-img' src={LOGO} />
                <h1 className='lock-pin-text'>PIN</h1>
                </div>
                <div className='lock-container-down'>
                <input className='lock-input'
                    type='password'
                    value={lockValue}
                    onChange={handleLockChange}
                    onPaste={handleValue}
                    onContextMenu={handleValue}
                    ref={inputRef}
                />
                </div>
                {showIncorrectText && <p className='lock-incorrect-text'>Incorrect password.</p>}
        </div>
    );
}

export default Lock;