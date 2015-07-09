var shapeRenderer = require("./shape-renderer.js");
var renderer = module.exports = {};

renderer.renderShape = shapeRenderer.renderShape.bind(null, shapeRenderer.createRenderLogicMap());