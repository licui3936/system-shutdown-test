(async function () {
    
    const overrideCallback = (PlatformProvider) => {
        class Override extends PlatformProvider {
            async getUserDecisionForBeforeUnload(payload, callerIdentity) {
                const { windowShouldClose, viewsPreventingUnload, viewsNotPreventingUnload, windowId, closeType } = payload;
    
                // launch dialog and wait for user response
                const continueWithClose = await showDialog(viewsPreventingUnload, windowId, closeType);
    
                if (continueWithClose) {
                    return { windowShouldClose, viewsToClose: [...viewsNotPreventingUnload, ...viewsPreventingUnload] };
                } else {
                    return { windowShouldClose: false, viewsToClose: [] };
                }
            }
        }
        return new Override();
    }

    await fin.Platform.init({ overrideCallback });

    async function showDialog(viewsPreventingUnload, windowId, closeType) {
        // Show a dialog and await for user response
    }
})();