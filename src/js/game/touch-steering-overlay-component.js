import React from "react";

import {STEERING_LEFT, STEERING_RIGHT, STEERING_STRAIGHT} from "core/src/core/constants.js";

/**
 * Renders 4 invisible touch zones over the full screen for two players sitting on
 * opposite sides of a phone laid flat between them. Layout (looking at the phone
 * from P1's side, the default screen orientation):
 *
 *   ┌───────────────┬───────────────┐
 *   │   P2 RIGHT    │   P2 LEFT     │   (P2 sits on the opposite side, L/R mirrored)
 *   ├───────────────┼───────────────┤
 *   │   P1 LEFT     │   P1 RIGHT    │   (P1 sits on the near side)
 *   └───────────────┴───────────────┘
 *
 * Players passed in must include up to 2 humans; only the first two human players
 * receive touch zones. Bot players (type !== "human") are ignored here.
 */
export default React.createClass({
    propTypes: {
        players: React.PropTypes.array.isRequired,
        onSteeringUpdate: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            // Map from zone key (e.g. "p1L") to whether that zone is currently pressed
            pressed: {p1L: false, p1R: false, p2L: false, p2R: false},
            // Map from touch identifier to zone key, so a lifted finger toggles only its own zone
            touches: {}
        };
    },
    render: function () {
        var humanPlayers = this.props.players.filter(function (p) { return p.type === "human"; });
        var p1 = humanPlayers[0];
        var p2 = humanPlayers[1];

        // Zones cover the entire viewport. Pointer-events on the inner cells only.
        var zoneStyle = {
            position: "absolute",
            width: "50%",
            height: "50%",
            // Make zones invisible but still capture pointer/touch.
            background: "transparent",
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTapHighlightColor: "transparent"
        };

        return (
            <div
                className="touch-steering-overlay"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 600,
                    pointerEvents: "none"
                }}
            >
                {p2 ? this.renderZone("p2R", {top: 0, left: 0}, zoneStyle) : null}
                {p2 ? this.renderZone("p2L", {top: 0, left: "50%"}, zoneStyle) : null}
                {p1 ? this.renderZone("p1L", {top: "50%", left: 0}, zoneStyle) : null}
                {p1 ? this.renderZone("p1R", {top: "50%", left: "50%"}, zoneStyle) : null}
            </div>
        );
    },
    renderZone: function (zoneKey, positionStyle, zoneStyle) {
        var style = Object.assign({}, zoneStyle, positionStyle, {pointerEvents: "auto"});
        return (
            <div
                key={zoneKey}
                data-zone={zoneKey}
                style={style}
                onTouchStart={this.onTouchStart}
                onTouchEnd={this.onTouchEnd}
                onTouchCancel={this.onTouchEnd}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseLeave={this.onMouseUp}
            />
        );
    },
    componentDidMount: function () {
        // Some browsers fire touchend on document instead of the original target if the finger
        // moves outside the zone. Listen at document level too, keyed by touch identifier.
        document.addEventListener("touchend", this.onDocumentTouchEnd);
        document.addEventListener("touchcancel", this.onDocumentTouchEnd);
    },
    componentWillUnmount: function () {
        document.removeEventListener("touchend", this.onDocumentTouchEnd);
        document.removeEventListener("touchcancel", this.onDocumentTouchEnd);
        // Reset everyone to straight on unmount
        var players = this.props.players.filter(function (p) { return p.type === "human"; });
        players.forEach(p => this.props.onSteeringUpdate(p.id, STEERING_STRAIGHT));
    },
    onTouchStart: function (event) {
        event.preventDefault();
        var zoneKey = event.currentTarget.getAttribute("data-zone");
        var touches = Object.assign({}, this.state.touches);
        for (var i = 0; i < event.changedTouches.length; i++) {
            touches[event.changedTouches[i].identifier] = zoneKey;
        }
        var pressed = Object.assign({}, this.state.pressed);
        pressed[zoneKey] = true;
        this.applyZones(pressed, touches);
    },
    onTouchEnd: function (event) {
        event.preventDefault();
        this.handleTouchEnd(event);
    },
    onDocumentTouchEnd: function (event) {
        this.handleTouchEnd(event);
    },
    handleTouchEnd: function (event) {
        var touches = Object.assign({}, this.state.touches);
        var pressed = Object.assign({}, this.state.pressed);
        for (var i = 0; i < event.changedTouches.length; i++) {
            var id = event.changedTouches[i].identifier;
            var zoneKey = touches[id];
            if (zoneKey) {
                delete touches[id];
                // Only release the zone if no other active touch still holds it
                var stillHeld = Object.keys(touches).some(function (k) { return touches[k] === zoneKey; });
                if (!stillHeld) {
                    pressed[zoneKey] = false;
                }
            }
        }
        this.applyZones(pressed, touches);
    },
    onMouseDown: function (event) {
        // Allow desktop testing with a mouse
        event.preventDefault();
        var zoneKey = event.currentTarget.getAttribute("data-zone");
        var pressed = Object.assign({}, this.state.pressed);
        pressed[zoneKey] = true;
        this.applyZones(pressed, this.state.touches);
    },
    onMouseUp: function (event) {
        var zoneKey = event.currentTarget.getAttribute("data-zone");
        var pressed = Object.assign({}, this.state.pressed);
        pressed[zoneKey] = false;
        this.applyZones(pressed, this.state.touches);
    },
    applyZones: function (pressed, touches) {
        this.setState({pressed: pressed, touches: touches});

        var humanPlayers = this.props.players.filter(function (p) { return p.type === "human"; });
        var p1 = humanPlayers[0];
        var p2 = humanPlayers[1];

        if (p1) {
            var p1Steering = STEERING_STRAIGHT;
            if (pressed.p1L) p1Steering += STEERING_LEFT;
            if (pressed.p1R) p1Steering += STEERING_RIGHT;
            this.props.onSteeringUpdate(p1.id, p1Steering);
        }
        if (p2) {
            var p2Steering = STEERING_STRAIGHT;
            if (pressed.p2L) p2Steering += STEERING_LEFT;
            if (pressed.p2R) p2Steering += STEERING_RIGHT;
            this.props.onSteeringUpdate(p2.id, p2Steering);
        }
    }
});
