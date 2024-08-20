// Main entry point after the DOM has fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Check if mainConfig.yaml exists
    fetch('mainConfig.yaml')
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

/**
 * Loads and applies configurations based on the context (host, URL, or page)
 * as specified in the mainConfig.yaml file.
 */
function loadMainConfig() {
    fetch('mainConfig.yaml')
        .then(response => response.text()) // Fetch the content of the main configuration file
        .then(yamlString => {
            try {
                const mainConfig = jsyaml.load(yamlString); // Parse the YAML content into a JavaScript object
                applyConfigsBasedOnContext(mainConfig); // Apply the configurations based on the current context
            } catch (error) {
                console.error("Error parsing main configuration file:", error); // Log parsing errors
            }
        })
        .catch(error => {
            console.error("Error loading main configuration file:", error); // Log errors related to loading the file
        });
}

/**
 * Loads and applies default configurations if mainConfig.yaml is not present.
 * This serves as the fallback mechanism.
 */
function loadDefaultConfigs() {
    // Default list of YAML configuration files to load
    const configFiles = ['config1.yaml', 'config2.yaml'];

    // Load and apply each configuration file
    configFiles.forEach(loadAndApplyConfig);
}

/**
 * Applies the appropriate configuration files based on the current context
 * (host, URL, or page) as defined in the main configuration object.
 * @param {Object} mainConfig - The parsed main configuration object from mainConfig.yaml.
 */
function applyConfigsBasedOnContext(mainConfig) {
    const currentHost = window.location.hostname; // Get the current hostname (e.g., example.com)
    const currentPath = window.location.pathname; // Get the current path (e.g., /products)

    let configFilesToLoad = []; // Initialize an array to hold configuration files to load

    // Check by host
    if (mainConfig.datasource.hosts && mainConfig.datasource.hosts[currentHost]) {
        configFilesToLoad = configFilesToLoad.concat(mainConfig.datasource.hosts[currentHost]);
    }

    // Check by URL path
    if (mainConfig.datasource.urls && mainConfig.datasource.urls[currentPath]) {
        configFilesToLoad = configFilesToLoad.concat(mainConfig.datasource.urls[currentPath]);
    }

    // Check by page
    const page = identifyPage(); // Determine the current page using custom logic
    if (mainConfig.datasource.pages && mainConfig.datasource.pages[page]) {
        configFilesToLoad = configFilesToLoad.concat(mainConfig.datasource.pages[page]);
    }

    // Remove duplicates and load all specified configuration files
    const uniqueConfigFiles = [...new Set(configFilesToLoad)]; // Ensure each file is only loaded once
    uniqueConfigFiles.forEach(loadAndApplyConfig); // Load and apply each configuration file
}

/**
 * Identifies the current page based on the URL path or other criteria.
 * @returns {string|null} - The identified page, or null if no specific page is identified.
 */
function identifyPage() {
    if (window.location.pathname.includes('list')) {
        return 'list';
    }
    if (window.location.pathname.includes('details')) {
        return 'details';
    }
    if (window.location.pathname.includes('cart')) {
        return 'cart';
    }
    return null; // Return null if no specific page is identified
}


/**
 * Loads a YAML configuration file and applies its actions to the DOM.
 * @param {string} filePath - The path to the YAML configuration file.
 */
function loadAndApplyConfig(filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load configuration file: ${filePath}`);
            }
            return response.text();
        })
        .then(yamlString => {
            try {
                const config = jsyaml.load(yamlString);
                validateAndApplyConfigurations(config);
            } catch (error) {
                console.error(`Error parsing YAML file: ${filePath}`, error);
            }
        })
        .catch(error => {
            console.error(`Error loading configuration file: ${filePath}`, error);
        });
}

/**
 * Validates and applies the configurations in the YAML file.
 * @param {Object} config - The parsed configuration object.
 */
function validateAndApplyConfigurations(config) {
    if (!config.actions || !Array.isArray(config.actions)) {
        console.error("Invalid configuration format: Missing or invalid 'actions' array.");
        return;
    }

    // Sort actions by priority
    const sortedActions = config.actions.sort((a, b) => a.priority - b.priority);

    // Apply each action
    sortedActions.forEach(action => {
        switch (action.type) {
            case 'remove':
                handleRemoveAction(action);
                break;
            case 'replace':
                handleReplaceAction(action);
                break;
            case 'insert':
                handleInsertAction(action);
                break;
            case 'alter':
                handleAlterAction(action);
                break;
            default:
                console.error(`Unsupported action type: ${action.type}`);
        }
    });
}

/**
 * Handles the 'remove' action type.
 * @param {Object} action - The action object containing the selector.
 */
function handleRemoveAction(action) {
    if (!action.selector) {
        console.error("Remove action missing 'selector' property.");
        return;
    }
    const elements = document.querySelectorAll(action.selector);
    elements.forEach(element => element.remove());
}

/**
 * Handles the 'replace' action type.
 * @param {Object} action - The action object containing the selector and newElement.
 */
function handleReplaceAction(action) {
    if (!action.selector || !action.newElement) {
        console.error("Replace action missing 'selector' or 'newElement' property.");
        return;
    }
    const elements = document.querySelectorAll(action.selector);
    elements.forEach(element => {
        const newEl = document.createRange().createContextualFragment(action.newElement);
        element.replaceWith(newEl);
    });
}

/**
 * Handles the 'insert' action type.
 * @param {Object} action - The action object containing position, target, and element.
 */
function handleInsertAction(action) {
    if (!action.position || !action.target || !action.element) {
        console.error("Insert action missing 'position', 'target', or 'element' property.");
        return;
    }
    const target = document.querySelector(action.target);
    if (!target) {
        console.error(`Insert action target not found: ${action.target}`);
        return;
    }
    const newEl = document.createRange().createContextualFragment(action.element);

    switch (action.position) {
        case 'before':
            target.parentNode.insertBefore(newEl, target);
            break;
        case 'after':
            target.parentNode.insertBefore(newEl, target.nextSibling);
            break;
        case 'append':
            target.appendChild(newEl);
            break;
        case 'prepend':
            target.insertBefore(newEl, target.firstChild);
            break;
        default:
            console.error(`Unsupported insert position: ${action.position}`);
    }
}

/**
 * Handles the 'alter' action type.
 * @param {Object} action - The action object containing oldValue and newValue.
 */
function handleAlterAction(action) {
    if (!action.oldValue || !action.newValue) {
        console.error("Alter action missing 'oldValue' or 'newValue' property.");
        return;
    }
    const regex = new RegExp(action.oldValue, 'g');
    document.body.innerHTML = document.body.innerHTML.replace(regex, action.newValue);
}
