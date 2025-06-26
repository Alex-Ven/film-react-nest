// __tests__/utils/mock-logger.utils.ts
import * as fs from 'fs';
import { PathLike } from 'fs';

export const mockFs = () => {
  return {
    existsSync: jest.spyOn(fs, 'existsSync').mockImplementation(() => true),
    mkdirSync: jest
      .spyOn(fs, 'mkdirSync')
      .mockImplementation((path: PathLike) => {
        return String(path); // или path.toString()
      }),
    writeFileSync: jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {}),
    appendFileSync: jest
      .spyOn(fs, 'appendFileSync')
      .mockImplementation(() => {}),
  };
};

export const restoreMockFs = (
  mocks: Record<string, jest.SpyInstance>,
): void => {
  Object.values(mocks).forEach((spy) => spy.mockRestore());
};
