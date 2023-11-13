const PersonForm = (props) => {
    

    return (
        <>
            <form>
                <div>
                    name: <input value={props.name} onChange={props.handleNameChange} />
                </div>
                <div>
                    number: <input type="tel" value={props.number} onChange={props.handleNumberChange} />
                </div>
                <div>
                    <button type="submit" onClick={props.onClick}>add</button>
                </div>
            </form>
        </>
    )
}

export default PersonForm