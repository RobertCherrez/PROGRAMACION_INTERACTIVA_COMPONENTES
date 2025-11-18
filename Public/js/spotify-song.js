export class SpotifySong extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode:'open'});
    const songName = this.getAttribute('song-name') ?? '';
    const cover = this.getAttribute('cover-path') ?? '';
    const duration = this.getAttribute('duration') ?? '';
    const index = this.getAttribute('index') ?? '0';

    shadow.innerHTML = `
      <style>
          :host {
            display: block;
          }

          .songItem {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 8px 0;
            gap: 10px;
            padding: 6px 8px;
            border-radius: 8px;
            transition: background 0.12s;
          }

          .songItem:hover {
            background: rgba(255, 255, 255, 0.21);
          }

          img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 6px;
          }

          .songName {
            flex: 1;
            margin-left: 10px;
            font-size: 14px;
            color: #fff;
          }

          .timestamp {
            cursor: pointer;
            color: var(--muted, #b3b3b3);
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
          }

          :host(.active) {
            background: rgba(29, 185, 84, 0.08);
            border-radius: 6px;
            padding: 4px;
          }

          .play-icon {
            width: 18px;
            height: 18px;
            display: inline-block;
            color: var(--muted, #b3b3b3);
          }
      </style>

      <div class="songItem" part="song" role="button" tabindex="0">
        <img src="${cover}" alt="${songName}">
        <span class="songName">${songName}</span>
        <span class="timestamp">${duration} <span class="play-icon" id="play-${index}">▶</span></span>
      </div>
    `;

    const container = shadow.querySelector('.songItem');
    const icon = shadow.querySelector('.play-icon');

    const dispatchPlay = () => {
      this.dispatchEvent(new CustomEvent('play-song', {
        detail: { 
          index: Number(index), 
          songName, file: this.getAttribute('file-path') },
          bubbles:true, 
          composed:true
      }));
    };

    container.addEventListener('click', (e) => {
      dispatchPlay();
    });

    // también el icon (misma acción)
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      dispatchPlay();
    });

    // accesibilidad: Enter / Space
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dispatchPlay();
      }
    });
  }
}

customElements.define('spotify-song', SpotifySong);


