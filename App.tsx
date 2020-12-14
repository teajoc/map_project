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
import Map from "./Map";
import Dropdown from "./Dropdown";
import "./App.css";

interface AppState {
    buildLst: string[];                         // list of buildings
    toFrom: {label: string, value: string}[];   // start and end buildings selected by user
                                                // path received from Java Spark server
    path: {cost: number, start: {x: number, y: number},
           path: {start: {x: number, y: number}, end: {x: number, y: number}, cost: number}[]};
}

class App extends Component<{}, AppState> {

    // constructs app with empty state
    constructor(props: any) {
        super(props);
        this.state = {
            buildLst: [],
            toFrom: [],
            path: {cost: 0, start: {x: 0,y: 0}, path: []}
        };
        this.getLst();
    }

    // builds list of buildings formatted for react-select
    buildingList() {
        let selectObj: {label: string, value: string}[] = [];
        for (let i = 0; i < this.state.buildLst.length; i++) {
            selectObj[i] = {label: this.state.buildLst[i],
                            value: this.state.buildLst[i]};
        }
        return selectObj;
    }

    // fetch request for list of buildings
    async getLst() {
        try {
            let response = await fetch("http://localhost:4567/buildings");
            if (!response.ok) {
                alert("Server error! Response not ok!");
                return;
            }
            let parsed = await response.json();
            this.setState({
                buildLst: parsed
            });
        } catch (e) {
            alert("Server error! " + e.toString());
        }
    }

    // fetch request for shortest path to/from selected buildings
    async getPath() {
        try {
            let start = this.state.toFrom[0].label;
            let end = this.state.toFrom[1].label;
            let response = await fetch("http://localhost:4567/find-path?start="
                                       + start + "&end=" + end);
            if (!response.ok) {
                alert("Server error! Response not ok!");
                return;
            }
            let parsed = await response.json();
            this.setState({
                path: parsed
            });
        } catch (e) {
            alert("Server error! " + e.toString());
        }
    }

    // updates user's selected buildings and if 'find path' button is pushed, draws path
    // alerts user if button is pushed but there aren't two buildings selected
    updateToFrom = (newToFrom: {label: string, value: string}[], draw: boolean) => {
        this.setState({
            toFrom: newToFrom
        });
        if (draw) {
            if (this.state.toFrom.length === 2) {
                this.getPath();
            } else {
                alert("Select two buildings to find a path");
            }
        } else {
            this.setState({
                path: {cost: 0, start: {x: 0,y: 0}, path: []}
            });
        }
    }

    render() {
        return (
            <div>
                <p id="app-title">Campus Paths - Find the shortest path
                                  between two buildings on UW Seattle campus</p>
                <Dropdown options={this.buildingList()}
                          values={this.state.toFrom}
                          draw={false}
                          onChange={this.updateToFrom}/>
                <Map paths={this.state.path}/>
            </div>
        );
    }
}

export default App;
