

const getOffset = function (element) {
    var top = 0,
        left = 0,
        width = 0,
        height = 0;
    let bound = element.getBoundingClientRect();
    height = bound.height;
    width = bound.width;
    do {
        bound = element.getBoundingClientRect();
        top += bound.top;
        left += bound.left;
        element = element.offsetParent;
        if (element !== null) {
        bound = element.getBoundingClientRect();
        top -= bound.top - window.scrollY;
        left -= bound.left - window.scrollX;
        }
    } while (element);

    return {
        top: top,
        left: left,
        width: width,
        height: height
    };
};

const scrollIntoView = function (element, container, margintop, marginbottom, options) {
    const offset = element.getBoundingClientRect();
    const containeroffset = container.getBoundingClientRect();
    const height = container.clientHeight;
    const top = (margintop || 0);
    const bottom = height - (marginbottom || 0);
    console.log('scrollIntoView offset', offset);
    console.log('scrollIntoView container.offset', containeroffset);
    console.log('scrollIntoView top', top);
    console.log('scrollIntoView bottom', bottom);
    let scrolltop = container.scrollTop;
    if (offset.top < top) {
        console.log('1');
        scrolltop = top;
    } else if (offset.top + offset.height > bottom) {
        console.log('2');
        scrolltop = bottom - offset.height;
    }
    console.log('scrollIntoView scrolltop', scrolltop, container.scrollTop);
    container.scrollTo(0, scrolltop);
}

export { getOffset, scrollIntoView };