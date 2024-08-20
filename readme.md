# **Dynamic HTML Modification Application**

## **Table of Contents**
- [Introduction](#introduction)
- [Setup and Running the Application](#setup-and-running-the-application)
- [Code Structure Overview](#code-structure-overview)
- [Assumptions](#assumptions)

## **Introduction**

This application dynamically modifies an HTML document based on configurations provided in YAML files. It supports actions such as removing elements, replacing elements, inserting new elements, and altering text content within the DOM. The configurations are applied sequentially based on a defined priority system. The application also supports context-specific configurations, allowing different YAML files to be applied depending on the current page, URL, or host.

## **Setup and Running the Application**

### **Prerequisites**
- A modern web browser.
- A local HTTP server to serve the HTML, JavaScript, and YAML files.

### **Steps to Set Up and Run the Application**

1. **Clone or Download the Repository**
   - Clone this repository to your local machine or download the ZIP file and extract it.

2. **File Structure**
   - Ensure the following files are present in the directory:
     - `demo.html`: The main HTML file that will be modified by default configurations.
     - `list.html`, `details.html`, `cart.html`: Additional HTML files that will be modified based on the specific configurations in `mainConfig.yaml`.
     - `app.js`: The JavaScript file that handles the dynamic modifications.
     - `config1.yaml`, `config2.yaml`: Default YAML configuration files used when `mainConfig.yaml` is not present.
     - `mainConfig.yaml`: A YAML file that maps specific pages, URLs, or hosts to their respective configuration files (`A.yaml`, `B.yaml`).
     - `A.yaml`, `B.yaml`: YAML configuration files used when `mainConfig.yaml` is present.
     - The `js-yaml` library is included via CDN in the HTML files.

3. **Run a Local Server**
   - Use any method to serve the files locally, such as using an integrated development environment (IDE) or a simple HTTP server tool of your choice.

4. **Open the Application in a Browser**
   - To test the default configurations, open `http://localhost:8000/demo.html` in your browser, , ensure that mainConfig.yaml is either temporarily renamed or removed from the directory. This will prevent the application from loading specific configurations based on mainConfig.yaml and will instead use the default YAML files.
   - To test the context-specific configurations, open `http://localhost:8000/list.html`, `http://localhost:8000/details.html`, or `http://localhost:8000/cart.html`.
   - The application will automatically apply the modifications specified in the YAML configuration files to the HTML documents.

## **Code Structure Overview**

### **Files and Directories**
- **`demo.html`**: The main HTML file that will be dynamically modified based on the default configurations (`config1.yaml`, `config2.yaml`).
- **`list.html`, `details.html`, `cart.html`**: Additional HTML files that will be modified according to the mappings in `mainConfig.yaml`.
- **`app.js`**: The core JavaScript file containing all the logic for loading, parsing, and applying the configurations from YAML files.
- **`config1.yaml`, `config2.yaml`**: Default YAML configuration files that define the actions to be applied to `demo.html`. Each action has a type (e.g., remove, replace, insert, alter) and an associated priority.
- **`mainConfig.yaml`**: A YAML file that specifies which YAML configuration files to apply based on the current page, URL, or host.
- **`A.yaml`, `B.yaml`**: YAML configuration files used for specific pages as defined in `mainConfig.yaml`.

### **Key Components in `app.js`**
- **`loadAndApplyConfig(filePath)`**: Loads a YAML configuration file, parses it, and passes the configuration to the validation and application functions.
- **`validateAndApplyConfigurations(config)`**: Validates the configuration structure and sorts actions by priority before applying them.
- **`applyConfigsBasedOnContext(mainConfig)`**: Determines which configuration files to load based on the current host, URL, or page.
- **Action Handlers (`handleRemoveAction`, `handleReplaceAction`, `handleInsertAction`, `handleAlterAction`)**: These functions perform specific DOM manipulations based on the action type.

### **Assumptions**
- **Priority System**: Actions in the YAML files are assumed to have a `priority` attribute. Actions with lower priority numbers are applied first.
- **Valid HTML Structure**: The HTML document is well-formed, and the selectors used in the YAML files correspond to existing elements in the DOM.
- **Basic YAML Structure**: The YAML files are assumed to be correctly formatted and follow the expected structure (e.g., having `actions`, `type`, `selector`, `priority` fields).
- **Context-Specific Configurations**: The application assumes that `mainConfig.yaml` will correctly map specific pages, URLs, or hosts to their corresponding YAML configuration files.