
import { debug } from './debug';


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

const scrollIntoView = function (
    element,
    container,
    margintop,
    marginbottom,
    relative=false,
    center=false
) {
    const offset = element.getBoundingClientRect();
    const containeroffset = container.getBoundingClientRect();
    const height = container.clientHeight;
    const dtop = center ? height / 2 : 0;
    const top = (margintop || 0) + dtop;
    const bottom = height - (marginbottom || 0) - dtop;
    debug('center', center, 'top', top, 'bottom', bottom, 'dtop', dtop);
    let offset_y = offset.y;
    if (relative) {
        const delta = container.parentElement.getBoundingClientRect().y +
            container.parentElement.firstChild.clientHeight;
        offset_y -= delta;
    }
    const down = offset_y + offset.height > bottom;
    const is_visible = (offset_y > top) && !down;
    if (!is_visible) {
        let scrolltop = container.scrollTop;
        if (down) {
            scrolltop += offset_y + offset.height - bottom;
        } else {
            scrolltop += offset_y - top;
        }
        container.scrollTo(0, scrolltop);
    }
}

export { getOffset, scrollIntoView };