/**
* Copyright 2012-2017, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/


'use strict';

var Lib = require('../../lib');

var subTypes = require('../scatter/subtypes');
var handleMarkerDefaults = require('../scatter/marker_defaults');
var handleLineDefaults = require('../scatter/line_defaults');
var handleTextDefaults = require('../scatter/text_defaults');
var handleFillColorDefaults = require('../scatter/fillcolor_defaults');

var attributes = require('./attributes');


module.exports = function supplyDefaults(traceIn, traceOut, defaultColor, layout) {
    function coerce(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    var len = handleLonLatDefaults(traceIn, traceOut, coerce);
    if(!len) {
        traceOut.visible = false;
        return;
    }

    coerce('text');
    coerce('hovertext');
    coerce('mode');

    if(subTypes.hasLines(traceOut)) {
        handleLineDefaults(traceIn, traceOut, defaultColor, layout, coerce, {noDash: true});
        coerce('connectgaps');
    }

    if(subTypes.hasMarkers(traceOut)) {
        handleMarkerDefaults(traceIn, traceOut, defaultColor, layout, coerce, {noLine: true});

        // array marker.size and marker.color are only supported with circles

        var marker = traceOut.marker;
        // we need  mock marker.line object to make legends happy
        marker.line = {width: 0};

        if(marker.symbol !== 'circle') {
            if(Array.isArray(marker.size)) marker.size = marker.size[0];
            if(Array.isArray(marker.color)) marker.color = marker.color[0];
        }
    }

    if(subTypes.hasText(traceOut)) {
        handleTextDefaults(traceIn, traceOut, layout, coerce);
    }

    coerce('fill');
    if(traceOut.fill !== 'none') {
        handleFillColorDefaults(traceIn, traceOut, defaultColor, coerce);
    }

    coerce('hoverinfo', (layout._dataLength === 1) ? 'lon+lat+text' : undefined);
};

function handleLonLatDefaults(traceIn, traceOut, coerce) {
    var lon = coerce('lon') || [];
    var lat = coerce('lat') || [];
    var len = Math.min(lon.length, lat.length);

    if(len < lon.length) traceOut.lon = lon.slice(0, len);
    if(len < lat.length) traceOut.lat = lat.slice(0, len);

    return len;
}
