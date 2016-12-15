define([], function() {
    return {
        canOpen(timestamp) {
            const TODAY = new Date().getTime();
            return TODAY >= timestamp;
        },

        hasOpened(timestamp) {
            return localStorage.getItem(`days_of_giving_${timestamp}`);
        }
    };
});
