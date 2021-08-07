type File = {
  id: string;
  name: string;
  files?: File[];
};

/**
 *
 * @param list nested file list
 * @param sourceFileId source file id
 * @param destinationFolderId destination folder id
 * @returns updated list
 */
export default function move(
  list: File[],
  sourceFileId: string,
  destinationFolderId: string,
): File[] {
  let sourceFile: File | undefined;
  let destinationFolder: File | undefined;

  /* helper recursive function for finding source file and destination folder
   * @param subMenuItems nested file list
   * @param sourceFileId source file id
   * @param destinationFolderId destination folder id
   * @returns void
   */
  function travelListForFindSourceAndDestination(subMenuItems: File[]): void {
    for (let i = 0; i < subMenuItems.length; i += 1) {
      const file = subMenuItems[i];
      if (file.id === sourceFileId) {
        if (file.files) {
          throw new Error('You cannot move a folder');
        }
        sourceFile = file;
        subMenuItems.splice(i, 1);
      } else if (file.id === destinationFolderId) {
        if (!file.files) {
          throw new Error('You cannot specify a file as the destination');
        }
        destinationFolder = file;
      }
      if (sourceFile && destinationFolder) {
        return;
      }

      if (file?.files && file?.files.length > 0) {
        travelListForFindSourceAndDestination(subMenuItems[i]?.files || []);
      }
    }
  }

  travelListForFindSourceAndDestination(list);

  if (!sourceFile) {
    throw new Error('Source file not found');
  } else if (!destinationFolder) {
    throw new Error('Destination folder not found');
  } else {
    destinationFolder.files = [...(destinationFolder.files || []), sourceFile];
  }

  return list;
}
