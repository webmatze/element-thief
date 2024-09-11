let isActive = false;
let hoveredElement = null;

function toggleElementThief() {
  isActive = !isActive;
  document.body.style.cursor = isActive ? 'crosshair' : 'default';
}

function handleMouseOver(event) {
  if (!isActive) return;
  
  if (hoveredElement) {
    hoveredElement.style.outline = '';
  }
  
  hoveredElement = event.target;
  hoveredElement.style.outline = '2px solid red';
}

function handleMouseOut(event) {
  if (!isActive) return;
  
  if (hoveredElement) {
    hoveredElement.style.outline = '';
    hoveredElement = null;
  }
}

function handleClick(event) {
  if (!isActive || !hoveredElement) return;
  
  event.preventDefault();
  
  // Get the HTML content
  hoveredElement.style.outline = '';
  const htmlContent = hoveredElement.outerHTML;
  
  // Get the computed styles for the element and its sub-elements
  const styles = getComputedStylesRecursive(hoveredElement);
  
  // Combine HTML and styles
  const fullContent = `
    <style>
    ${styles}
    </style>
    ${htmlContent}
  `;
  
  navigator.clipboard.writeText(fullContent).then(() => {
    alert('Element HTML and styles copied to clipboard!');
  });
}

function getComputedStylesRecursive(element) {
  let styles = '';

  function getSpecifiedStyles(el) {
    const computedStyles = getComputedStyle(el);
    const tempElement = document.createElement(el.tagName);
    document.body.appendChild(tempElement);
    const defaultStyles = getComputedStyle(tempElement);
    let specifiedStyles = {};

    for (const prop in computedStyles) {
      // Check if the property is specified in a stylesheet or different from default
      if (el.style.getPropertyValue(prop) || computedStyles[prop] !== defaultStyles[prop]) {
        const cssProperty = prop.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        specifiedStyles[cssProperty] = computedStyles[prop];
      }
    }

    document.body.removeChild(tempElement);

    return specifiedStyles;
  }

  const specifiedStyles = getSpecifiedStyles(element);
  if (Object.keys(specifiedStyles).length > 0) {
    styles += `${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''} {
      ${Object.entries(specifiedStyles).map(([key, value]) => `${key}: ${value};`).join('\n')}
    }\n`;
  }
  
  for (const child of element.children) {
    styles += getComputedStylesRecursive(child);
  }
  
  return styles;
}

document.addEventListener('mouseover', handleMouseOver);
document.addEventListener('mouseout', handleMouseOut);
document.addEventListener('click', handleClick);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleElementThief") {
    toggleElementThief();
  }
});