document.addEventListener("DOMContentLoaded", function() {
    // Load the YAML file
    fetch('config.yaml')
        .then(response => response.text())
        .then(yamlString => {
            // Parse the YAML to JSON
            const config = jsyaml.load(yamlString);

            function removeElements(selector) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => element.remove());
            }

            function replaceElements(selector, newElement) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    const newEl = document.createRange().createContextualFragment(newElement);
                    element.replaceWith(newEl);
                });
            }

            function insertElement(position, targetSelector, newElement) {
                const target = document.querySelector(targetSelector);
                if (!target) return;

                const newEl = document.createRange().createContextualFragment(newElement);
                
                switch(position) {
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
                }
            }

            function alterTextContent(oldValue, newValue) {
                document.body.innerHTML = document.body.innerHTML.replace(new RegExp(oldValue, 'g'), newValue);
            }

            function applyConfigurations(config) {
                // Sort actions by priority
                const sortedActions = config.actions.sort((a, b) => a.priority - b.priority);

                sortedActions.forEach(action => {
                    switch(action.type) {
                        case 'remove':
                            removeElements(action.selector);
                            break;
                        case 'replace':
                            replaceElements(action.selector, action.newElement);
                            break;
                        case 'insert':
                            insertElement(action.position, action.target, action.element);
                            break;
                        case 'alter':
                            alterTextContent(action.oldValue, action.newValue);
                            break;
                    }
                });
            }

            // Apply the configurations
            applyConfigurations(config);
        })
        .catch(error => console.error('Error loading the YAML file:', error));
});
