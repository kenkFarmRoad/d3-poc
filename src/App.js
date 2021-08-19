import React, { Fragment, useCallback, useEffect, useState } from 'react';
import './App.css';
import * as d3 from 'd3';
import map from './map.png'

function dragging(event) {
  const current = d3.select(this);
  current
    .attr("x", parseFloat(current.attr("x")) + event.dx)
    .attr("y", parseFloat(current.attr("y")) + event.dy);
}

const Rectangle = ({ imageRef }) => {
  const ref = React.useRef();
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const dragEnd = useCallback(() => {
    const parentBBox = d3.select(imageRef.current).node().getBBox();
    const rectBBox = d3.select(ref.current).node().getBBox()
    setOffset({ x: rectBBox.x / parentBBox.width, y: rectBBox.y / parentBBox.height })
  }, [imageRef]);

  useEffect(() => {
    const parentDimension = d3.select(imageRef.current).node().getBBox();

    d3.select(ref.current)
      .attr("rx", 25)
      .attr("ry", 25)
      .attr("x", parentDimension.width * offset.x)
      .attr("y", parentDimension.height * offset.y)
      .style("stroke", "black")
      .attr("width", 120)
      .attr("height", 50)
      .style("fill", d3.color("white"))
      .call(d3.drag()
        .on('drag', dragging)
        .on('end', dragEnd)
      )

    d3.select(window).on('resize', () => {
      const parentDimension = d3.select(imageRef.current).node().getBBox();
      d3.select(ref.current)
        .attr("x", parentDimension.width * offset.x)
        .attr("y", parentDimension.height * offset.y)
    })
  }, [imageRef, offset, dragEnd])

  return (
    <rect ref={ref} />
  )
}

const Background = ({ imageRef }) => {
  useEffect(() => {
    d3.select(imageRef.current)
      .attr("xlink:href", map)
      .attr('width', "100%")
      .attr('height', "100%")
      .attr("x", 0)
      .attr("y", 0);
  }, []);
  return (
    <image ref={imageRef} />
  )
}

const App = () => {
  const ref = React.useRef();
  const imageRef = React.useRef();

  useEffect(() => {
    d3.select(ref.current)
    d3.select(window).on('resize', () => {
      console.log(d3.select(imageRef.current).node().getBBox());
    })
  }, [])

  return (
    <Fragment>
      <img src={map} width={"500px"} height={"500px"} />
      <svg
        ref={ref}
        style={{
          width: "80vw",
          height: "80vh",
          border: "solid 1px"
        }}
      >
        <Background imageRef={imageRef} />
        <Rectangle imageRef={imageRef} />
      </svg></Fragment>
  )
}

export default App;
