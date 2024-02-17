/**
 * The current state of the download, both locally and on Put.
 */
export enum DownloadState {
  /**
   * The download is registered, but hasn't been submitted to Put.
   */
  Pending = 'PENDING',

  /**
   * The download has been submitted to Put, but we haven't received progress
   * information.
   */
  Queued = 'QUEUED',

  /**
   * The download has started downloading and we have progress information.
   */
  Downloading = 'DOWNLOADING',

  /**
   * The download has completed on Put and is ready to sync
   */
  Ready = 'READY',

  /**
   * The download has completed on Put and is now being synced to the local disk.
   */
  Syncing = 'SYNCING',

  /**
   * The download has completed.
   */
  Complete = 'COMPLETE',
}

export interface Download {
  /**
   * A UUID used to keep track of downloads internally.
   */
  id: string;

  /**
   * The current state of the download.
   */
  state: DownloadState;

  /**
   * The target URI for the content, e.g. a magnet or torrent uri.
   */
  contentUri: string;
}

export type NewDownload = Omit<Download, 'id' | 'state'>;
