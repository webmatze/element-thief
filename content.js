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
  const htmlContent = hoveredElement.outerHTML;
  navigator.clipboard.writeText(htmlContent).then(() => {
    alert('Element HTML copied to clipboard!');
  });
}

document.addEventListener('mouseover', handleMouseOver);
document.addEventListener('mouseout', handleMouseOut);
document.addEventListener('click', handleClick);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleElementThief") {
    toggleElementThief();
  }
});