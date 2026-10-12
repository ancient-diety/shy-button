(() => {
    const installButton = document.querySelector("#install-app");
    const installHelp = document.querySelector("#install-help");
    const closeHelp = document.querySelector("#close-install-help");
    let installPrompt = null;

    const isInstalled = () => window.matchMedia("(display-mode: standalone)").matches
        || window.navigator.standalone === true;

    if (isInstalled()) installButton.hidden = true;

    window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        installPrompt = event;
    });

    installButton.addEventListener("click", async () => {
        if (!installPrompt) {
            installHelp.showModal();
            return;
        }

        const prompt = installPrompt;
        installPrompt = null;
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === "accepted") installButton.hidden = true;
    });

    closeHelp.addEventListener("click", () => installHelp.close());
    installHelp.addEventListener("click", event => {
        if (event.target === installHelp) installHelp.close();
    });

    window.addEventListener("appinstalled", () => {
        installPrompt = null;
        installButton.hidden = true;
    });

    if ("serviceWorker" in navigator && window.isSecureContext) {
        navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
            .catch(error => console.error("Sunset Arcade could not enable offline play:", error));
    }
})();
