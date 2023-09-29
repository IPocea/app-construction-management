import { unlink } from 'fs/promises';
import * as path from 'path';
import { IProjectDocumentsData } from '../interfaces';

export const selectOsAndUnlink = async (
  selectedDocument: IProjectDocumentsData
): Promise<void> => {
  const os = process.platform;
  switch (os) {
    case 'win32':
      await unlink(
        path.resolve(
          process.cwd(),
          'apps',
          'api',
          'src',
          'files',
          selectedDocument.path
        )
      );
      break;
    case 'linux':
      await unlink(path.resolve(process.cwd(), selectedDocument.path));
      break;
    default:
      await unlink(
        path.resolve(
          process.cwd(),
          'apps',
          'api',
          'src',
          'files',
          selectedDocument.path
        )
      );
      break;
  }
};
