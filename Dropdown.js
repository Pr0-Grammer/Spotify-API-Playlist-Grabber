import React from "react";

const Dropdown = props => {

    const Change = e => {
        props.changed(e.target.value);
    }

    return (
        <div className="Drop">
            <select value={props.selectedVal} onChange={Change}>
                {props.options.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)}
            </select>
            {/* <h1>{props.selectedVal}</h1> */}
        </div>
    );
}

export default Dropdown;