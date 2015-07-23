module.exports = function WormRenderer(shapeRenderer) {
    function render(worm) {
        worm.body.forEach(function (shape) {
            shapeRenderer.render(shape, "red");
        });

        shapeRenderer.render(worm.head, "yellow");
    }

    return {
        render: render
    };
};