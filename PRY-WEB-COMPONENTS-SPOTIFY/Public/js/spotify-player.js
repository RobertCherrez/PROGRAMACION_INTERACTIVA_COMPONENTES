export class SpotifyPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.audio = document.createElement('audio');
    this.currentIndex = 0;
    this.onPlaySong = this.onPlaySong.bind(this);
    this.onControl = this.onControl.bind(this);
    this.onEnded = this.onEnded.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
    this.onSeek = this.onSeek.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this._onPause = this._onPause.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
          :host {
            display: block;
            font-family: Arial, Helvetica, sans-serif;
            color: #fff;
          }

          .player {
            display: flex;
            gap: 12px;
            align-items: center;
            padding: 10px;
            border-radius: 8px;
            background: transparent;
          }

          .cover {
            width: 72px;
            height: 72px;
            object-fit: cover;
            border-radius: 6px;
            background: #222;
          }

          .meta {
            display: flex;
            flex-direction: column;
          }

          .title {
            font-weight: 700;
            font-size: 15px;
          }

          .status {
            font-size: 12px;
            color: var(--muted, #b3b3b3);
          }

          .progress-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
            display: none;
          }

          .time {
            font-size: 12px;
            color: var(--muted, #b3b3b3);
            width: 42px;
            text-align: center;
          }

          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            height: 6px;
            background: rgba(255, 255, 255, 0.08);
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

          input[type="range"]::-moz-range-thumb {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--accent, #1DB954);
          }

          slot {
            display: block;
            margin-top: 12px;
          }
        </style>

      <div class="player" part="player">
        <img class="cover" src="" alt="cover">
        <div class="meta">
          <div class="title">No song selected</div>
          <div class="status">Stopped</div>
          <div class="progress-wrap">
            <div class="time current">0:00</div>
            <input type="range" class="progress" min="0" max="100" value="0">
            <div class="time total">0:00</div>
          </div>
        </div>
      </div>
      <slot></slot>
    `;
    this.shadowRoot.appendChild(this.audio);

    // referencias de los elementos internos
    this._progressEl = this.shadowRoot.querySelector('.progress');
    this._currentTimeEl = this.shadowRoot.querySelector('.current');
    this._totalTimeEl = this.shadowRoot.querySelector('.total');
    this._statusEl = this.shadowRoot.querySelector('.status');
    this._cover = this.shadowRoot.querySelector('.cover');
    this._title = this.shadowRoot.querySelector('.title');

    // eventos
    this.addEventListener('play-song', this.onPlaySong);
    document.addEventListener('spotify-control', this.onControl);
    this.audio.addEventListener('ended', this.onEnded);
    this.audio.addEventListener('timeupdate', this.onTimeUpdate);
    this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.addEventListener('play', this._onPlay);
    this.audio.addEventListener('pause', this._onPause);
    this._progressEl.addEventListener('input', this.onSeek);
    this._progressEl.addEventListener('change', this.onSeek);

    this.updateStatus();

    // Restaurar última canción al cargar
    const saved = JSON.parse(localStorage.getItem('spotify-player-state') || '{}');
    if (saved && typeof saved.index === 'number') {
      setTimeout(() => {
        this.playIndex(saved.index);
        if (saved.time && !isNaN(saved.time)) {
          this.audio.currentTime = saved.time;
        }
        if (!saved.playing) this.audio.pause();
      }, 500);
    }
  }

  disconnectedCallback() {
    this.removeEventListener('play-song', this.onPlaySong);
    document.removeEventListener('spotify-control', this.onControl);
    this.audio.removeEventListener('ended', this.onEnded);
    this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
    this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.removeEventListener('play', this._onPlay);
    this.audio.removeEventListener('pause', this._onPause);
    this._progressEl.removeEventListener('input', this.onSeek);
    this._progressEl.removeEventListener('change', this.onSeek);
  }

  getSongElements() {
    return Array.from(this.querySelectorAll('spotify-song'));
  }

  normalizeIndex(i) {
    const list = this.getSongElements();
    if (list.length === 0) return 0;
    if (i < 0) return list.length - 1;
    if (i >= list.length) return 0;
    return i;
  }

  async playIndex(i) {
    const list = this.getSongElements();
    if (list.length === 0) return;
    const idx = this.normalizeIndex(i);
    let songEl = list.find(s => Number(s.getAttribute('index')) === idx) ?? list[idx];
    if (!songEl) return;

    const src = songEl.getAttribute('file-path') ?? '';
    const cover = songEl.getAttribute('cover-path') ?? '';
    const title = songEl.getAttribute('song-name') ?? 'Sin nombre';

    this.currentIndex = idx;
    if (src) {
      this.audio.src = src;
      try { await this.audio.play(); } catch (err) {}
    }

    // actualizar UI
    this._cover.src = cover || '';
    this._cover.alt = title;
    this._title.textContent = title;
    this.updateStatus();

    // marcar activo
    list.forEach(s => {
      const isActive = Number(s.getAttribute('index')) === this.currentIndex;
      s.classList.toggle('active', isActive);
    });

    this.saveState();
    this.emitPlayerUpdate();
  }

  onPlaySong(e) {
    const idx = Number(e.detail?.index ?? 0);
    this.playIndex(idx);
  }

  onControl(e) {
    const action = e.detail?.action;
    if (!action) return;
    if (action === 'play') this.audio.play().catch(()=>{});
    else if (action === 'pause') this.audio.pause();
    else if (action === 'next') this.playIndex(this.currentIndex + 1);
    else if (action === 'prev') this.playIndex(this.currentIndex - 1);
    else if (action === 'toggle') {
      if (this.audio.paused) this.audio.play().catch(()=>{}); else this.audio.pause();
    }
    else if (action === 'seek') {
      const time = Number(e.detail?.value ?? NaN);
      if (!isNaN(time) && this.audio.duration && !isNaN(this.audio.duration)) {
        this.audio.currentTime = Math.min(Math.max(0, time), this.audio.duration);
      }
    }
    this.updateStatus();
    this.emitPlayerUpdate();
    this.saveState();
  }

  onEnded() {
    this.playIndex(this.currentIndex + 1);
  }

  onTimeUpdate() {
    if (!this.audio.duration || isNaN(this.audio.duration)) return;
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    this._progressEl.value = percent;
    this._currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    this.saveState();
    this.emitPlayerUpdate();
  }

  onLoadedMetadata() {
    if (!this.audio.duration || isNaN(this.audio.duration)) return;
    this._totalTimeEl.textContent = this.formatTime(this.audio.duration);
    this.emitPlayerUpdate();
  }

  onSeek(e) {
    if (!this.audio.duration || isNaN(this.audio.duration)) return;
    const percent = Number(this._progressEl.value);
    const time = (percent / 100) * this.audio.duration;
    this.audio.currentTime = time;
    this.saveState();
    this.emitPlayerUpdate();
  }

  _onPlay() { this.updateStatus(); this.emitPlayerUpdate(); this.saveState(); }
  _onPause() { this.updateStatus(); this.emitPlayerUpdate(); this.saveState(); }

  updateStatus() {
    if (this._statusEl) this._statusEl.textContent = this.audio.paused ? 'Paused' : 'Playing';
  }

  emitPlayerUpdate() {
    const detail = {
      playing: !this.audio.paused,
      currentTime: this.audio.currentTime || 0,
      duration: this.audio.duration || 0,
      percent: (this.audio.duration && !isNaN(this.audio.duration)) ? (this.audio.currentTime / this.audio.duration) * 100 : 0,
      index: this.currentIndex
    };
    this.dispatchEvent(new CustomEvent('player-update', {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  saveState() {
    const state = {
      index: this.currentIndex,
      time: this.audio.currentTime || 0,
      playing: !this.audio.paused
    };
    localStorage.setItem('spotify-player-state', JSON.stringify(state));
  }

  formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const s = Math.floor(sec % 60).toString().padStart(2,'0');
    const m = Math.floor(sec / 60);
    return `${m}:${s}`;
  }
}

customElements.define('spotify-player', SpotifyPlayer);

