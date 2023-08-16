import '../styling/pages-styling/PhoneNumber.css'

const PhoneNumber = ({telefonskiBroj, setTelefonskiBroj}) => {

    function handlePhoneNumber (e) {
        setTelefonskiBroj(e.target.value);
    }


    return (
        <div className="phone-number">
            <div className='phone-number-container'>
                <input 
                type='number'
                value={telefonskiBroj}
                onChange={handlePhoneNumber}
                placeholder='Telefonski broj'
                />
            </div>
        </div>
    );
}
 
export default PhoneNumber;