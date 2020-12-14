/*
 * Copyright (C) 2020 Kevin Zatloukal.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Autumn Quarter 2020 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

import React, {Component} from 'react';
import "./Map.css";

interface MapProps {
    paths: {cost: number, start: {x: number, y: number},
            path: {start: {x: number, y: number}, end: {x: number, y: number}, cost: number}[]};
}

interface MapState {
    backgroundImage: HTMLImageElement | null;
}

class Map extends Component<MapProps, MapState> {

    canvas: React.RefObject<HTMLCanvasElement>;

    constructor(props: MapProps) {
        super(props);
        this.state = {
            backgroundImage: null
        };
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.fetchAndSaveImage();
        this.redraw();
    }

    componentDidUpdate() {
        this.redraw()
    }

    fetchAndSaveImage() {
        // Creates an Image object, and sets a callback function
        // for when the image is done loading (it might take a while).
        let background: HTMLImageElement = new Image();
        background.onload = () => {
            this.setState({
                backgroundImage: background
            });
        };
        // Once our callback is set up, we tell the image what file it should
        // load from. This also triggers the loading process.
        background.src = "./campus_map.jpg";
    }

    drawBackgroundImage(ctx: any, canvas: any) {
        //
        if (this.state.backgroundImage !== null) { // This means the image has been loaded.
            // Sets the internal "drawing space" of the canvas to have the correct size.
            // This helps the canvas not be blurry.
            canvas.width = this.state.backgroundImage.width;
            canvas.height = this.state.backgroundImage.height;
            ctx.drawImage(this.state.backgroundImage, 0, 0);
        }
    }

    // redraws canvas, if there is a path, draws edges over the bg image
    redraw = () => {
        let canvas = this.canvas.current;
        if (canvas === null) throw Error("Unable to draw, no canvas ref.");
        let ctx = canvas.getContext("2d");
        if (ctx === null) throw Error("Unable to draw, no valid graphics context.");
        this.drawBackgroundImage(ctx, canvas);
        for (let edge of this.props.paths.path) {
            this.drawEdge(ctx, [edge.start, edge.end]);
        }
    };

    // draws an edge from given coordinates
    drawEdge = (ctx: any , edge: [{x: number, y: number}, {x: number, y: number}]) => {
        ctx.strokeStyle = "magenta";
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(edge[0].x, edge[0].y);
        ctx.lineTo(edge[1].x, edge[1].y);
        ctx.stroke();
    };

    render() {
        return (
            <div id="map">
                <canvas ref={this.canvas}/>
            </div>
        )
    }
}

export default Map;