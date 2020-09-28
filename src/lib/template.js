const fragment = (message, fragmentId, closeButtonId) => `
        <div class="message message__block" id="${fragmentId}">
            <button id="${closeButtonId}" class="message__close"></button>
            <div class="message__content">
                ${message}
            </div> 
        </div>
        <style>
            .message__block {
              position: fixed;
              top: 10%;
              left: 50%;
              transform: translateX(-50%);
              border: 2px solid darkred;
              padding: 2rem;
              border-radius: 10px;
              background: #e8e8e8;
              z-index: 9999999999;
            }
            .message__content {
              display: flex;
              align-items: center;
              height: 50px;
              font-size: 1rem;
              font-family: Arial;
            }
            .message__close {
              position: absolute;
              right: 16px;
              top: 0;
              width: 32px;
              height: 32px;
              opacity: 0.3;
              border: 0;
              cursor: pointer;
            }
            .message__close:hover {
              opacity: 1;
            }
            .message__close:before, .message__close:after {
              position: absolute;
              left: 15px;
              content: ' ';
              height: 16px;
              width: 2px;
              background-color: #000;
            }
            .message__close:before {
              transform: rotate(45deg);
            }
            .message__close:after {
              transform: rotate(-45deg);
            }
        </style>`;

const closeButtonListenerScript = (fragmentId, buttonId, name) => `
      document.getElementById('${buttonId}')
      .addEventListener('click', () => {
        document.getElementById('${fragmentId}').remove();
        localStorage.setItem('${name}IsShowed', true)
      })`;
export { closeButtonListenerScript, fragment as default };
