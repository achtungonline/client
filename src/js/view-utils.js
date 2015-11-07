var viewUtils = module.exports = {};

viewUtils.addClass = function(element, newClass) {
    element.className = (element.className) ? " " + newClass : newClass;
};
