import { Data } from './data.ts';
import { DownloadState } from './download.ts';
import { notNull } from './utils.ts';

export class Watcher {
  #abort = new AbortController();
  #watchers: Deno.FsWatcher[] = [];
  #data = Data.getInstance();

  async watch(directory: string): Promise<void> {
    const watcher = Deno.watchFs(directory);
    this.#watchers.push(watcher);

    for await (const event of watcher) {
      if (this.#abort.signal.aborted) {
        return;
      }

      const { kind, paths } = event;

      if (kind != 'create') {
        continue;
      }

      const downloads = paths
        .map((path) => [path, this.#data.getByContentUri(path)] as const)
        .map(([path, download]) => notNull(download) ? download : this.#data.addDownload(path));

      await Promise.allSettled(
        downloads.map(async (download) => {
          await this.#data.updateProgress(download, this.#abort);

          if (download.state === DownloadState.Ready) {
            await this.#data.syncFile(download, this.#abort);
          }
        }),
      );
    }
  }

  shutdown() {
    this.#abort.abort();

    for (const watcher of this.#watchers) {
      watcher.close();
    }
  }
}
