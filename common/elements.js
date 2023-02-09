
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

const scrollIntoView = function (element, container, margintop, marginbottom, relative=false) {
    const offset = element.getBoundingClientRect();
    const containeroffset = container.getBoundingClientRect();
    const height = container.clientHeight;
    const top = (margintop || 0);
    const bottom = height - (marginbottom || 0);
    let offset_y = offset.y;
    // debug('relative', relative);
    if (relative) {
        const delta = container.parentElement.getBoundingClientRect().y +
            container.parentElement.firstChild.clientHeight;
        // debug('delta', delta);
        offset_y -= delta;
    }
    // debug('scrollIntoView offset_y', offset_y);
    const down = offset_y + offset.height > bottom;
    const is_visible = (offset_y > top) && !down;
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
            // debug('down');
            scrolltop += offset_y + offset.height - bottom;
        } else {
            // debug('not down');
            scrolltop += offset_y - top;
        }
        // debug('scrollIntoView scrolltop', scrolltop, container.scrollTop);
        container.scrollTo(0, scrolltop);
        // debug('new offset', element.getBoundingClientRect());
    }
}

export { getOffset, scrollIntoView };