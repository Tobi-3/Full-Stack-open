const Header = (props) => {
    console.log(props)
    return <h1>{props.course}</h1>
}
const Part = (props) => {

    return (
        <p>
            {props.part.name} {props.part.exercises}
        </p>

    )
}

const Content = (props) => {
    const parts = props.parts

    return (
        <div>
            <Part part={parts[0]} />
            <Part part={parts[1]} />
            <Part part={parts[2]} />
        </div>
    )
}

const Total = (props) => {
    const parts = props.parts
    return (
        <p>
            Number of exercises {
                parts[0].exercises + parts[1].exercises + parts[2].exercises
            }
        </p>)

}



const App = () => {
    const course =
    {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            }
            , {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />

            {/* <p>
                {part1} {exercises1}
            </p>
            <p>
                {part2} {exercises2}
            </p>
            <p>
                {part3} {exercises3}
            </p>
            <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>  */}
        </div>
    )
}

export default App