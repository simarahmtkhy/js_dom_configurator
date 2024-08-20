# **Dynamic HTML Modification Application**

## **Table of Contents**
- [Introduction](#introduction)
- [Setup and Running the Application](#setup-and-running-the-application)
- [Code Structure Overview](#code-structure-overview)
- [Assumptions](#assumptions)

## **Introduction**

This application dynamically modifies an HTML document based on configurations provided in YAML files. It supports actions such as removing elements, replacing elements, inserting new elements, and altering text content within the DOM. The configurations are applied sequentially based on a defined priority system.

## **Setup and Running the Application**

### **Prerequisites**
- A modern web browser.
- A local HTTP server to serve the HTML, JavaScript, and YAML files.

### **Steps to Set Up and Run the Application**

1. **Clone or Download the Repository**
   - Clone this repository to your local machine or download the ZIP file and extract it.

2. **File Structure**
   - Ensure the following files are present in the directory:
     - `demo.html`: The main HTML file.
     - `app.js`: The JavaScript file that handles the dynamic modifications.
     - `config1.yaml`, `config2.yaml`, etc.: One or more YAML configuration files.
     - The `js-yaml` library is included via CDN in the HTML file.

3. **Run a Local Server**

4. **Open the Application in a Browser**
   - The application will automatically apply the modifications specified in the YAML configuration files to the HTML document.

## **Code Structure Overview**

### **Files and Directories**
- **`demo.html`**: The main HTML file that will be dynamically modified based on the configurations.
- **`app.js`**: The core JavaScript file containing all the logic for loading, parsing, and applying the configurations from YAML files.
- **`config1.yaml`, `config2.yaml`, etc.**: YAML configuration files that define the actions to be applied to the HTML document. Each action has a type (e.g., remove, replace, insert, alter) and an associated priority.

### **Key Components in `app.js`**
- **`loadAndApplyConfig(filePath)`**: Loads a YAML configuration file, parses it, and passes the configuration to the validation and application functions.
- **`validateAndApplyConfigurations(config)`**: Validates the configuration structure and sorts actions by priority before applying them.
- **Action Handlers (`handleRemoveAction`, `handleReplaceAction`, `handleInsertAction`, `handleAlterAction`)**: These functions perform specific DOM manipulations based on the action type.

## **Assumptions and Limitations**

### **Assumptions**
- **Priority System**: Actions in the YAML files are assumed to have a `priority` attribute. Actions with lower priority numbers are applied first.
- **Valid HTML Structure**: The HTML document is well-formed, and the selectors used in the YAML files correspond to existing elements in the DOM.
- **Basic YAML Structure**: The YAML files are assumed to be correctly formatted and follow the expected structure (e.g., having `actions`, `type`, `selector`, `priority` fields).

