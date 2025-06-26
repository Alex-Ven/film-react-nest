// __tests__/logger/tskv.logger.test.ts
import { TskvLogger } from '../../logger/tskv.logger';
import * as fs from 'fs';

describe('TskvLogger', () => {
  let appendFileSyncSpy: jest.SpyInstance;
  let existsSyncSpy: jest.SpyInstance;
  let mkdirSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    appendFileSyncSpy = jest.spyOn(fs, 'appendFileSync').mockImplementation();
    existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('должен форматировать лог как TSKV', () => {
    const logger = new TskvLogger('/tmp/logs');
    logger.warn('TSKV warning', 'WarnContext');

    const formatted = appendFileSyncSpy.mock.calls[0][1];

    expect(formatted).toMatch(/^timestamp=.+level=warn/);
    expect(formatted).toContain('context=WarnContext');
    expect(formatted).toContain('message=TSKV warning');
  });

  it('должен создавать директорию, если её нет', () => {
    existsSyncSpy.mockReturnValue(false);

    const logger = new TskvLogger('/tmp/new_logs');
    logger.log('First TSKV message');

    expect(mkdirSyncSpy).toHaveBeenCalledWith('/tmp/new_logs', {
      recursive: true,
    });
    expect(appendFileSyncSpy).toHaveBeenCalledWith(
      '/tmp/new_logs/app.tskv.log',
      expect.stringMatching(/^timestamp=.+level=log/),
      'utf8',
    );
  });

  it('должен обрабатывать error с stack', () => {
    const logger = new TskvLogger('/tmp/logs');
    const errorStack = 'Error: Something went wrong\nat ...';
    logger.error('Critical error', errorStack, 'TSKVLogger');

    const logLine = appendFileSyncSpy.mock.calls[0][1];

    expect(logLine).toContain('level=error');
    expect(logLine).toContain('stack=' + errorStack.replace(/\n/g, '\\n'));
  });

  it('должен игнорировать запись без директории', () => {
    const logger = new TskvLogger();
    logger.verbose('Verbose without dir');

    expect(appendFileSyncSpy).not.toHaveBeenCalled();
    expect(logger['logFile']).toBeNull();
  });

  it('должен игнорировать ошибки при записи в файл', () => {
    appendFileSyncSpy.mockImplementation(() => {
      throw new Error('FS write error');
    });

    const logger = new TskvLogger('/tmp/logs');
    expect(() => logger.warn('Warning message')).not.toThrow();
  });

  it('должен использовать разные уровни логгирования', () => {
    const logger = new TskvLogger('/tmp/logs');

    logger.debug('Debug message');
    logger.verbose('Verbose message');

    const calls = appendFileSyncSpy.mock.calls;

    expect(calls.length).toBe(2);
    expect(calls[0][1]).toContain('level=debug');
    expect(calls[1][1]).toContain('level=verbose');
  });
});
