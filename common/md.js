
import React from 'react';
import marked from 'marked';

const Markdown = (props) => {
    const { markdown } = props;
    return (
        <div className="ccs-md" dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
    )
}

export {
    Markdown
}