import React from "react";

const Listbox = props => {
    
    const clicked = e => {
        e.preventDefault();

        props.clicked(e.target.id);
    }
    
    return (
        <div className="list">
            {
                props.items.map((item, index) => 
                <button key={index} onClick={clicked} id={item.track.id} className="list-btn">
                    {item.track.name}
                </button>)
            }
        </div>
    )

}

export default Listbox;