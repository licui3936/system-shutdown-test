export const CONTAINER_ID = 'layout-container';
window.addEventListener('DOMContentLoaded', () => {
    // Before .50 AI version this may throw...
    fin.Platform.Layout.init({ CONTAINER_ID })
    .then((layout) => {
        fin.me.on("view-hidden", function(event) {
            console.log('%o', event);
        });

        fin.me.on("view-shown", function(event) {
            console.log('%o',event);
        });
    })

    // Any manipulations you want to perform to the window before the user can interact
    // with the contents of any of its views should go here.
});