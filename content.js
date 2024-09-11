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
  const computedStyle = window.getComputedStyle(element);
  
  styles += `${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''} {
    ${Array.from(computedStyle).map(key => `${key}: ${computedStyle.getPropertyValue(key)};`).join('\n')}
  }\n`;
  
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