const fs = require("fs/promises");

(async () => {
  let addedContent;
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  const commandFileHandler = await fs.open("./command.txt", "r");

  const watcher = fs.watch("./command.txt");

  const createFile = async path => {
    try {
      // We want to check whether or not we already have that file
      const existingFileHandle = await fs.open(path, "r");
      // We already have that file
      existingFileHandle.close();
      return console.log(`File ${path} already exists`);
    } catch (error) {
      const newFileHandle = await fs.open(path, "w");
      console.log("File created");
      newFileHandle.close();
    }
  };

  const deleteFile = async path => {
    try {
      await fs.unlink(path);
      console.log("The file was successfully removed.");
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log("No file at this path to remove.");
      } else {
        console.log("An error occurred while removing the file: ");
        console.log(e);
      }
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      console.log("The file was successfully renamed.");
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log(
          "No file at this path to rename. or destination doesn't exist"
        );
      } else {
        console.log("An error occurred while renaming the file: ");
        console.log(e);
      }
    }
  };

  const addToFile = async (path, content) => {
    if (addedContent === content) return;
    try {
      const fileHandle = await fs.open(path, "w");
      fileHandle.write(content);
      addedContent = content;
      fileHandle.close();
      console.log("Content added to the file");
    } catch (e) {
      console.log("An error occurred while adding content to the file: ");
      console.log(e);
    }
  };

  commandFileHandler.on("change", async () => {
    // The file was changed
    console.log("File changed");
    // Get file size
    const size = (await commandFileHandler.stat()).size;
    // Allocate a buffer of the size of the file
    const buff = Buffer.alloc(size);
    // The location at which we want to start filling our buffer
    const offset = 0;
    // How many bytes we want to read
    const length = buff.byteLength;
    // the position we want to start reading from
    const position = 0;

    // To read the content
    await commandFileHandler.read(buff, offset, length, position);

    const command = buff.toString("utf-8");

    // create a file
    // create a file path
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    // delete a file
    // delete a file path
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    // rename a file
    // rename old file <path> to <new-path>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);
      renameFile(oldFilePath, newFilePath);
    }

    // add to a file
    // add to the file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      addToFile(filePath, content);
    }
  });

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
