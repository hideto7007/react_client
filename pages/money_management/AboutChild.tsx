import React from 'react'

interface AboutProps {
  name: string
  title: string
}

const About: React.FC<AboutProps> = ({ name, title }) => {
  return (
    <div>
      <h1>
        {name} {title}
      </h1>
    </div>
  )
}

export default About
