export class SpotifyControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._duration = 0;
    this._current = 0;
    this._onPlayerUpdate = this._onPlayerUpdate.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
          :host {
              display: block;
          }

          .controls-wrap {
              display: flex;
              flex-direction: column;
              gap: 8px;
              align-items: center;
              padding: 8px;
              justify-content: center;
              width: 100%;
          }

          .controls {
              display: flex;
              gap: 12px;
              align-items: center;
              padding: 0 8px;
              justify-content: center;
          }

          button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border: 0;
              background: transparent;
              color: #fff;
              cursor: pointer;
          }

          .btn-play {
              background: var(--accent, #1DB954);
              box-shadow: 0 6px 18px rgba(29, 185, 84, 0.12);
              width: 56px;
              height: 56px;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
          }

          svg {
              width: 18px;
              height: 18px;
              fill: #fff;
          }

          .btn-ctrl {
              width: 40px;
              height: 40px;
              border-radius: 8px;
              background: transparent;
              color: var(--muted, #b3b3b3);
          }

          .btn-ctrl:hover {
              background: rgba(255, 255, 255, 0.03);
              color: #fff;
          }

          .progress-row {
              display: flex;
              align-items: center;
              gap: 8px;
              width: 100%;
              max-width: 720px;
          }

          .time {
              width: 48px;
              text-align: center;
              color: var(--muted, #b3b3b3);
              font-size: 12px;
          }

          input[type="range"] {
              -webkit-appearance: none;
              appearance: none;
              height: 6px;
              background: rgba(255, 255, 255, 0.06);
              border-radius: 6px;
              flex: 1;
              outline: none;
          }

          input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: var(--accent, #1DB954);
              box-shadow: 0 0 0 6px rgba(29, 185, 84, 0.12);
          }
      </style>

      <div class="controls-wrap">
        <div class="controls">
          <button class="btn-ctrl" id="prev" title="Anterior">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 6v12l-8.5-6zM6 6h2v12H6z"/></svg>
            </button>
          <button class="btn-play" id="toggle" title="Play/Pause">
            <svg id="playIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="btn-ctrl" id="next" title="Siguiente">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6v12l8.5-6zM16 6h2v12h-2z"/></svg>
          </button>
        </div>

        <div class="progress-row" part="progress">
          <div class="time current">0:00</div>
          <input id="ctrlProgress" type="range" min="0" max="100" step="0.1" value="0">
          <div class="time total">0:00</div>
        </div>
      </div>
    `;

    this._btnPrev = this.shadowRoot.getElementById('prev');
    this._btnToggle = this.shadowRoot.getElementById('toggle');
    this._btnNext = this.shadowRoot.getElementById('next');
    this._playIcon = this.shadowRoot.getElementById('playIcon');
    this._ctrlProgress = this.shadowRoot.getElementById('ctrlProgress');
    this._curTime = this.shadowRoot.querySelector('.current');
    this._totTime = this.shadowRoot.querySelector('.total');

    this._btnPrev.addEventListener('click', () => this.emit('prev'));
    this._btnToggle.addEventListener('click', () => this.emit('toggle'));
    this._btnNext.addEventListener('click', () => this.emit('next'));

    this._ctrlProgress.addEventListener('input', () => {
      if (!this._duration || isNaN(this._duration)) 
        return;
      const percent = Number(this._ctrlProgress.value);
      const time = (percent / 100) * this._duration;
      this.dispatchEvent(new CustomEvent('spotify-control', 
        { detail: { action: 'seek', value: time }, 
          bubbles: true, 
          composed: true }));
    });
    this._ctrlProgress.addEventListener('change', () => {
      if (!this._duration || isNaN(this._duration)) 
        return;
      const percent = Number(this._ctrlProgress.value);
      const time = (percent / 100) * this._duration;
      this.dispatchEvent(new CustomEvent('spotify-control',{ 
        detail: { action: 'seek', value: time }, 
        bubbles: true, 
        composed: true }));
    });

    document.addEventListener('player-update', this._onPlayerUpdate);
  }

  disconnectedCallback() {
    this._btnPrev.removeEventListener('click', () => this.emit('prev'));
    this._btnToggle.removeEventListener('click', () => this.emit('toggle'));
    this._btnNext.removeEventListener('click', () => this.emit('next'));
    this._ctrlProgress.removeEventListener('input', () => {});
    this._ctrlProgress.removeEventListener('change', () => {});
    document.removeEventListener('player-update', this._onPlayerUpdate);
  }

  emit(action) {
    this.dispatchEvent(new CustomEvent('spotify-control', {
      detail: { action },
      bubbles: true,
      composed: true
    }));
  }

  _onPlayerUpdate(e) {
    const d = e.detail ?? {};
    const playing = !!d.playing;
    const current = Number(d.currentTime ?? 0);
    const duration = Number(d.duration ?? 0);
    const percent = Number(d.percent ?? 0);

    this._duration = duration;
    this._current = current;

    // actualizar tiempos y barra
    if (this._curTime) this._curTime.textContent = this._formatTime(current);
    if (this._totTime) this._totTime.textContent = this._formatTime(duration);
    if (this._ctrlProgress && !isNaN(percent)) this._ctrlProgress.value = Math.min(Math.max(0, percent), 100);

    // actualizar icono play/pause
    this._setPlaying(playing);
  }

  _setPlaying(isPlaying) {
    if (!this._playIcon) return;
    if (isPlaying) {
      // mostrar icono pause
      this._playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      this._btnToggle.title = 'Pausar';
    } else {
      // mostrar icono play
      this._playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      this._btnToggle.title = 'Reproducir';
    }
  }

  _formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const s = Math.floor(sec % 60).toString().padStart(2,'0');
    const m = Math.floor(sec / 60);
    return `${m}:${s}`;
  }
}

customElements.define('spotify-controls', SpotifyControls);
