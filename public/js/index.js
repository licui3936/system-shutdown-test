
if (typeof fin !== 'undefined') {
    initialise();
} else {
    document.querySelector('#of-version').innerText =
        'The fin API is not available - you are probably running in a browser.';
}

// once the DOM has loaded and the OpenFin API is ready
async function initialise() {

    fin.System.startCrashReporter({ diagnosticsMode: false });

    const view = fin.View.getCurrentSync();
    const win = await view.getCurrentWindow();

    const ofVersion = document.querySelector('#of-version');
    ofVersion.innerText = await fin.System.getVersion();


    // subscribing to the run-requested events will allow us to react to secondary launches, clicking on the icon once the Application is running for example.
    // for this app we will  launch a child window the first the user clicks on the desktop.
    const platformWindowBtn = document.querySelector('#platform-window');
    platformWindowBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const pltfm = fin.Platform.getCurrentSync();
        let myWin = await pltfm.createWindow({
            url: "http://127.0.0.1:5555/main.html",
            name: "Dynamic Generated Platform Window",
            contextMenu: true,
            contextMenuSettings: { enable: true, devtools: true, reload: true },
            processAffinity: "platformProcess",
            layout: {
                content: [
                    {
                        type: 'stack',
                        content: [
                            {
                                type: 'component',
                                componentName: 'view',
                                componentState: {
                                    name: 'child_view',
                                    url: 'http://127.0.0.1:5555/child.html'
                                }
                            }
                        ]
                    }
                ]
            }
        });

    });

    let childWinIdentity = null;

    let count = 0;

    const childWindowBtn = document.querySelector('#child-window');
    childWindowBtn.addEventListener('click', async (e) => {

        count += 1;
        childWinIdentity = await fin.Window.create(
            {
                name: 'child' + count,
                // maxHeight: 144,
                autoShow: true,
                //alwaysOnTop: true,
                //defaultWidth: 94,
                //minWidth: 94,
                //defaultCentered: false,
                frame: true,
                //resizable: false,
                //showTaskbarIcon: false,
                //minimizable: false,
                //smallWindow: true,
                //maximizable: false,
                //saveWindowState: false,
                //includeInSnapshots: false,
                url: 'http://127.0.0.1:5555/child.html', // The URL of the View
                accelerator: {
                    zoom: true
                },
                processAffinity: "childProcess",
                permissions: {
                    System: {
                        launchExternalProcess: true
                    },
                    webAPIs: [
                        "openExternal"
                    ]
                }
            });

        childWinIdentity.disableUserMovement();
        childWinIdentity.addListener('disabled-movement-bounds-changing', d => console.log(d));

    });

    const newViewBtn = document.querySelector('#new-view');
    newViewBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const pltfm = fin.Platform.getCurrentSync();
        pltfm.createView({ url: "http://localhost:5555/index.html" }, win.identity, fin.me.identity)
    })

    const nonOFwindow = document.querySelector('#nonOFwindow');
    nonOFwindow.addEventListener('click', async (e) => {
        e.preventDefault();

        window.open("https://www.wikipedia.org", "nonOFwindow")
    })

}
