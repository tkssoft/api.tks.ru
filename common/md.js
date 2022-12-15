
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

const Markdown = (props) => {
    const { markdown, src } = props;
    const [ md, setmd ] = useState(markdown || '');

    useEffect(() => {
        if (src) {
            fetch(src).then((resp) => {
                return resp.text()
            }).then((data) => { setmd(data) })
        }
    })

    return (
        <div className="ccs-md" dangerouslySetInnerHTML={{ __html: marked(md) }} />
    )
}

export {
    Markdown
}