// Main entry point after the DOM has fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // List of YAML configuration files to load
    const configFiles = ['config1.yaml', 'config2.yaml'];

    // Load and apply each configuration file
    configFiles.forEach(loadAndApplyConfig);
});

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
