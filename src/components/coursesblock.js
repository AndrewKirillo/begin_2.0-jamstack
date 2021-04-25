
/** @jsx jsx */
import { jsx, Heading, Text, Flex, Image, Link } from "theme-ui"
import moment from "moment"
import { StaticQuery, graphql } from "gatsby"


export default function CourseBlock() {
    return (
        <div sx={{padding: "40px", marginRight: "20px", marginBottom: "40px", bg: "#f7f7f7"}}>
            <Heading sx={{fontSize: "2em", paddingBottom: "20px"}}>Berkeley Changemaker<sup>TM</sup> Courses</Heading>
        <Heading sx={{fontSize: "1.2em", paddingBottom: "20px", fontWeight: 200, fontStyle:  "italic"}}>Not sure where to start? Take one of these introductory courses for all majors.</Heading>
        <Flex sx={{flexDirection: "column", maxWidth: "1440px", margin: "auto"}}>
        <Text sx={{fontSize: "1.2em", paddingBottom: "10px"}}>
            <strong>LS C12 (2 units):</strong> The Berkeley Changemaker: A Discovery Experience
        </Text>

        <Text sx={{fontSize: "1.2em", paddingBottom: "10px"}}>
            <strong>INDENG 95/195 (1 units):</strong> A. Richard Newton Lecture Series: A Berkeley Changemaker Course
        </Text>

        <Text sx={{fontSize: "1.2em", paddingBottom: "10px"}}>
            <strong>POLSCI 98/198 (1 units):</strong> Berkeley Changemaker: Topics in International Ethics
        </Text>

        <Text sx={{fontSize: "1.2em", paddingBottom: "10px"}}>
            <strong>COLWRIT R4B (4 units):</strong> Berkeley Changemaker: Writing the Change We Seek
        </Text>

        <Link sx={{fontSize: "1.3em", color: "#C4820E", alignItem: "right"}} href="/courses">See More Courses >></Link>
    </Flex>
    </div>
    )
  }