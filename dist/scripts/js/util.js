"use strict";

define([], function () {
    return {
        canOpen: function canOpen(timestamp) {
            var TODAY = new Date().getTime();
            return TODAY >= timestamp;
        },
        hasOpened: function hasOpened(timestamp) {
            return localStorage.getItem("days_of_giving_" + timestamp);
        }
    };
});
