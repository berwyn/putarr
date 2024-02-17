export class Config {
  static #instance?: Config;

  readonly oauthToken: string;
  readonly port: number;
  readonly dataDirectory: string;
  readonly watchDirectories: string[];

  private constructor() {
    const oauthToken = Deno.env.get('PUTARR_TOKEN');
    const oauthTokenSecret = Deno.env.get('PUTARR_TOKEN_SECRET');

    if (oauthToken != null) {
      this.oauthToken = oauthToken;
    } else if (oauthTokenSecret != null) {
      this.oauthToken = Deno.readTextFileSync(oauthTokenSecret);
    } else {
      throw new Error('One of `PUTARR_TOKEN` or `PUTARR_TOKEN_SECRET` needs to be defined');
    }

    const port = Deno.env.get('PUTARR_PORT') ?? '8787';

    this.port = parseInt(port, 10);

    this.dataDirectory = Deno.env.get('PUTARR_DATA_DIRECTORY') ?? '/config';

    this.watchDirectories = Deno.env.get('PUTARR_WATCH_DIRECTORIES')?.split(',') ?? [];
  }

  static getInstance(): Config {
    this.#instance ??= new Config();

    return this.#instance;
  }
}
