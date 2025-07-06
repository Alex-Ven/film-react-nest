import { JsonLogger } from '../../logger/json.logger';
import * as fs from 'fs';

describe('JsonLogger', () => {
  let logSpy: jest.SpyInstance;
  let appendFileSyncSpy: jest.SpyInstance;
  let existsSyncSpy: jest.SpyInstance;
  let mkdirSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    appendFileSyncSpy = jest.spyOn(fs, 'appendFileSync').mockImplementation();
    existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('должен корректно формировать JSON при вызове .log()', () => {
    const logger = new JsonLogger('/tmp/logs');
    logger.log('Test message', 'JsonContext');

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"level":"log"'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"context":"JsonContext"'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('"message":"Test message"'),
    );

    const writtenLog = JSON.parse(appendFileSyncSpy.mock.calls[0][1]);
    expect(writtenLog.level).toBe('log');
    expect(writtenLog.context).toBe('JsonContext');
    expect(writtenLog.message).toBe('Test message');
  });

  it('должен записывать stack при ошибке', () => {
    const logger = new JsonLogger('/tmp/logs');
    const error = new Error('Test error');

    logger.error('Error message', error.stack, 'JsonLogger');

    const writtenLog = JSON.parse(appendFileSyncSpy.mock.calls[0][1]);

    expect(writtenLog.level).toBe('error');
    expect(writtenLog.message).toBe('Error message');
    expect(writtenLog.stack).toBe(error.stack);
  });

  it('должен сохранять warn-сообщения в JSON', () => {
    const logger = new JsonLogger('/tmp/logs');
    logger.warn('Warning message', 'WarnContext');

    const writtenLog = JSON.parse(appendFileSyncSpy.mock.calls[0][1]);

    expect(writtenLog.level).toBe('warn');
    expect(writtenLog.context).toBe('WarnContext');
    expect(writtenLog.message).toBe('Warning message');
  });

  it('должен поддерживать debug-уровень логирования', () => {
    const logger = new JsonLogger('/tmp/logs');
    logger.debug('Debug message', 'DebugContext');

    const writtenLog = JSON.parse(appendFileSyncSpy.mock.calls[0][1]);

    expect(writtenLog.level).toBe('debug');
    expect(writtenLog.context).toBe('DebugContext');
    expect(writtenLog.message).toBe('Debug message');
  });

  it('должен работать без logsDir и не писать в файл', () => {
    const logger = new JsonLogger();

    expect(() => logger.verbose('No directory provided')).not.toThrow();

    expect(appendFileSyncSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });

  it('должен создавать директорию, если она отсутствует', () => {
    existsSyncSpy.mockReturnValue(false);

    const logger = new JsonLogger('/tmp/new_logs');
    logger.log('First message');

    expect(mkdirSyncSpy).toHaveBeenCalledWith('/tmp/new_logs', {
      recursive: true,
    });
    expect(appendFileSyncSpy).toHaveBeenCalled();
  });

  it('должен писать несколько сообщений в один файл', () => {
    const logger = new JsonLogger('/tmp/logs');

    logger.log('Message 1');
    logger.warn('Warning 1');
    logger.error('Error 1', 'stack', 'ErrorContext');

    expect(appendFileSyncSpy).toHaveBeenCalledTimes(3);

    const calls = appendFileSyncSpy.mock.calls;
    expect(JSON.parse(calls[0][1])).toMatchObject({ level: 'log' });
    expect(JSON.parse(calls[1][1])).toMatchObject({ level: 'warn' });
    expect(JSON.parse(calls[2][1])).toMatchObject({
      level: 'error',
      context: 'ErrorContext',
      stack: 'stack',
    });
  });
});
