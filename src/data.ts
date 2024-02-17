import { ensureFileSync } from 'std/fs/mod.ts';

import { Config } from './config.ts';
import { Download, DownloadState, NewDownload } from './download.ts';

/**
 * Facade to support storing downloads and syncing them to and from Put.
 */
export class Data {
  static #instance: Data;

  #config = Config.getInstance();
  #state: Download[];

  static getInstance(): Data {
    this.#instance ??= new Data();

    return this.#instance;
  }

  private constructor() {
    ensureFileSync(this.#dataFile());

    const downloads = Deno.readTextFileSync(this.#dataFile());

    if (downloads.length) {
      this.#state = JSON.parse(downloads);
    } else {
      this.#state = [];
    }
  }

  /**
   * Adds a new download to the system.
   * @param contentUri The uri of the download
   * @returns The full download data
   */
  addDownload(contentUri: string): Download;

  /**
   * Adds a new download to the system.
   * @param download The download to be enqueued
   * @returns The full download data
   */
  addDownload(download: NewDownload): Download;

  addDownload(download: NewDownload | string): Download {
    let saved: Download;

    if (typeof download === 'string') {
      saved = {
        id: crypto.randomUUID(),
        state: DownloadState.Pending,
        contentUri: download,
      };
    } else {
      saved = {
        ...download,
        id: crypto.randomUUID(),
        state: DownloadState.Pending,
      };
    }

    this.#state.push(saved);

    Deno.writeTextFileSync(
      this.#dataFile(),
      JSON.stringify(this.#state),
      {
        create: true,
        append: false,
      },
    );

    return saved;
  }

  /**
   * Gets a download as currently known by the system
   * @param id The id of the download to look up
   * @returns The download, or `undefined` if it's not found
   */
  getById(id: string): Download | undefined {
    return this.#state.find((download) => download.id === id);
  }

  getByContentUri(uri: string): Download | undefined {
    return this.#state.find((download) => download.contentUri === uri);
  }

  async updateProgress(download: Download, abort = new AbortController()) {
    if (abort.signal.aborted) {
      return;
    }

    // TODO: get progress from Put
  }

  async syncFile(download: Download, abort = new AbortController()) {
    if (abort.signal.aborted) {
      return;
    }

    // TODO: sync file to local disk
  }

  #dataFile = () => `${this.#config.dataDirectory}/downloads.json`;
}
