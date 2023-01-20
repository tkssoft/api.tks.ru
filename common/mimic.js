import React, { useState, useEffect } from 'react';


const HeightObserver = (props) => {
    const { element_css } = props;
    const [ height, setHeight ] = useState(0);

    useEffect(() => {
        const element = document.querySelector(element_css);
        if (!element) return;
        const resizeObserver = new ResizeObserver(() => {
            setHeight(element.offsetHeight);
        });
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, []);
    return (
        <div {...props} style={{ height }}> {props.children} </div>
    )
}

export {
    HeightObserver
}