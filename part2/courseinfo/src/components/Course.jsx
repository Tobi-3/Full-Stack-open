const Course = ({ course }) => {
    console.log(course);
    return (
        <>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts} />
        </>
    )

}

const Total = ({ parts }) => {
    const total = parts.reduce((acc, part) => acc + part.exercises, 0)
    return <p><b>total of {total} exercises </b></p>
}

const Header = ({ course }) => <h2>{course}</h2>


const Part = ({ part }) =>
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) => {
    return parts.map(part => <Part key={part.id} part={part} />)
}

export default Course