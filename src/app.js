import { loadMainConfig } from './configManager.js';
import { loadDefaultConfigs } from './configManager.js';

const config_prefix = './config/';

// Main entry point after the DOM has fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Check if mainConfig.yaml exists
    fetch(config_prefix + 'mainConfig.yaml')
        .then(response => {
            if (response.ok) {
                // mainConfig.yaml is present, use the bonus part logic
                loadMainConfig();
            } else {
                // mainConfig.yaml is not present, use the default configuration logic
                loadDefaultConfigs();
            }
        })
        .catch(error => {
            console.error("Error checking for mainConfig.yaml:", error);
            // If there's an error checking the file, default to the regular configuration logic
            loadDefaultConfigs();
        });
});
