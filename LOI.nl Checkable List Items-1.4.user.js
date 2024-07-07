// ==UserScript==
// @name         LOI.nl Checkable List Items
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Turns list dots into clickable checkboxes that strike out the line when clicked for loi.nl
// @match        *://*.loi.nl/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function initializeCheckboxes() {
        const listItems = document.querySelectorAll('ul li');

        listItems.forEach((li) => {
            if (!li.querySelector('input[type="checkbox"]')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.marginRight = '10px';

                const storedValue = localStorage.getItem(li.id);
                if (storedValue === 'checked') {
                    checkbox.checked = true;
                    li.style.textDecoration = 'line-through';
                }

                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        li.style.textDecoration = 'line-through';
                        localStorage.setItem(li.id, 'checked');
                    } else {
                        li.style.textDecoration = 'none';
                        localStorage.setItem(li.id, 'unchecked');
                    }
                });

                li.insertBefore(checkbox, li.firstChild);
            }
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        ul {
            list-style: none;
            padding-left: 0;
        }
        ul li {
            display: flex;
            align-items: center;
        }
        ul li p {
            margin: 0;
            flex-grow: 1;
        }
        input[type="checkbox"] {
            flex-shrink: 0;
            cursor: pointer;
        }
        .content-styles {
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                initializeCheckboxes();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', initializeCheckboxes);
})();
