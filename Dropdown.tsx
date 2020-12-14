import React, {Component} from 'react';
import Select from 'react-select';

interface DropdownProps {
    options: {label: string, value: string}[]; // dropdown list options
    values: {label: string, value: string}[];  // selected values from list
    draw: boolean;  // true when 'find path' button is clicked
    onChange(val: {label: string, value: string}[], draw: boolean): void;
}

class Dropdown extends Component<DropdownProps> {

    // updates selected values--if two are already selected, alerts user
    updateValues = (value: any) => {
        if (value == null || value.length < 3) {
            this.props.onChange(value, false);
        } else {
            alert("To select a new building, deselect your previous selection");
        }
    };

    // handles button push, updates parent component
    drawPath = () => {
        this.props.onChange(this.props.values, true);
    }

    // clears selected values and drawn path
    resetMap = () => {
        this.props.onChange([], false);
    }

    render() {
        return (
            <div id="dropdown">
                <Select options={this.props.options}
                        value={this.props.values}
                        onChange={(v) => {this.updateValues(v)}}
                        isMulti/>
                <button onClick={() => {this.drawPath()}}>Find path</button>
                <button onClick={() => {this.resetMap()}}>Reset</button>
            </div>
        )
    }
}

export default Dropdown;