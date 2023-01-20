
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

const scrollIntoView = function (element, container, margintop, marginbottom, options) {
    const offset = element.getBoundingClientRect();
    const containeroffset = container.getBoundingClientRect();
    const height = container.clientHeight;
    const top = (margintop || 0);
    const bottom = height - (marginbottom || 0);
    const down = offset.y + offset.height > bottom;
    const is_visible = (offset.y > top) && !down;
    // debug('scrollIntoView is_visible', is_visible, offset.y, containeroffset.y, bottom, offset.height);
    if (!is_visible) {
        // debug('scrollIntoView offset', offset);
        // debug('scrollIntoView container.offset', containeroffset);
        // debug('scrollIntoView height', height);
        // debug('scrollIntoView margintop', margintop);
        // debug('scrollIntoView marginbottom', marginbottom);
        // debug('scrollIntoView top', top);
        // debug('scrollIntoView bottom', bottom);
        // debug('scrollIntoView down', down);
        let scrolltop = container.scrollTop;
        if (down) {
            scrolltop += offset.y + offset.height - bottom;
        } else {
            scrolltop += offset.y - top;
        }
        // debug('scrollIntoView scrolltop', scrolltop, container.scrollTop);
        container.scrollTo(0, scrolltop);
    }
}

export { getOffset, scrollIntoView };