class StorageInterface {
  constructor(options) {
    this.options = options;
  }

  upload(filePath) {
    // upload the file at filePath
    throw new Error("Not implemented");
  }

  download(filePath) {
    // download the file at filePath
    throw new Error("Not implemented");
  }

  delete(filePath) {
    // delete the file at filePath
    throw new Error("Not implemented");
  }
  getUrl() {
    throw new Error("Not implemented");
  }
}
export default StorageInterface;
