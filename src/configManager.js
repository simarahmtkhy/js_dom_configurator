import { validateAndApplyConfigurations } from './actionHandler.js';
import { identifyPage } from './utils.js';

const config_prefix = './config/';
/**
 * Loads and applies configurations based on the context (host, URL, or page)
 * as specified in the mainConfig.yaml file.
 */
export function loadMainConfig() {
    fetch(config_prefix + 'mainConfig.yaml')
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
export function loadDefaultConfigs() {
    // Default list of YAML configuration files to load
    const configFiles = ['config/config1.yaml', 'config/config2.yaml'];

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
        configFilesToLoad = configFilesToLoad.concat(
            [].concat(mainConfig.datasource.hosts[currentHost]).map(file => config_prefix + file)
        );
    }

    // Check by URL path
    if (mainConfig.datasource.urls && mainConfig.datasource.urls[currentPath]) {
        configFilesToLoad = configFilesToLoad.concat(
            [].concat(mainConfig.datasource.urls[currentPath]).map(file => config_prefix + file)
        );
    }

    // Check by page
    const page = identifyPage();
    if (mainConfig.datasource.pages && mainConfig.datasource.pages[page]) {
        configFilesToLoad = configFilesToLoad.concat(
            [].concat(mainConfig.datasource.pages[page]).map(file => config_prefix + file)
        );
    }

    // Remove duplicates and load all specified configuration files
    const uniqueConfigFiles = [...new Set(configFilesToLoad)]; // Ensure each file is only loaded once
    uniqueConfigFiles.forEach(loadAndApplyConfig); // Load and apply each configuration file
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