# Quadtree implementation in P5 JS

## Introduction

This is a simple implementation of a quadtree in P5 JS. The quadtree is a data structure that is used to store points in a 2D space. It is used to speed up the search of points in a given area. The quadtree is a tree where each node has 4 children. Each node represents a quadrant of the space. The root node represents the whole space. Each node has a maximum capacity of points. When the number of points in a node exceeds the capacity, the node is subdivided into 4 children. Each point is then inserted into the corresponding child. The subdivision is done recursively until the number of points in a node is less than the capacity.

## Installation

To run the simulation, simply clone the repository and open the `index.html` file in your browser. Alternatively, you can visit the [GitHub Pages](https://ghostscypher.github.io/quadtree/src/index.html) for this repository.

## Using the simulation

The simulation is very simple to use. The simulation will start automatically when the webpage is loaded.

1. The simulation can be reset by pressing the `r` key.
2. The simulation has 3 mode `INSERT`, `QUERY` and `DELETE`. You can enter these modes by pressing the `i`, `q` and `d` keys respectively. To exit a mode, press the `ESC` key OR press the same key again.
3. In `INSERT` mode, click anywhere on the canvas to insert a point.
4. In `DELETE` mode, click on a point to delete it. This point uses a circular bounding area to delete the point. The radius of the circle has been set to 5 currently.
5. To create a bounding box enter query mode by pressing `q`, click and drag the mouse. The bounding box will be created from the point where the mouse was clicked to the point where the mouse was released.
6. Press the `t` key to toggle displaying the co-ordinates of the bounding box created above.

## Demo

<img src="https://raw.githubusercontent.com/ghostscypher/quadtree/output/demo.gif" alt="Quadtree GIF" />

## References

1. [Quadtree](https://en.wikipedia.org/wiki/Quadtree)
2. [P5 JS](https://p5js.org/)
3. [P5 JS Reference](https://p5js.org/reference/)
4. [P5 JS Examples](https://p5js.org/examples/)
5. [P5 JS Web Editor](https://editor.p5js.org/)
6. [Coding train - P5 JS Tutorials](https://www.youtube.com/user/shiffman/playlists?view=50&sort=dd&shelf_id=14)
7. [The Nature of Code](https://natureofcode.com/)
8. [The Nature of Code - Chapter 8 - Fractals - Quadtree](https://natureofcode.com/book/chapter-8-fractals/#84-quadtree)
9. [The Coding Train - 98.1: Quadtree Part 1 - Quadtrees and Recursion](https://www.youtube.com/watch?v=OJxEcs0w_kE)
