
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

    const messageWindowBtn = document.querySelector('#message-window');
    messageWindowBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        fin.System.launchExternalProcess({alias: 'messageWin'});
    })    

    // subscribing to the run-requested events will allow us to react to secondary launches, clicking on the icon once the Application is running for example.
    // for this app we will  launch a child window the first the user clicks on the desktop.
    const platformWindowBtn = document.querySelector('#platform-window');
    platformWindowBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const pltfm = fin.Platform.getCurrentSync();
        const time = Date.now();
        await pltfm.createWindow({
            url: "http://localhost:5555/main.html",
            name: "platform_window_" + time,
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
                                    url: 'http://localhost:5555/child.html'
                                }
                            }
                        ]
                    }
                ]
            }
        });

    });

    const platformWindowHandlerBtn = document.querySelector('#platform-window-handler');
    platformWindowHandlerBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const pltfm = fin.Platform.getCurrentSync();
        const time = Date.now();
        const win = await pltfm.createWindow({
            url: "http://localhost:5555/main.html",
            name: "platform_window_" + time,
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
                                    url: 'http://localhost:5555/child.html'
                                }
                            }
                        ]
                    }
                ]
            }
        });
        const code = `
            console.log(JSON.stringify(fin.me.identity));
            fin.System.registerShutdownHandler(proceed => {
                console.log('do cleanup in platform window');
                proceed();
            })
        `;
        await win.executeJavaScript(code);
    });

    const childWindowBtn = document.querySelector('#child-window');
    childWindowBtn.addEventListener('click', async (e) => {
        const time = Date.now();
        await fin.Window.create(
            {
                name: 'child_window' + time,
                autoShow: true,
                frame: true,
                url: 'http://localhost:5555/child.html', // The URL of the View
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
    });

    const childWindowHandlerBtn = document.querySelector('#child-window-handler');
    childWindowHandlerBtn.addEventListener('click', async (e) => {
        const time = Date.now();
        const win = await fin.Window.create(
            {
                name: 'child_window' + time,
                autoShow: true,
                frame: true,
                url: 'http://localhost:5555/child.html', // The URL of the View
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
        const code = `
            console.log(JSON.stringify(fin.me.identity));
            fin.System.registerShutdownHandler(proceed => {
                console.log('do cleanup in child window');
                proceed();
            })
        `;
        await win.executeJavaScript(code);
    });

    const newViewBtn = document.querySelector('#new-view');
    newViewBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const pltfm = fin.Platform.getCurrentSync();
        await pltfm.createView({ url: "http://google.com" }, win.identity, fin.me.identity);
    });

    const newViewHandlerBtn = document.querySelector('#new-view-handler');
    newViewHandlerBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const pltfm = fin.Platform.getCurrentSync();
        const view = await pltfm.createView({ url: "http://google.com" }, win.identity, fin.me.identity);
        const code = `
            console.log(JSON.stringify(fin.me.identity));
            fin.System.registerShutdownHandler(proceed => {
                console.log('do cleanup in view');
                proceed();
            })
        `;
        await view.executeJavaScript(code);
    });
}
