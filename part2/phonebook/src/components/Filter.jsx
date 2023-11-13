const Filter = ({ value, handler }) => {
    return (
        <div>
            search name: <input value={value} onChange={handler} />
        </div>)
}

export default Filter